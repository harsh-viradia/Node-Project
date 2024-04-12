const moment = require("moment-timezone");
const midtransClient = require('midtrans-client');
const Order = require('../order/order.model')
const Settings = require('../settings/settings.model')
const { Master } = require("@knovator/masters-node")
const User = require("../user/userModel")
const { publishCourses } = require("../courses/courseModel")
const { REWARD } = require("../../configuration/constants/settingConstants")
const myEarningModel = require("../my-earning/myEarningModel")
const Transactions = require('./paymentModel')
const File = require('../file/fileModel')
const { idGenerator } = require('../../configuration/common')
const path = require('path')
const axios = require('axios')
const excelGeneratorHelper = require("../../helper/excelGenerator.helper");
const dbService = require('../../services/db.service')
const Cart = require('../cart/cart.model')
const { addCourseToMyLearning } = require("../purchased-progress/myLearning/myLearning.service");
const { ORDERSTATUS, TYPE, CURRENCY, STATUS, SERIES, APPROVAL_CODE } = require("../../configuration/constants/paymentConstant");
const { FILE_URI } = require("../../configuration/constants/fileConstants");
const { updateCourseAndCategory } = require("../widget/widgetServices");
const { generatePdfAndUpload } = require('../../services/generatePdfAndUpload');
const { emailFunction } = require('../emails/emailServices')
const { sendInvoice } = require('../order/order.service')

