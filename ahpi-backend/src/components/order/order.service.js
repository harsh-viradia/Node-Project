const dbService = require("../../services/db.service");
const Order = require("./order.model");
const user = require("../user/userModel")
const paymentModel = require("./../payment/paymentModel")
const File = require("./../file/fileModel");
const path = require('path');
const fs = require('fs');
const moment = require("moment-timezone");
const excelGeneratorHelper = require("../../helper/excelGenerator.helper");
const { getTemplate } = require("../../helper/renderMailTemplate.helper");
const templateConst = require("../../configuration/constants/templatesConstant");
const { idGenerator } = require("../../configuration/common");
const { SERIES, ORDERSTS } = require("../../configuration/constants/paymentConstant");
const { emailFunction } = require('../emails/emailServices')
const role = require('../roles/roleModel');
const { ROLE } = require('../../configuration/constants/authConstant')

const createService = async (req) => {
    try {
        const data = {
            ...req.body,
            user:{
                id: req.user.id,
                name: req.user.name,
                countryCode: req.user.countryCode,
                mobNo: req.user.mobNo,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email
            },
        }

        let earedRewards = 0
        for (let count = 0; count < data.courses.length; count++) {
            earedRewards += data?.courses[count]?.earnedRewardsForOrder ?? 0
        }
        data.earnedRewardsForOrder = earedRewards
        data.orderNo = await idGenerator(SERIES.ORDER);
        return await dbService.createDocument(Order, data);
    } catch (error) {
        logger.error("Error - createOrder", error);
        throw new Error(error)
    }
}

const generateOrderQuery = async (req) => {
    let query = {};
    if (req.body.filter?.courses && req.body.filter?.courses?.length > 0) {
        // query = { "courses.courseId": { $in: req.body.filter?.courses } }
        query["courses.courseId"] = { $in: req.body.filter?.courses }
    }

    if (req.body.filter?.sts) {
        query.sts = req.body.filter?.sts;
    }

    if (req.body.filter?.coupon?.length) {
        // query = { "coupon.couponCode": { $in: req.body.filter?.coupon } };
        query["coupon.couponCode"] = { $in: req.body.filter?.coupon };
    }

    if (req.body.filter?.startDate && req.body.filter?.startDate.trim() !== '' && req.body.filter?.endDate && req.body.filter?.endDate.trim() !== '') {
        const timezone = req.header.timezone || process.env.TZ;
        const startDate = moment.tz(req.body.filter?.startDate, timezone).hour(0).minute(0).second(0)
        const endDate = moment.tz(req.body.filter?.endDate, timezone).hour(23).minute(59).second(59)

        query.createdAt = {
            $gte: startDate,
            $lte: endDate
        }
    }

    if (req.body.filter?.payMethod && req.body.filter?.payMethod.trim() !== '') {
        query.payMethod = req.body.filter?.payMethod;
    }

    if (req.body.filter?.["user.id"] && req.body.filter?.["user.id"].length > 0) {
        Object.assign(query, { "user.id": req.body.filter["user.id"] })
    }
    return query;
}

