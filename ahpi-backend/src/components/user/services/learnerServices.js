const user = require('../userModel')
const {POPULATE} = require('../../../configuration/constants/userConstant')
const role = require("../../roles/roleModel");
const order = require('../../order/order.model');
const {ROLE} = require("../../../configuration/constants/authConstant");
const {getFilterQuery} = require("../../../services/filterQuery.service");
const {ObjectId} = require("mongodb");
const {convertPaginationResult} = require("../../../configuration/common");
const MyLearning = require("../../purchased-progress/myLearning/myLearning.model");
const { publishCourses } = require("../../courses/courseModel")
const dbService = require("../../../services/db.service");

const profileUpdate = async (id, data) => {
    try {
        let tokens = {}
        if (data?.deviceToken || data?.fcmToken) {
            tokens = {
                $addToSet: {
                    deviceToken: data.deviceToken,
                    fcmToken: data.fcmToken
                }
            }
            delete data.deviceToken,
            delete data.fcmToken
        }
        data = {
            ...data,
            ...tokens
        }
        return new Promise(async(resolve, reject) => {
            try {
                const result = await user.findOneAndUpdate({_id: id}, data, {
                    new: true, populate: POPULATE, select: "name firstName lastName profileId email mobNo countryCode designation"
                })
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    } catch (error) {
        logger.error("Error - updateLearner", error);
        throw new Error();
    }
}

const getList = async (data) => {
    try {
        const offset = data.options?.page > 1 ? (data.options.page - 1) * (data.options.limit) : 0;
        const limit = data.options.limit || 100;
        const roles = await role.findOne({code: ROLE.LEARNER});
        let searchQuery = {}
        if (data?.query?.search) {
            let queryData = await getFilterQuery(data?.query)
            if (queryData['$or']) {
                searchQuery = {
                    $or: queryData['$or']
                }
            }
        }
        let query = {};
        if (data?.filter?.city && data?.filter?.city?.length > 0) {
            const city = data?.filter?.city.map(cityId => {
                return ObjectId(cityId)
            });
            query = {
                ...query, 'address.cityId': {$in: city}
            }
        }
        if (data?.filter?.state && data?.filter?.state?.length > 0) {
            const stateId = data?.filter?.state.map(countryId => {
                return ObjectId(countryId)
            });
            query = {
                ...query, 'address.stateId': {$in: stateId}
            }
        }

        
        // find learner list for login instructor.
        let orderlist, allLearnerList ,listQuery, aggregateQuery = [], learnerId
        const instructorRole = await role.findOne({ code: ROLE.INSTRUCTOR })
        const isInstructorRole = data?.user?.roles.find(role => role?.roleId?.code === instructorRole?.code )

        allLearnerList = await user.find({'roles.roleId': roles._id})
        allLearnerList.map(async (learnerId)=>{
            orderlist = await order.find({"user.id" : learnerId._id }).populate("courses.courseId")
            _.map(orderlist?.courses, async (course) => {
                if(data?.user?._id == course?.userId?._id ) {
                    listQuery = {
                        '$match': {
                            _id: learnerId?._id,
                            'roles.roleId': roles._id, 
                            'deletedAt': {
                                '$exists': false
                            }, 
                            ...searchQuery, ...query
                        }
                    }
                }
            })
            
        })
        const listAllLearnerQuery = {
            '$match': {
                'roles.roleId': roles._id, 'deletedAt': {
                    '$exists': false
                }, ...searchQuery, ...query
            }
        }
        if(isInstructorRole) {
            const instructorCourse = await publishCourses.find({ userId: data?.user?._id })
            const courseId = instructorCourse.map(course => course?._id)
            const learnersCourse = await MyLearning.find({ courseId: { $in: courseId } })
            learnerId = learnersCourse.map(learnerId => learnerId?.userId)
            if (learnerId?.length) {
                listAllLearnerQuery ? listAllLearnerQuery.$match._id = { $in: learnerId } : ""
                listQuery ? listQuery.$match._id = { $in: learnerId } : ""
            } else {
                return {}
            }
        }

        if(listQuery){
            aggregateQuery = [
                listQuery
            ]
        }else {
            aggregateQuery = [
                listAllLearnerQuery
            ]
        }
        if (data?.filter?.courseId && data?.filter?.courseId?.length > 0) {
            const courseId = data?.filter?.courseId.map(courseId => {
                return ObjectId(courseId);
            })
            aggregateQuery.push({
                '$lookup': {
                    'from': 'myLearning', 'let': {
                        'userId': '$_id'
                    }, 'pipeline': [{
                        '$match': {
                            '$expr': {
                                '$eq': ['$userId', '$$userId']
                            }, 'courseId': {
                                '$in': courseId
                            }
                        }
                    }], 'as': 'course'
                }
            })
            aggregateQuery.push({
                '$addFields': {
                    'courseSize': {
                        '$size': '$course'
                    }
                }
            }, {
                '$match': {
                    'courseSize': {
                        '$gt': 0
                    }
                }
            })
        }
        aggregateQuery.push({
            '$project': {
                'name': 1, 'email': 1, 'mobNo': 1, 'totalPurchaseCourse': 1, 'isActive': 1, 'createdAt': 1
            }
        })
        aggregateQuery.push({
            '$sort': data?.options?.sort ? data.options.sort : {
                'createdAt': -1
            }
        })
        aggregateQuery.push({
            $facet: {
                metadata: [{$count: "total"}], docs: [{$skip: offset}, {$limit: limit}],
            },
        })
        const list = await user.aggregate(aggregateQuery)
        return convertPaginationResult(list, {offset, limit});
    } catch (error) {
        logger.error("Error - getLearnerList", error);
        throw new Error(error);
    }
}

const getLernerCourseDetails = async (lernerId, body) => {
    try {
        const offset = body.options?.page > 1 ? (body.options.page - 1) * (body.options.limit) : 0;
        const limit = body.options.limit || 100;
        let searchQuery;
        if (body?.query?.search) {
            searchQuery = {}
            const queryData = await getFilterQuery(body.query)
            Object.assign(searchQuery, queryData)
        }
        const query = {
            userId: ObjectId(lernerId), deletedAt: {$exists: false},
        }
        const aggregateQuery = [{
            $match: {
                ...query
            }
        }, {
            '$lookup': {
                'from': 'publishCourses', 'localField': 'courseId', 'foreignField': '_id', 'as': 'course'
            }
        }, {
            '$unwind': {
                'path': '$course', 'preserveNullAndEmptyArrays': false
            }
        }, {
            '$project': {
                'name': '$course.title', 'progress': 1, 'sts': 1, 'createdAt': 1
            }
        }]
        if (searchQuery) {
            aggregateQuery.push({
                $match: {
                    ...searchQuery
                }
            })
        }
        aggregateQuery.push({
            '$sort': body?.options?.sort ? body.options.sort : {
                'createdAt': -1
            }
        })
        aggregateQuery.push({
            $facet: {
                metadata: [{$count: "total"}], docs: [{$skip: offset}, {$limit: limit}],
            },
        })
        const list = await MyLearning.aggregate(aggregateQuery)
        return convertPaginationResult(list, {offset, limit});
    } catch (error) {
        logger.error("Error - getLearnerList", error);
        throw new Error(error);
    }
}

const partialUpdate = async (id, data) => {
    try{
        const isUpdate = await user.findOneAndUpdate({ _id : id }, data, {
            new : true,
            populate : [{
                path : "profileId",
                select : "uri"
            }]
        });
        if(isUpdate){
            return { flag : true, data : isUpdate }
        }
        return { flag : false }
    }catch (error) {
        logger.error("Error - partialUpdate ", error);
        throw new Error();
    }
}

const softLernerDelete = async (id) => {
    try {
        const ids = id;
        const data = {
            // deletedAt: await convertToTz({ tz: process.env.TZ, date: new Date() }),
            isActive: false
        }
        const result = await dbService.bulkUpdate(user, { _id: { $in: ids } }, data).then(async() => {
        });
        return result;
    } catch (error) {
        logger.error("Error - deleteInstructor", error);
        throw new Error();
    }
}

module.exports = {
    profileUpdate,
    getList: getList,
    getLernerCourseDetails: getLernerCourseDetails,
    partialUpdate: partialUpdate,
    softLernerDelete: softLernerDelete

}