const notificationModel = require("./notificationModel");
const NotificationsList = require('./notificationListModel');
const dbServices = require("../../services/db.service");
const { createJobQueue } = require('../../services/bull-jobs/createJobs');
const { JOB_NAME } = require('../../configuration/constants/queueConstant');
const { GENERAL_NOTIFICATION_CRITERIA_TYPE, NOTIFICATION_TYPE, USER_TYPE } = require('../../configuration/constants/notificationsConstant');
const HTMLFormatted = require('html-to-formatted-text')
const User = require('../user/userModel');
const Wishlist = require('../wishlist/wishlistModel');
const Carts = require('../cart/cart.model');
const MyLearning = require('../purchased-progress/myLearning/myLearning.model');

const create = async (data) => {
    try {
        const result = await notificationModel.create(data).then((resp) => resp.populate({path:'imgId criteriaId typeId', select: 'name names code uri'}));
        if (data?.sendNotification && result?.typeId?.code === NOTIFICATION_TYPE.GENERAL) {
            await sendNotificationsByCriteria(result);
        }
        return result;
    } catch (error) {
        logger.error("Error - NotificationCreate", error);
        throw new Error(error);
    }
}

const update = async (id, data) => {
    try {
        const result = await notificationModel.findOneAndUpdate({ _id: id }, data, { new: true }).populate({path:'imgId criteriaId typeId', select: 'name names code uri'});
        if (data?.sendNotification && result?.isActive && result?.typeId?.code === NOTIFICATION_TYPE.GENERAL) {
            await sendNotificationsByCriteria(result);
        }
        return result;
    } catch (error) {
        logger.error("Error - NotificationUpdate", error);
        throw new Error(error);
    }
}

const partialUpdate = async (id, data) => {
    try {
        return await dbServices.updateDocument(notificationModel, id, data);
    } catch (error) {
        logger.error("Error - NotificationPartialUpdate", error);
        throw new Error(error);
    }
}

const generateNotificationQuery = async(req) => {
    let query = {};
    
    if (req.body.filter?.isActive || req.body.filter?.isActive == false) {
        query.isActive = req.body.filter?.isActive;
    }
    
    if (req.body.filter?.startDt && req.body.filter?.startDt.trim() !== '' && req.body.filter?.endDt && req.body.filter?.endDt.trim() !== '') {
        const timezone = req.header.timezone || process.env.TZ;
        const startDt = await convertToTz({ tz: timezone, date: req.body.filter?.startDt});
        const endDt = await convertToTz({ tz: timezone, date: req.body.filter?.endDt, time: "23:59:59"});
        
        query.createdAt = {
            $gte: startDt,
            $lte: endDt
        }
    }
    
    if (req.body.filter?.typeId && req.body.filter?.typeId.trim() !== '') {
        query.typeId = {$in: req.body.filter?.typeId};
    }
    return query;
}

const getList = async (req, modelName) => {
    try {
        let options = {};
        let query = {};
        const filter = await generateNotificationQuery(req);
        if (req.body?.options) {
            options = {
                ...req.body.options,
            };
            options.sort =  req.body?.options?.sort ? req.body?.options?.sort : { createdAt: -1 }
        }
        if (req.body?.query) {
            query = {
                ...req.body.query,
                ...filter,
                ...(modelName == NotificationsList ? {userId: req?.user?.id} : {}),
                deletedAt: {$exists: false}
            };
        }
        const result = await dbServices.getAllDocuments(modelName, { ...query }, options);
        return result
    } catch(error){
        logger.error("Error - notificationList", error);
        throw new Error(error);
    }
}

const softDelete = async (data) => {
    try {
        const ids = data;
        const updateData = {
            deletedAt: await convertToTz({ tz: process.env.TZ, date: new Date() }),
            isActive: false
        }
        return await dbServices.bulkUpdate(notificationModel, { _id: { $in: ids } }, updateData);
    } catch (error) {
        logger.error("Error - NotificationSoftDelete", error);
        throw new Error(error);
    }
}