const transactionRedirectUrl = async (data, req) => {
    try {
        const getOrder = await Order.findOneAndUpdate({ orderNo: data?.orderNo }, { addressId: data?.addressId }, { new: true }).populate({ path: 'userId addressId' });
        const transactions = await Transactions.findOne({ orderId: getOrder?._id })
        let result
        if (transactions) {
            return { flag: false }
        } else if (data.amt == 0) {
            const saveResponse = {
                approval_code: APPROVAL_CODE.SKILLS_APPROVAL_CODE,
                transaction_time: null,
                signature_key: null,
                status_code: 200,
                fraud_status: "accept",
                settlement_time: null,
                merchant_id: null
            }

            let master = await getPaymentStatus(STATUS.SETTLEMENT)
            const transData = {
                transNo: await idGenerator(SERIES.TRANS),
                amt: data?.amt,
                currency: getOrder.currency,
                payType: null,
                type: null,
                payTransId: null,
                remark: "transaction is bypass, due to amt is 0 | it is free",
                res: saveResponse,
                stsId: master?._id,
                stsNm: master?.name,
                orderId: getOrder?._id,
                userId: getOrder?.userId?._id,
            }
            await Transactions.create(transData)

            await Promise.all(_.map(getOrder.courses, async (course) => {
                await addCourseToMyLearning(course.courseId, getOrder?.userId?._id)
                await Cart.deleteMany({ userId: getOrder?.userId?._id, courses: { $in: course?.courseId } }),
                    await User.findOneAndUpdate({ _id: getOrder?.userId?._id }, { $inc: { totalPurchaseCourse: getOrder?.totalCourses } }, { new: true }),
                    await updateCourseAndCategory()

                //create myEarning doc.
                const courseDoc = await publishCourses.findOne({ _id: course?.courseId }).populate("userId")
                const date = new Date()
                const myEarningData = {
                    instructorId: courseDoc?.userId?._id,
                    courseId: courseDoc?._id,
                    courseNm: courseDoc?.title,
                    earnings: [
                        {
                            totalEarning: 0,
                            month: date.getMonth() + 1,
                            year: date.getFullYear()
                        }
                    ],
                    createdBy: courseDoc?.userId?._id
                }
                await myEarningModel.findOneAndUpdate({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id }, myEarningData, { upsert: true, new: true })

            }))

            //update rewards for user
            let earnedReward = 0, usedReward = 0
            earnedReward = getOrder?.userId?.earnedRewards + getOrder?.earnedRewardsForOrder - getOrder?.usedRewardsForOrder
            usedReward = getOrder?.usedRewardsForOrder + getOrder?.userId?.usedRewards
            await User.findOneAndUpdate({ _id: getOrder?.userId?._id }, { usedRewards: usedReward, earnedRewards: earnedReward })

            let reward_deduct_amt = 0, coupon_deduct_per = 0;

            let coupon_per = getOrder?.coupon?.couponPercent
            let sellPrice = getOrder?.subTotal
            coupon_deduct_per = (sellPrice * coupon_per) / 100;
            coupon_deduct_per = !coupon_deduct_per || isNaN(coupon_deduct_per) ? 0 : coupon_deduct_per

            let reward_code = await Settings.findOne({ code: REWARD.REWARD_CALC });

            reward_deduct_amt = (getOrder?.usedRewardsForOrder * reward_code?.details?.price) / reward_code?.details?.reward;
            reward_deduct_amt = !reward_deduct_amt || isNaN(reward_deduct_amt) ? 0 : reward_deduct_amt

            let invoiceData = {
                invNo: await idGenerator(SERIES.INV),
                date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD-MM-YYYY' }),
                name: getOrder?.userId?.name,
                address: getOrder?.addressId?.addrLine1 ? `${getOrder?.addressId?.addrLine1}, ${getOrder?.addressId?.addrLine2 ? `${getOrder?.addressId?.addrLine2}, ` : ""}${getOrder?.addressId?.cityNm}, ${getOrder?.addressId?.stateNm}, ${getOrder?.addressId?.countryNm} - ${getOrder?.addressId?.zipcode}` : '-',
                countryCode: getOrder?.userId?.countryCode,
                phone: getOrder?.userId?.mobNo,
                email: getOrder?.userId?.email,
                courses: getOrder?.courses,
                tax: getOrder?.tax,
                coupon_disc: getOrder?.coupon?.couponAmt ? getOrder.coupon.couponAmt : coupon_deduct_per,
                reward_points: reward_deduct_amt,
                total: 0,
                subTotal: 0,
                totalCourses: getOrder?.totalCourses,
                discountCode: getOrder?.discount?.discountCode || "-",
                discountAmt: getOrder?.discount?.discountAmt,
                discountType: getOrder?.discount?.discountType || "-",
                paymentType: transData?.type || "",
                transactionSts: transData?.stsNm || "",
                transNo: transData?.transNo || '-',
                userId: transData?.userId?._id
            }
            const pdfObj = {
                ejsFile: path.join(baseDir, "/public/templates/invoice.ejs"),
                options: {
                    format: 'A4',
                    printBackground: true,
                    preferCSSPageSize: true
                }
            }

            generatePdfAndUpload(pdfObj, invoiceData, FILE_URI.INVOICES).then(async (receiptId) => {
                await Promise.all([
                    Order.findOneAndUpdate({ orderNo: data.orderNo }, { sts: ORDERSTATUS.SUCCESS, receiptId: receiptId, receiptNo: invoiceData?.invNo }, { new: true }).then((resp) => sendInvoice(resp?._id)),
                    //  sendInvoice(getOrder?._id)
                ])
            })
            return { flag: "FREEPURCHASE" }
        } else {
            const getUser = await User.findOne({ _id: getOrder.userId })
            let snap = new midtransClient.Snap({
                isProduction: process.env.MIDTRANS_PRODUCTION == 'true' ? true : false,
                serverKey: process.env.MIDTRANS_SERVER_KEY,
                clientKey: process.env.MIDTRANS_CLIENT_KEY
            });
            await snap.createTransaction(
                {

                    transaction_details: {
                        order_id: data.orderNo,
                        gross_amount: data.amt,
                        currency: getOrder.currency
                    }, "credit_card": {
                        "secure": true
                    },
                    customer_details: {
                        name: getUser.name,
                        email: getUser.email,
                        phone: getUser.mobNo
                    }
                }
            ).then((response) => {
                result = {
                    redirection_url: response
                }
            }).catch((error) => {
                logger.error('Errpr - redirectionUrl ', error)
                throw new Error(_localize("module.alreadyUsed", req, 'order Id'))
            })

            return result
        }
    } catch (error) {
        logger.error('Error - transactionRedirectUrl', error);
        throw new Error(error)
    }
}