const listOrders = async (req) => {
    try {
        let options = {};
        let query = {};
        const filter = await generateOrderQuery(req);
        if (req.body?.options) {
            options = {
                ...req.body.options,
            };
            options.sort = req.body?.options?.sort ? req.body?.options?.sort : { createdAt: -1 }
        }

        let instructorRole = await role.findOne({ code: ROLE.INSTRUCTOR })
        if (req?.user?.roles[0]?.roleId?._id.equals(instructorRole._id)) {
            const courseList = await publishcourse.find({ userId: req.user?._id }, { _id: 1 })
            const courseIdArr = courseList.reduce((arr, course) => {
                arr.push(course._id)
                return arr
            }, [])
            if (req.body?.query) {
                query = {
                    ...req.body.query,
                    ...filter,
                    "courses.courseId": { $in: courseIdArr },
                    deletedAt: { $exists: false }
                };
            }
        } else {
            if (req.body?.query) {
                query = {
                    ...req.body.query,
                    ...filter,
                    deletedAt: { $exists: false }
                };
            }
        }

        const result = await dbService.getAllDocuments(Order, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - getOrderList", error);
        throw new Error(error);
    }
}

const exportOrders = async (req) => {
    req.body.filter = {
        sts: parseInt(req.query?.sts),
        courses: req.query?.courses?.split(','),
        startDate: req.query?.startDate,
        endDate: req.query?.endDate,
        "user.id": req.query?.userId?.split(','),
        payMethod: req.query?.payMethod
    }
    req.body.options = {
        "pagination": false
    },
        req.body.query = {
            search: req.query.search,
            searchColumns: req.query?.searchColumns?.split(','),
        }
    const result = await listOrders(req);
    const columns = [
        { header: 'Sr. No.', key: 'srNo' },
        { header: 'Order No.', key: 'orderNo' },
        { header: 'User Name', key: 'userName' },
        { header: 'Date', key: 'date' },
        { header: 'Payment Method', key: 'paymentMethod' },
        { header: 'Total Amount', key: 'totalAmount' },
        { header: 'Status', key: 'status' },
        { header: 'Coupon No', key: 'couponCode' },
        { header: 'Coupon Amount', key: 'couponAmount' },
        { header: 'Course Name', key: 'courseName' },
    ]

    const fileName = `order-list-sheet-${moment(new Date()).format("DDMMYYYY")}-${moment().format("HHmmss-a")}`;

    const data = result.data.map((item, index) => {
        let courseName = "";
        if (item.courses && item.courses.length > 0) {
            courseName = item.courses.map(course => {
                return course.nm + "-" + course.price
            }).join(",");
        }
        return {
            srNo: index + 1,
            orderNo: item?.orderNo || '-',
            userName: item?.user?.name || '-',
            date: item?.createdAt ? moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss") : '-',
            paymentMethod: item?.payMethod || '-',
            totalAmount: item?.grandTotal || '-',
            status: item?.sts == 1 ? ORDERSTS.SUCCESS : item?.sts == 2 ? ORDERSTS.PENDING : ORDERSTS.FAILED || '-',
            couponCode: item?.coupon?.couponCode || '-',
            couponAmount: item?.coupon?.couponAmt || '-',
            courseName: courseName || '-',
        }
    })
    const { workbook } = await excelGeneratorHelper.exportToExcel('Sheet', columns, data);
    return {
        workbook, fileName: `${fileName}.xlsx`
    }
}

const sendInvoice = async (orderId) => {
    try {
        const order = await Order.findOne({ _id: orderId }).populate("receiptId")
        // const emailData = {
        //     name: order.userId.name,
        //     email: order.userId.email,
        //     // planNm: order.subscriptionId.name,
        // };
        // const template = await getTemplate(
        //     templateConst.PAYMENT_SUCCESSFUL,
        //     emailData
        // );
        const name = order?.user?.firstName && order?.user?.lastName ? order?.user?.firstName + " " + order?.user?.lastName : order?.user?.name
        const payload = {
            userNm: name,
            invoiceLink: order.receiptId?.uri
        };

        await emailFunction("SEND_INVOICE", order.user, payload)
    } catch (error) {
        logger.error("Error - sendInvoice", error)
        throw new Error(error)
    }
}

const getOrder = async (orderNo) => {
    const result = await Order.aggregate([
        {
            $match: {
                orderNo: orderNo,
                deletedAt: { $exists: false },
                isActive: true
            },
        },
        { $unwind: "$courses" },
        {
            $lookup: {
                from: 'publishCourses',
                let: { course: "$courses.courseId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$course"]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            let: { category: '$parCategory' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $in: ["$_id", "$$category"]
                                        },
                                        deletedAt: {
                                            $exists: false
                                        },
                                        isActive: true
                                    }
                                },
                                {
                                    $project: {
                                        name: 1
                                    }
                                }
                            ],
                            as: 'parCategory'
                        }
                    },
                    {
                        $lookup: {
                            from: 'file',
                            let: { id: "$imgId" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$id"]
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        uri: 1,
                                        nm: 1,
                                        oriNm: 1
                                    }
                                }
                            ],
                            as: "imgId"
                        }
                    },
                    { $unwind: { path: "$imgId", preserveNullAndEmptyArrays: true } },
                    // {
                    //     $lookup: {
                    //         from: 'reviews',
                    //         let: { id: "$_id" },
                    //         pipeline: [
                    //             {
                    //                 $match: {
                    //                     $expr: {
                    //                         $eq: ["$courseId", "$$id"]
                    //                     },
                    //                     deletedAt: { $exists: false },
                    //                     isActive: true
                    //                 }
                    //             },
                    //         ],
                    //         as: "reviews"
                    //     }
                    // },
                    // {
                    //     $addFields: {
                    //         avgStars: {
                    //             $cond: {
                    //                 if: { $ne: [{ $size: "$reviews" }, 0] },
                    //                 then: { $round: [{ $divide: [{ $sum: "$reviews.stars" }, { $size: "$reviews" }] }, 1] },
                    //                 else: 0
                    //             }
                    //         },
                    //         totalReviews: { $size: "$reviews" }
                    //     }
                    // },
                    // {
                    //     $project: {
                    //         reviews: 0
                    //     }
                    // }
                ],
                as: "courses.courseId"
            }
        },
        { $unwind: { path: "$courses.courseId", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                "courses.avgStars": "$courses.courseId.avgStars",
                "courses.parCategory": "$courses.courseId.parCategory",
                "courses.imgId": "$courses.courseId.imgId",
                "courses.totalReviews": "$courses.courseId.totalReviews",
                // "courses.ratings": "$courses.courseId.ratings",
                "courses.totalLessons": "$courses.courseId.totalLessons",
                "courses.totalLength": "$courses.courseId.totalLength",
                "courses.rewardPoints": "$courses.courseId.rewardPoints"
            }
        },
        { $unset: "courses.courseId" },
        {
            $group: {
                _id: "$_id",
                "orderNo": { $first: "$orderNo" },
                "userId": { $first: "$user" },
                "payMethod": { $first: "$payMethod" },
                "courses": { $push: "$courses" },
                "sts": { $first: "$sts" },
                "coupon": { $first: "$coupon" },
                "currency": { $first: "$currency" },
                "subTotal": { $first: "$subTotal" },
                "tax": { $first: "$tax" },
                "totalCourses": { $first: "$totalCourses" },
                "grandTotal": { $first: "$grandTotal" },
                "usedRewardsForOrder": { $first: "$usedRewardsForOrder" }
            }
        }
    ])
    return result;
}

module.exports = {
    createService: createService,
    listOrders: listOrders,
    exportOrders: exportOrders,
    sendInvoice: sendInvoice,
    getOrder
}