const sendNotification = async (id) => {
    try {
        const result = await notificationModel.findOne({_id: id}).populate({path:'imgId criteriaId typeId', select: 'name names code uri'});
        if (result?.isActive && result?.typeId?.code === NOTIFICATION_TYPE.GENERAL) {
            await sendNotificationsByCriteria(result);
            return true;
        }
        return false;
    } catch (error) {
        logger.error("Error - sendNotification", error);
        throw new Error(error);
    }
}
/* 
    payload = {
        "title": "Notification Title",
        "body": "Notification Body"
    }
*/
const notificationQueueFunction = async(fcmToken, payload, criteriaCode) => {
    const notificationObj = {
        message: {
            token: fcmToken,
            notification: payload,
            data: {
                criteria: criteriaCode
            }
        }
      }
    await createJobQueue(JOB_NAME.SEND_NOTIFICATIONS, notificationObj); // 3rd params is optional and it is options for job.
}

const sendNotificationsByCriteria = async(data) => {
    let notificationPayload = {
        title: data?.title,
        body: HTMLFormatted(data?.desc),
        ...(data?.imgId ? {image: data?.imgId?.uri} : {})
    }

    if ((data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.ALL || data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.SELECTED_USER) && data?.users) {
        const ids = data?.users && data?.users.length ? data?.users : [];
        new Promise (async(resolve, reject) => {
            try {
                await sendToAllUsers(ids).then((allData) => {
                    allData.forEach(async(userWithFcmToken) => {
                        userWithFcmToken?.fcmToken?.forEach(async(fcmToken) => {
                            await notificationQueueFunction(fcmToken, notificationPayload, data?.criteriaId?.code);
                        })
                        if (data?.isShowList) {
                            await createNotificationList({userId: userWithFcmToken?._id }, data);
                        }
                    })
                });
                resolve();
            } catch(error) {
                reject(error);
            }
        })
    }
    if ((data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.WISHLIST || data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.PREVIOUS_ORDER || data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.CART) && (data?.courses?.length || data?.categories?.length)) {
        new Promise (async(resolve, reject) => {
            try {
                const modelName = data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.WISHLIST ? Wishlist : MyLearning;
                await sendByWishlistOrOrder(data, modelName).then((allData) => {
                    allData.forEach(async(userWithFcmToken) => {
                        userWithFcmToken?.fcmToken?.forEach(async(fcmToken) => {
                            await notificationQueueFunction(fcmToken, notificationPayload, data?.criteriaId?.code);
                        })
                        if (data?.isShowList) {
                            await createNotificationList({userId: userWithFcmToken?._id}, data);
                        }
                    })
                });
                resolve();
            } catch(error) {
                reject(error);
            }
        })
    }
    if (data?.criteriaId?.code === GENERAL_NOTIFICATION_CRITERIA_TYPE.CART && (data?.courses?.length || data?.categories?.length)) {
        new Promise (async(resolve, reject) => {
            try {
                await sendByCarts(data).then((allData) => {
                    allData.forEach(async(userWithFcmToken) => {
                        userWithFcmToken?.fcmToken?.forEach(async(fcmToken) => {
                            await notificationQueueFunction(fcmToken, notificationPayload, data?.criteriaId?.code);
                        })
                        if (data?.isShowList) {
                            await createNotificationList({userId: userWithFcmToken?._id, deviceToken: userWithFcmToken?.deviceToken}, data);
                        }
                    })
                });
                resolve();
            } catch(error) {
                reject(error);
            }
        })
    }
}

const userQuery = (ids = []) => {
    return [
        {
            $match: {
                isActive: true,
                deletedAt: { $exists: false },
                fcmToken: { $exists: true },
                deviceToken: { $exists: true },
                $expr: { $and: [{$gt: [ { $size: "$deviceToken" }, 0 ]}, {$gt: [ { $size: "$fcmToken" }, 0 ]}] },
                ...(ids && ids.length ? { _id: { $in: ids } } : {})
            }
        },
        {
            $project: {
                _id: 1,
                deviceToken: 1,
                fcmToken: 1
            }
        }
    ]
}

