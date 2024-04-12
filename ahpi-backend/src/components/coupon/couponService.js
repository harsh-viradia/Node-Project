const Coupon = require('./couponModel');
const Cart = require('../cart/cart.model');
const Order = require('../order/order.model');
const { ORDERSTATUS } = require("../../configuration/constants/paymentConstant");
const dbServices = require('../../services/db.service');
const { getCart } = require('../cart/cart.service');
const { COUPON_CRITERIA, COUPON_TYPES } = require('../../configuration/constants/couponConstants');
const { ObjectId } = require('mongodb');
const { convertToObjectId } = require('../../configuration/common');


const codeExists = async ({ id, data }) => {
    return await Coupon.findOne({ code: data.code, ...( id ? { _id: { $ne: id } } : {}), deletedAt : { $exists : false } });
}

const createCoupon = async(data) => {
    try {
        if (await codeExists({ data })) {
            return false;
        }
        return await Coupon.create(data);
    } catch(error) {
        logger.error('Error - createCoupon', error);
        throw new Error(error);
    }
};

const updateCoupon = async(id, data) => {
    try {
        if (await codeExists({ id, data })) {
            return false;
        }
        return await Coupon.findOneAndUpdate({ _id: id }, data, { new: true });
    } catch(error) {
        logger.error('Error - updateCoupon', error);
        throw new Error(error);
    }
};

const couponList = async (req) => {
    try {
        let options = {};
        let query = {};
        if (req.body?.options) {
            options = {
                ...req.body.options,
            };
            options.sort =  req.body?.options?.sort ? req.body?.options?.sort : { createdAt: -1 }
        }
        if (req.body?.query) {
            query = {
                ...req.body.query,
            };
        }
        return await dbServices.getAllDocuments(Coupon, { ...query }, options);
    } catch(error){
        logger.error("Error - couponList", error);
        throw new Error(error);
    }
};

const partialUpdateCoupon = async (id, data) => {
    try {
        return await dbServices.updateDocument(Coupon, id, data);
    } catch (error) {
        logger.error("Error - partialUpdateCoupon", error);
        throw new Error(error);
    }
}

const softDeleteCoupon = async (data) => {
    try {
        return await dbServices.bulkUpdate(Coupon, { _id: { $in: data?.ids } }, data);
    } catch (error) {
        logger.error("Error - softDeleteCoupon", error);
        throw new Error(error);
    }
}

const applyCoupon = async(data) => {
    try {
        let getCourses;
        const checkCouponExists = await Coupon.findOne({ code: data?.code, isActive: true }).populate('criteriaId typeId');
        const cartExistsOrNot = await Cart.findOne( data?.userId ? { userId: data?.userId } : { deviceToken: data?.deviceToken });
        if(!cartExistsOrNot) {
            return {flag: false, data: "specificMsg.emptyCartCoupon" };
        }
        if(!checkCouponExists) {
            return {flag: false, data: "specificMsg.couponInvalid" };
        }
        if (await convertToTz({ tz: data?.timezone, date: checkCouponExists?.expireDate }) < await convertToTz({ tz: data?.timezone, date: new Date(), timezone: "23:59:59" })) {
            return {flag: false, data: "specificMsg.couponExpire"};
        }
        if(data?.userId) {
            const totalCouponUsedByUser = await Order.find({ sts: ORDERSTATUS.SUCCESS, "user.id" : data?.userId, "coupon.couponCode": data?.code });
            if (checkCouponExists?.totalPurchase <= totalCouponUsedByUser?.length || (checkCouponExists?.users?.length && !checkCouponExists?.users.includes(ObjectId(data.userId))) ) {
                return {flag: false, data: "specificMsg.couponInvalidForUser" };
            }
        }
        const totalCouponUsed = await Order.find({ sts: ORDERSTATUS.SUCCESS, "coupon.couponCode": data?.code });
       
        if (checkCouponExists?.totalUse <= totalCouponUsed?.length) {
            return {flag: false, data: "specificMsg.couponExpire"};
        }
        if (checkCouponExists?.typeId?.code === COUPON_TYPES.BUY_X_GET_X && data?.courses) {
            const courseIds = await convertToObjectId(data?.courses);
            const checkCourses = await Coupon.findOne({code: data?.code, isActive: true, buyCourses: {$not:{ $elemMatch: { $nin: courseIds}}} }).populate([{ path: 'getCourses', populate: {path: 'parCategory imgId', select: "name slug nm uri"},select: 'title slug price totalLessons category'}]);
            if(!checkCourses) {
                return {flag: false, data: "specificMsg.couponInvalidForCourse" };
            }
            getCourses = checkCourses?.getCourses.filter(getCourse => courseIds.includes(getCourse._id)).length ? checkCourses?.getCourses.filter(getCourse => courseIds.includes(getCourse._id)) : checkCourses?.getCourses;
        }
        if(checkCouponExists?.typeId?.code !== COUPON_TYPES.BUY_X_GET_X && (checkCouponExists?.criteriaId?.code === COUPON_CRITERIA.COUPON_CRITERIA_COURSES && data?.courses) || (checkCouponExists?.criteriaId?.code === COUPON_CRITERIA.COUPON_CRITERIA_CATEGORIES && data?.categories)) {
            let courseOrCategory = data?.courses && checkCouponExists?.criteriaId?.code === COUPON_CRITERIA.COUPON_CRITERIA_COURSES ? { buyCourses: {$all: data?.courses } } : { buyCategories: {$all: data?.categories} };
            const checkCoursesOrCategories = await Coupon.findOne({code: data?.code, isActive: true, ...courseOrCategory });
            if(!checkCoursesOrCategories) {
                let errorMsg = data?.courses && checkCouponExists?.criteriaId?.code === COUPON_CRITERIA.COUPON_CRITERIA_COURSES ? "specificMsg.couponInvalidForCourse" : "specificMsg.couponInvalidForCategory"
                return {flag: false, data: errorMsg };
            }
        }
        let updateObj = {
            coupon: {
                couponAmt: checkCouponExists?.discountAmount,
                couponCode: data?.code,
                couponType: checkCouponExists?.typeId,
                couponPercent: checkCouponExists?.discountPercentage
            },
        }
        await Cart.findOneAndUpdate( data?.userId ? { userId: data?.userId } : { deviceToken: data?.deviceToken }, updateObj, { new: true });
        let result = await getCart({deviceToken: data?.deviceToken, userId: data?.userId});
        getCourses?.length ? result[0].getCourses = getCourses : result;
        return {flag: true, data: result};
    } catch(error) {
        logger.error('Error - applyCoupon', error);
        throw new Error(error);
    }
}

module.exports = {
    createCoupon,
    updateCoupon,
    couponList,
    partialUpdateCoupon,
    softDeleteCoupon,
    applyCoupon
}