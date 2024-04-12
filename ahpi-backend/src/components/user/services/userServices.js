const user = require("../userModel");
const Role = require('../../roles/roleModel')
const dbService = require("../../../services/db.service");
const { ObjectId } = require("mongodb");
const { ROLE } = require('../../../configuration/constants/authConstant')
const { POPULATE } = require('../../../configuration/constants/userConstant')
const { randomPasswordGenerator } = require('../../../configuration/common')
const bcrypt = require("bcrypt")
const { emailFunction } = require('../../emails/emailServices')
const { addSubscriber, updateSubscriber } = require('../../../services/novuService')
const courseService = require("../../courses/services/courseService")
const { MAIL_EVENT_NAMES } = require("../../../configuration/constants/novu.constant")

const SELECT = {
    name: 1,
    "countryCode": 1,
    mobNo: 1,
    email: 1,
    firstName: 1,
    isActive: 1,
    companyNm: 1,
    agreement: 1,
    profileId: 1,
    _id: 1
}

//check wether user is exist in database (field : email, mobile number)
const isUserExist = async ({ id, data }) => {
    const mobileNum = await user.findOne({ mobNo: data.mobNo, ...(id ? { _id: { $ne: id } } : {}) });
    const email = await user.findOne({ email: data.email, ...(id ? { _id: { $ne: id } } : {}) });

    if (!mobileNum) {
        if (!email) {
            return { flag: true }
        }
        return { flag: false, data: "auth.emailExists" }
    } else {
        return { flag: false, data: "auth.mobNoExists" }
    }
}

//add User.
const createUser = async (data) => {
    try {
        let isExist = await isUserExist({ data });
        if (!isExist.flag) {
            return { flag: false, data: isExist.data }
        }
        const randomPassword = await randomPasswordGenerator()
        data.passwords = {
            pass: randomPassword,
        };

        if (data?.passwords?.pass) {
            data.passwords.pass = await bcrypt.hash(data.passwords?.pass, 8);
            data.passwords.createdAt = await convertToTz({ tz: process.env.TZ, date: new Date() });
        }
        const result = await user.create(data)

        const createdUser = await user.findOne({ _id: result?._id }, { ...SELECT }).populate("profileId")
        await addSubscriber(result);

        let emailData = {
            userNM: `${data.firstName} ${data?.lastName ?? ""}`,
            EMAILID: data.email,
            PASSWORD: randomPassword
        }
        let eventNm = MAIL_EVENT_NAMES.WELCOME_NOTIFICATION

        await emailFunction(eventNm, result, emailData)
        const resp = {
            "name": result.name,
            "countryCode": result.countryCode,
            mobNo: result.mobNo,
            email: result.email,
            firstName: result.firstName,
            isActive: result.isActive,
            companyNm: result.companyNm ?? "",
            agreement: {
                courseLimit: result.agreement.courseLimit,
                isApproved: result.agreement.isApproved
            },
            profileId: createdUser?.profileId?.uri,
            _id: result._id
        }
        return { flag: true, data: resp };

    } catch (error) {
        logger.error("Error - CreateUser", error);
        throw new Error();
    }
}

//update User.
const updateUser = async (req) => {
    try {
        let data, id, courseLimit
        id = req.params.id
        data = req.body
        courseLimit = req?.body?.agreement?.courseLimit
        let isExist = await isUserExist({ id, data });
        if (!isExist.flag) {
            return { flag: false, data: isExist.data }
        }

        const isCreateCourseLimitReached = await courseService.courseCount({ id, courseLimit, isAdminUpdate: true })
        if (!isCreateCourseLimitReached?.flag) {
            isCreateCourseLimitReached.data = "module.notUpdate"
            return isCreateCourseLimitReached
        }
        const result = await user.findOneAndUpdate({ _id: id }, data, { new: true, populate: POPULATE, fields: SELECT  })
       
        return { flag: true, data: result ?? {} };
    } catch (error) {
        logger.error("Error - updateUser", error);
        throw new Error();
    }
}

//partial update
const partialUpdate = async (id, data) => {
    try {
        return await user.findOneAndUpdate({ _id: id }, data, {
            new: true,
            populate: POPULATE
        });
    } catch (error) {
        logger.error("Error - partialUpdateUser", error);
        throw new Error();
    }
}

//get list.
const getList = async (data, onlyInstructor) => {
    try {
        let options = {};
        let query = {};
        const instructorOrLearner = await Role.find({ code: { $in: [ROLE.INSTRUCTOR, ROLE.LEARNER] } }).sort({ weight: 1 }).select('id code');
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort = data?.options?.sort ? data.options.sort : { createdAt: -1 }
        }
        if (data?.query) {
            const instructorId = instructorOrLearner.find(role => role.code == ROLE.INSTRUCTOR)
            let roleQuery = onlyInstructor ? { $in: [ObjectId(instructorId._id)] } : { $nin: instructorOrLearner.map((id => ObjectId(id))) }
            query = {
                ...data.query,
                ...data.filter,
                "roles.roleId": data.filter && data.filter.roleId ? data.filter.roleId : roleQuery,
                deletedAt: { $exists: false }
            };
        }
        const result = await dbService.getAllDocuments(user, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - getUserList", error);
        throw new Error(error);
    }
}
//softdelete user.
const softDeleteUser = async (id) => {
    try {
        const ids = id;
        const data = {
            deletedAt: await convertToTz({ tz: process.env.TZ, date: new Date() }),
            isActive: false
        }
        return await dbService.bulkUpdate(user, { _id: { $in: ids } }, data)
    } catch (error) {
        logger.error("Error - deleteUser", error);
        throw new Error();
    }
}

module.exports = {
    createUser,
    updateUser,
    softDeleteUser,
    getList,
    partialUpdate
};