const matchCategoriesForWishlistAndOrder = (data) => {
    return [
        {
            $lookup: {
                from:'publishCourses',
                let: { courseId: "$courseId"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$courseId"],
                            },
                            deletedAt: {
                                $exists: false
                            },
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            parCategory: 1,
                            category: 1
                        }
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    category: {$in: data?.categories}
                                },
                                {
                                    parCategory: {$in: data?.categories}
                                }
                            ]
                        }
                    }
                ],
                as: "courseId"
            }
        }, 
        {$unwind: { path: "$courseId", preserveNullAndEmptyArrays: false }}
    ]   
}

const matchCategoriesForCarts = (data) => {
    return [
        {
            $lookup: {
                from :"publishCourses",
                let: {courses: "$courses"},
                pipeline: [
                    {
                        $match: {
                            $expr:{
                                $in: ["$_id", "$$courses"]
                            },
                            deletedAt: {
                                $exists: false
                            },
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            parCategory: 1,
                            category: 1
                        }
                    },
                    {
                        $match: {
                            $or: [
                                {
                                    category: {$in: data?.categories}
                                },
                                {
                                    parCategory: {$in: data?.categories}
                                }
                            ]
                        }
                    }
                ],
                as: "courses"
            }
        },
        {
            $match: {
                $expr: { $gt: [ { $size: "$courses" }, 0 ] }
            }
        }
    ]   
}

const sendToAllUsers = async (ids) => {
    const users = await User.aggregate([
        ...userQuery(ids)
    ]);
    return users;
}

const sendByWishlistOrOrder = async (data, modelName) => {
    const users = await modelName.aggregate([
        {
            $match: {
                deletedAt:{$exists: false},
                ...(modelName == Wishlist ? { type: 1 } : {}),
                ...(data?.courses && data?.courses.length ? {courseId: {$in: data?.courses}} : {})
            }
        },
        ...(data?.categories && data?.categories.length ? matchCategoriesForWishlistAndOrder(data) : []),
        {
            $lookup: {
                from: 'user',
                let: { id: "$userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$id"]
                            },
                            
                        },
                    },
                    ...userQuery()
                ],
                as: "userId"
            }
        }, {$unwind: {path: "$userId", preserveNullAndEmptyArrays: false}},
        {
            $project: {
                _id: "$userId._id",
                fcmToken: "$userId.fcmToken"
            }
        }
    ]);
    return users;
}

const sendByCarts = async (data) => {
    const users = await Carts.aggregate([
        ...(data?.courses && data?.courses.length ? 
            [{
            $match: {
                courses: {$in: data?.courses}
            }
        }] : []),
        ...(data?.categories && data?.categories.length ? matchCategoriesForCarts(data) : []),
        {
            $lookup: {
                from: 'user',
                let: { id: "$userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$id"]
                            },
                            
                        },
                    },
                    ...userQuery()
                ],
                as: "userId"
            }
        }, {$unwind: {path: "$userId", preserveNullAndEmptyArrays: true}},
        {
            $project: {
                _id: {$ifNull: ["$userId._id", null] },
                deviceToken: {$ifNull:["$userId.deviceToken", "$deviceToken"]},
                fcmToken: {$ifNull:["$userId.fcmToken", "$fcmToken"]}
            }
        },
        {
            $match: {
                $or: [{ _id: { $exists: true } }, { deviceToken: { $exists: true } }, { fcmToken: { $exists: true } }]
            }
        }
    ]);
    return users;
}