const getTransactionStatus = async (res, midOrderId) => {
    try {
        const config = {
            url: `${process.env.MIDTRANS_BASE_URL}/v2/${midOrderId}/status`,
            headers: {
                "Authorization": `Basic ${process.env.MIDTRANS_AUTH_STRING}`
            },
            method: "GET",
        };
        const response = await axios(config).catch((error) => {
            if (error) throw new Error(error);
        });
        const data = response.data
        const saveResponse = {
            approval_code: data.approval_code,
            transaction_time: data.transaction_time,
            signature_key: data.signature_key,
            status_code: data.status_code,
            fraud_status: data.fraud_status,
            settlement_time: data.settlement_time,
            merchant_id: data.merchant_id
        }
        let order = await Order.findOne({ orderNo: data.order_id }).populate({ path: 'userId addressId' })
        let master = await getPaymentStatus(data.transaction_status)
        const transData = {
            transNo: await idGenerator(SERIES.TRANS),
            amt: data?.gross_amount,
            currency: data?.currency,
            payType: data?.payment_type,
            type: TYPE.MT,
            payTransId: data?.transaction_id,
            remark: data?.status_message,
            res: saveResponse,
            stsId: master?._id,
            stsNm: master?.name,
            orderId: order?._id,
            userId: order?.userId?._id,
        }
        await Transactions.create(transData)

        let stsCode = await getOrderStatus(master.code)

        if (stsCode == ORDERSTATUS.SUCCESS) {
            await Promise.all(_.map(order.courses, async (course) => {
                await addCourseToMyLearning(course.courseId, order?.userId?._id)
                await Cart.deleteMany({ userId: order?.userId?._id, courses: { $in: course?.courseId } }),
                    await User.findOneAndUpdate({ _id: order?.userId?._id }, { $inc: { totalPurchaseCourse: order?.totalCourses } }, { new: true }),
                    await updateCourseAndCategory()

                //create myEarning doc.
                const courseDoc = await publishCourses.findOne({ _id: course?.courseId }).populate("userId")
                const instructorEarnings = await myEarningModel.findOne({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id })
                const earningAmt = (instructorEarnings?.earnings?.[0]?.totalEarning ?? 0) + (courseDoc?.price.sellPrice * (courseDoc?.userId?.agreement?.payedPercent / 100))
                const date = new Date()
                const myEarningData = {
                    instructorId: courseDoc?.userId?._id,
                    courseId: courseDoc?._id,
                    courseNm: courseDoc?.title,
                    earnings: [
                        {
                            totalEarning: earningAmt.toFixed(2),
                            month: date.getMonth() + 1,
                            year: date.getFullYear()
                        }
                    ],
                    createdBy: courseDoc?.userId?._id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                await myEarningModel.findOneAndUpdate({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id }, myEarningData, { upsert: true })
            }))

            //update rewards for user
            let earnedReward = 0, usedReward = 0
            earnedReward = order?.userId?.earnedRewards + order?.earnedRewardsForOrder - order?.usedRewardsForOrder
            usedReward = order?.usedRewardsForOrder + order?.userId?.usedRewards
            await User.findOneAndUpdate({ _id: order?.userId?._id }, { usedRewards: usedReward, earnedRewards: earnedReward })


            let reward_deduct_amt = 0, coupon_deduct_per = 0;

            let coupon_per = order?.coupon?.couponPercent
            let sellPrice = order?.subTotal
            coupon_deduct_per = (sellPrice * coupon_per) / 100;
            coupon_deduct_per = !coupon_deduct_per || isNaN(coupon_deduct_per) ? 0 : coupon_deduct_per

            let reward_code = await Settings.findOne({ code: REWARD.REWARD_CALC });

            reward_deduct_amt = (order?.usedRewardsForOrder * reward_code?.details?.price) / reward_code?.details?.reward;
            reward_deduct_amt = !reward_deduct_amt || isNaN(reward_deduct_amt) ? 0 : reward_deduct_amt

            let invoiceData = {
                invNo: await idGenerator(SERIES.INV),
                date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD-MM-YYYY' }),
                name: order?.userId?.name,
                address: order?.addressId?.addrLine1 ? `${order?.addressId?.addrLine1}, ${order?.addressId?.addrLine2 ? `${order?.addressId?.addrLine2}, ` : ""}${order?.addressId?.cityNm}, ${order?.addressId?.stateNm}, ${order?.addressId?.countryNm} - ${order?.addressId?.zipcode}` : '-',
                countryCode: order?.userId?.countryCode,
                phone: order?.userId?.mobNo,
                email: order?.userId?.email,
                courses: order?.courses,
                tax: order?.tax,
                coupon_disc: order?.coupon?.couponAmt ? order.coupon.couponAmt : coupon_deduct_per,
                reward_points: reward_deduct_amt,
                total: order?.grandTotal,
                subTotal: order?.subTotal,
                totalCourses: order?.totalCourses,
                discountCode: order?.discount?.discountCode || "-",
                discountAmt: order?.discount?.discountAmt,
                discountType: order?.discount?.discountType || "-",
                paymentType: transData?.type || "",
                transactionSts: transData?.stsNm || "",
                transNo: transData?.transNo || '-',
                userId: transData?.userId?._id
            }
            // const pdfPath = path.join(baseDir, "/public/templates/invoice.ejs");
            const pdfObj = {
                ejsFile: path.join(baseDir, "/public/templates/invoice.ejs"),
                options: {
                    format: 'A4',
                    printBackground: true,
                    preferCSSPageSize: true
                }
            }
            generatePdfAndUpload(pdfObj, invoiceData, FILE_URI.INVOICES).then(async (receiptId) => {
                await Promise.all([
                    Order.findOneAndUpdate({ orderNo: data.order_id }, { sts: ORDERSTATUS.SUCCESS, receiptId: receiptId, receiptNo: invoiceData?.invNo }, { new: true }).then((resp) => sendInvoice(resp?._id)),
                    //  sendInvoice(order?._id)
                ])
            })
        } else {
            await Order.findOneAndUpdate({ orderNo: data.order_id }, { sts: stsCode })
        }
        res.redirect(`${process.env.PAYMENT_FRONT_URL}`)
    } catch (error) {
        throw new Error(error)
    }
}

const createInAppsTransactionAndPdf = async (req, decodeDetails) => {
    try {
        const data = decodeDetails
        let order = await Order.findOne({ orderNo: req.params.id })
        let master = await Master.findOne({ code: STATUS.SUCCESS });
        const transData = {
            transNo: await idGenerator(SERIES.TRANS),
            amt: order?.grandTotal,
            currency: order?.currency,
            payType: order?.payMethod,
            type: TYPE.IN_APP_PURCHASE,
            payTransId: data?.originalTransactionId,
            remark: "",
            res: data,
            stsId: master?._id,
            stsNm: master?.name,
            orderId: order?._id,
            userId: order?.user?.id,
        }
        await Transactions.create(transData)
        await Promise.all(_.map(order.courses, async (course) => {
            await addCourseToMyLearning(course.courseId, order?.user?.id)
            await Cart.deleteMany({ userId: order?.user?.id, courses: { $in: course?.courseId } })
            await User.findOneAndUpdate({ _id: order?.user?.id }, { $inc: { totalPurchaseCourse: order?.totalCourses } }, { new: true })
            await updateCourseAndCategory()
            //create myEarning doc.
            const courseDoc = await publishCourses.findOne({ _id: course?.courseId }).populate("userId")
            const instructorEarnings = await myEarningModel.findOne({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id })
            const earningAmt = (instructorEarnings?.earnings?.[0]?.totalEarning ?? 0) + (courseDoc?.price.InAppPurchaseSellPrice * (courseDoc?.userId?.agreement?.payedPercent / 100))

            const date = new Date()
            const myEarningData = {
                instructorId: courseDoc?.userId?._id,
                courseId: courseDoc?._id,
                courseNm: courseDoc?.title,
                earnings: [
                    {
                        totalEarning: earningAmt.toFixed(2),
                        month: date.getMonth() + 1,
                        year: date.getFullYear()
                    }
                ],
                createdBy: courseDoc?.userId?._id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            await myEarningModel.findOneAndUpdate({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id }, myEarningData, { upsert: true })
        }))

        //update rewards for user
        let earnedReward = 0, usedReward = 0
        earnedReward = order?.user?.earnedRewards + order?.earnedRewardsForOrder - order?.usedRewardsForOrder
        usedReward = order?.usedRewardsForOrder + order?.user?.usedRewards
        await User.findOneAndUpdate({ _id: order?.user?.id }, { usedRewards: usedReward, earnedRewards: earnedReward })


        let reward_deduct_amt = 0, coupon_deduct_per = 0;

        let coupon_per = order?.coupon?.couponPercent
        let sellPrice = order?.subTotal
        coupon_deduct_per = (sellPrice * coupon_per) / 100;
        coupon_deduct_per = !coupon_deduct_per || isNaN(coupon_deduct_per) ? 0 : coupon_deduct_per

        let reward_code = await Settings.findOne({ code: REWARD.REWARD_CALC });

        reward_deduct_amt = (order?.usedRewardsForOrder * reward_code?.details?.price) / reward_code?.details?.reward;
        reward_deduct_amt = !reward_deduct_amt || isNaN(reward_deduct_amt) ? 0 : reward_deduct_amt

        let invoiceData = {
            invNo: await idGenerator(SERIES.INV),
            date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD-MM-YYYY' }),
            name: order?.user?.name,
            address: order?.address?.addrLine1 ? `${order?.address?.addrLine1}, ${order?.address?.addrLine2 ? `${order?.address?.addrLine2}, ` : ""}${order?.address?.cityNm}, ${order?.address?.stateNm}, ${order?.address?.countryNm} - ${order?.address?.zipcode}` : '-',
            countryCode: order?.user?.countryCode,
            phone: order?.user?.mobNo,
            email: order?.user?.email,
            courses: order?.courses,
            tax: order?.tax,
            coupon_disc: order?.coupon?.couponAmt ? order.coupon.couponAmt : coupon_deduct_per,
            reward_points: reward_deduct_amt,
            total: order?.grandTotal,
            subTotal: order?.subTotal,
            totalCourses: order?.totalCourses,
            discountCode: order?.discount?.discountCode || "-",
            discountAmt: order?.discount?.discountAmt,
            discountType: order?.discount?.discountType || "-",
            paymentType: transData?.type || "",
            transactionSts: transData?.stsNm || "",
            transNo: transData?.transNo || '-',
            userId: transData?.userId?._id
        }
        // const pdfPath = path.join(baseDir, "/public/templates/invoice.ejs");
        const pdfObj = {
            ejsFile: path.join(baseDir, "/public/templates/invoice.ejs"),
            options: {
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: true
            }
        }

        await generatePdfAndUpload(pdfObj, invoiceData, FILE_URI.INVOICES).then(async (receiptId) => {
            await Promise.all([
                await Order.findOneAndUpdate({ orderNo: req.params.id }, { sts: ORDERSTATUS.SUCCESS, receiptId: receiptId, receiptNo: invoiceData?.invNo }, { new: true }).then(async (resp) => {
                    await sendInvoice(resp?._id)
                }),
                //  sendInvoice(order?._id)
            ])
        })
        return true;

    } catch (error) {
        throw new Error(error)
    }
}

async function getPaymentStatus(status) {
    try {
        let code = STATUS.PENDING
        const successArray = [STATUS.SETTLEMENT, STATUS.CAPTURE];
        const failureArray = [STATUS.DENY, STATUS.CANCEL, STATUS.EXPIRE];
        if (successArray.includes(status)) {
            code = STATUS.SUCCESS;
        }
        else if (failureArray.includes(status)) {
            code = STATUS.FAILED;
        }

        return await Master.findOne({ code: code });
    } catch (error) {
        throw new Error(error)
    }
}

function getOrderStatus(code) {
    try {
        let stsNum = ORDERSTATUS.PENDING
        if (code == STATUS.SUCCESS)
            stsNum = ORDERSTATUS.SUCCESS
        else if (code == STATUS.FAILED) {
            stsNum = ORDERSTATUS.FAILED
        }
        return stsNum
    } catch (error) {
        throw new Error(error)
    }
}

const exportTransactions = async (req) => {
    req.body.filter = {
        stsId: req.query?.stsId,
        startDate: req.query?.startDate,
        endDate: req.query?.endDate,
        userId: req.query?.userId?.split(','),
        type: req.query?.type
    }
    req.body.options = {
        populate: { path: "userId stsId orderId", select: 'name email code orderNo' },
        "pagination": false,
        search: req.query.search,
        searchColumns: req.query.searchColumns?.split(','),
    }
    req.body.query = {
        search: req.query.search,
        searchColumns: req.query?.searchColumns?.split(','),
    }
    const result = await listTransactions(req);
    const columns = [
        { header: 'Sr. No.', key: 'srNo' },
        { header: 'Transaction No.', key: 'transNo' },
        { header: 'Order No.', key: 'orderNo' },
        { header: 'User Name', key: 'userName' },
        { header: 'Date', key: 'date' },
        { header: 'Payment Method', key: 'paymentMethod' },
        { header: 'Payment Type', key: 'paymentType' },
        { header: 'Total Amount', key: 'totalAmount' },
        { header: 'Status', key: 'status' }
    ]

    const fileName = `transaction-list-sheet-${moment(new Date()).format("DDMMYYYY")}-${moment().format("HHmmss-a")}`;

    const data = result.data.map((item, index) => {
        return {
            srNo: index + 1,
            transNo: item?.transNo || '-',
            orderNo: item?.orderId?.orderNo || '-',
            userName: item?.userId?.name || '-',
            date: item?.createdAt ? moment(item.createdAt).format("DD-MM-YYYY HH:mm:ss") : '-',
            paymentMethod: item?.type || '-',
            paymentType: item?.payType || '-',
            totalAmount: item?.amt || '-',
            status: item?.stsNm || '-',
        }
    })
    const { workbook } = await excelGeneratorHelper.exportToExcel('Sheet', columns, data);
    return {
        workbook, fileName: `${fileName}.xlsx`
    }
}

const generateQuery = async (req) => {
    let query = {};

    if (req.body.filter?.stsId) {
        query.stsId = req.body.filter?.stsId;
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

    if (req.body.filter?.type && req.body.filter?.type.trim() !== '') {
        query.type = req.body.filter?.type;
    }

    if (req.body.filter?.userId && req.body.filter?.userId.length > 0) {
        query.userId = {
            $in: req.body.filter?.userId
        };
    }
    return query;
}

const listTransactions = async (req) => {
    try {
        let options = {};
        let query = {};
        const filter = await generateQuery(req);
        if (req.body?.options) {
            options = {
                ...req.body.options,
            };
            options.sort = req.body?.options?.sort ? req.body?.options?.sort : { createdAt: -1 }
        }
        if (req.body?.query) {
            query = {
                ...req.body.query,
                ...filter,
                deletedAt: { $exists: false }
            };
        }
        const result = await dbService.getAllDocuments(Transactions, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - getOrderList", error);
        throw new Error(error);
    }
}

module.exports = {
    transactionRedirectUrl,
    getPaymentStatus,
    getOrderStatus,
    getTransactionStatus,
    createInAppsTransactionAndPdf,
    exportTransactions,
    listTransactions
}