const floatingNotificationList = async(user, timezone) => {
    try {
        const result = await notificationModel.aggregate([
            {
                $lookup:{
                    from: 'master',
                    localField: "typeId",
                    foreignField: '_id',
                    as: 'typeId'
                }
            }, { $unwind: { path: "$typeId", preserveNullAndEmptyArrays: false}},
            {
                $lookup:{
                    from: 'master',
                    localField: "userTypeId",
                    foreignField: '_id',
                    as: 'userTypeId'
                }
            }, { $unwind: { path: "$userTypeId", preserveNullAndEmptyArrays: false}},
            {
                $lookup:{
                    from: 'master',
                    localField: "criteriaId",
                    foreignField: '_id',
                    as: 'criteriaId'
                }
            }, { $unwind: { path: "$criteriaId", preserveNullAndEmptyArrays: false}},
            {
                $match: {
                    isActive: true,
                    deletedAt:{$exists: false},
                    "typeId.code": NOTIFICATION_TYPE.FLOATING,
                    $and: [{startDt: {$lte: new Date(await convertToTz({ tz: timezone}))}}, {endDt: {$gte: new Date(await convertToTz({ tz: timezone, time: "23:59:59"}))}}],
                    ...(Object.keys(user).length ? { $or: [{$expr: { $in:[user._id, "$users"]}, "userTypeId.code": USER_TYPE.LOGGEDIN_USER}, {"userTypeId.code": USER_TYPE.USER_TYPE_ALL}, {$expr: { $eq: [{ $size: "$users" }, 0]}, "userTypeId.code": USER_TYPE.LOGGEDIN_USER}]}: {"userTypeId.code": {$ne: USER_TYPE.LOGGEDIN_USER}})
                }
            },
            {
                $lookup: {
                    from: 'publishCourses',
                    let: { courses: "$courses"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$courses"]
                                },
                                isActive: true,
                                deletedAt: {$exists: false}
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                slug: 1
                            }
                        }
                    ],
                    as: "courses"
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    let: { categories: "$categories"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$categories"]
                                },
                                isActive: true,
                                deletedAt: {$exists: false}
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                slug: 1
                            }
                        }
                    ],
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: 'pages',
                    let: { pages: "$pages"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$_id", "$$pages"]
                                },
                                deletedAt: {$exists: false}
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                slug: 1
                            }
                        }
                    ],
                    as: "pages"
                }
            },
            {
                $project: {
                    nm: 1,
                    title: 1,
                    desc: 1,
                    pages: 1,
                    courses: 1,
                    categories: 1,
                    startDt: 1,
                    endDt: 1,
                    "criteriaId.name": 1,
                    "criteriaId.code": 1
                }
            }
        ]);
        return result;
    } catch(error) {
        logger.error('Error - floatingNotificationList', error);
        throw new Error(error);
    }
}

const createNotificationList = async(userAndDeviceTokenObj, data) => {
    try {
        let storeData = {
            userId: userAndDeviceTokenObj?.userId,
            deviceToken: userAndDeviceTokenObj?.deviceToken,
            notificationId: data?._id,
            type: data?.typeId?.code
        }
        await NotificationsList.create(storeData);
    } catch (error) {
        logger.error('Error - createNotificationList', error);
        throw new Error(error);
    }
}

const updateReadStatus = async (id, data) => {
    try {
      return await NotificationsList.findOneAndUpdate({ _id: id }, data, {new: true});
    } catch (error) {
      logger.error("Error - updateReadStatus", error);
      throw new Error(error);
    }
};

const notificationCount = async (userId) => {
    try {
        return await dbServices.countDocument(NotificationsList, {userId: userId, isRead: false});
    } catch(error) {
        logger.error('Error - notificationCount', error);
        throw new Error(error);
    }
}

const updateNotificationsList = async (deviceToken, userId) => {
    try {
        if(deviceToken) {
            await NotificationsList.updateMany({ deviceToken: deviceToken }, {userId: userId}, {new: true});
        }
    } catch (error) {
      logger.error("Error - updateNotificationsList", error);
      throw new Error(error);
    }
};

module.exports = {
    create,
    update,
    partialUpdate,
    getList,
    sendNotification,
    softDelete,
    notificationQueueFunction,
    floatingNotificationList,
    updateReadStatus,
    notificationCount,
    updateNotificationsList
}