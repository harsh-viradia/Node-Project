const { idGenerator } = require("../../../configuration/common");
const { SERIES, APPROVAL_CODE, CHANNEL_ID, PAYMENT_STATUS, ORDERSTATUS, TYPE, PAYTM_STATUS, ORDERSTS } = require("../../../configuration/constants/paymentConstant");
const Order = require("../../order/order.model");
const Transactions = require("../paymentModel");
const https = require("https")
const paytmConfig = require("../../../../Paytm/config")
const PaytmChecksum = require("../../../../Paytm/checksum")
const { Master } = require("@knovator/masters-node");
const { addCourseToMyLearning } = require("../../purchased-progress/myLearning/myLearning.service");
const Cart = require("../../cart/cart.model");
const User = require("../../user/userModel");
const { updateCourseAndCategory } = require("../../widget/widgetServices");
const { publishCourses } = require("../../courses/courseModel");
const MyEarning = require("../../my-earning/myEarningModel");
const Settings = require("../../settings/settings.model");
const { REWARD } = require("../../../configuration/constants/settingConstants");
const { generatePdfAndUpload } = require("../../../services/generatePdfAndUpload");
const { FILE_URI } = require("../../../configuration/constants/fileConstants");
const path = require('path');
const { sendInvoice } = require("../../order/order.service");
const History = require("../../common/models/history");
const { MODULE_NAME, HISTORY_CODE } = require("../../../configuration/constants/historyConstant");
const { LEARNER } = require("../../../configuration/config");

const generateTransaction = async (data) => {
    try {
        const orderNo = data?.orderNo
        const getOrder = await Order.findOneAndUpdate({ orderNo: orderNo }, { address: data?.address }, { new: true })
        const transactions = await Transactions.findOne({ orderId: getOrder?._id })
        const custId = await idGenerator(SERIES.CUST)
        const amount = data.amt
        if (transactions) {
            return { flag: false }
        } else if (amount == 0) {
            await zeroAmtTransaction(data, getOrder, custId)
            return { flag: "FREEPURCHASE" }
        }
        let callbackUrl = `${process.env.API_URL}paytm/${data.channelId == CHANNEL_ID.WEB ? "web" : "device"}/api/v1/complete-transaction`
        if(data.channelId==CHANNEL_ID.WAP) callbackUrl = `https://${process.env.PAYTM_ENV}/theia/paytmCallback?ORDER_ID=${orderNo}`
        const paytmParams = {
            body: {
                "requestType": "Payment",
                "mid": paytmConfig.MID,
                "websiteName": paytmConfig.WEBSITE,
                "orderId": orderNo,
                "callbackUrl": callbackUrl,
                "txnAmount": {
                    "value": amount,
                    "currency": getOrder?.currency ?? "INR",
                },
                "userInfo": {
                    "custId": custId,
                },
                channelId: data.channelId
            }
        }
        const paytmResp = await initiatePayment(paytmParams, orderNo, amount)
        let returnResp = { paytmResp }
        if (paytmResp.resp == PAYMENT_STATUS.SUCCESS) {
            returnResp.flag = true
            return returnResp
        } else {
            returnResp.flag = false
            return returnResp
        }
    } catch (error) {
        logger.error("Error - generateTransaction ", error)
        throw new Error(error)
    }
}

const initiatePayment = (paytmParams, orderNo, amount) => new Promise((resolve, reject) => {
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), paytmConfig.MKEY).then(function (checksum) {
        paytmParams.head = {
            "signature": checksum
        };

        let post_data = JSON.stringify(paytmParams);

        let options = {
            /* for Staging */
            hostname: paytmConfig.ENV,
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=' + paytmConfig.MID + '&orderId=' + orderNo,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        let response = "";
        let post_req = https.request(options, function (post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function () {
                let obj = JSON.parse(response);
                let paytmRes = { env: paytmConfig.ENV, mid: paytmConfig.MID, amount: amount, orderId: orderNo, resp: obj.body.resultInfo.resultStatus, msg: obj.body.resultInfo.resultMsg, txntoken: obj?.body?.txnToken ?? "", code : obj.body.resultInfo.resultCode }
                resolve(paytmRes)
            });
        });
        post_req.write(post_data);
        post_req.end();
    });
})

const zeroAmtTransaction = async (data, getOrder, custId) => {
    try {
        data.status = PAYTM_STATUS.TXN_SUCCESS
        const transData = await createTransaction(data, getOrder, custId)
        await createCourseAndEarnings(getOrder)
        const rewards = await updateRewardPoints(getOrder)
        await generateInvoice(getOrder, transData, rewards)
    } catch (error) {
        logger.error("Error - zeroAmtTransaction ", error)
        throw new Error(error)
    }
}

const createTransaction = async (data, getOrder, custId) => {
    try {
        const saveResponse = {
            approval_code: APPROVAL_CODE.AHPI_APPROVAL_CODE,
            transaction_time: null,
            signature_key: null,
            status_code: 200,
            fraud_status: "accept",
            settlement_time: null,
            merchant_id: null
        }
        let masterCode = "SUCCESS"
        if(data?.status == PAYTM_STATUS.TXN_SUCCESS) masterCode = "SUCCESS" 
        else if (data?.status == PAYTM_STATUS.TXN_PENDING ) masterCode = "PENDING"
        else masterCode = "FAILED"

        const master = await Master.findOne({ code: masterCode })
        const transData = {
            transNo: await idGenerator(SERIES.TRANS),
            amt: data?.amt,
            currency: getOrder?.currency ?? "INR",
            payType: null,
            type: TYPE.PYTM,
            payTransId: null,
            remark: "transaction is bypass, due to amt is 0 | it is free",
            res: saveResponse,
            stsId: master?._id,
            stsNm: master?.name,
            orderId: getOrder?._id,
            userId: getOrder?.user?.id,
            channelId: data?.channelId,
            custId,
            paytmSts: data?.status ?? "TXN_SUCCESS"
        }
        await Transactions.create(transData)
        return transData
    } catch (error) {
        logger.error("Error - createTransaction ", error)
        throw new Error(error)
    }
}

const createCourseAndEarnings = async (getOrder) => {
    try {
        await Promise.all(_.map(getOrder.courses, async (course) => {
            await addCourseToMyLearning(course.courseId, getOrder?.user?.id)
            await Cart.deleteMany({ userId: getOrder?.user?.id, courses: { $in: course?.courseId } }),
                await User.findOneAndUpdate({ _id: getOrder?.user?.id }, { $inc: { totalPurchaseCourse: getOrder?.totalCourses } }, { new: true }),
                await updateCourseAndCategory()

            //create myEarning doc.
            const courseDoc = await publishCourses.findOne({ _id: course?.courseId }).populate("userId")
            const instructorEarnings = await MyEarning.findOne({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id })
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
                createdBy: courseDoc?.userId?._id
            }
            await MyEarning.findOneAndUpdate({ instructorId: courseDoc?.userId?._id, courseId: courseDoc?._id }, myEarningData, { upsert: true, new: true })

        }))
    } catch (error) {
        logger.error("Error - createCourseAndEarnings ", error)
        throw new Error(error)
    }
}

const updateRewardPoints = async (getOrder) => {
    try {
        const user = await User.findOne({email : getOrder?.user?.email})
        let earnedReward = 0, usedReward = 0
        earnedReward = user?.earnedRewards + getOrder?.earnedRewardsForOrder - getOrder?.usedRewardsForOrder
        usedReward = getOrder?.usedRewardsForOrder + getOrder?.user?.usedRewards
        await User.findOneAndUpdate({ _id: getOrder?.user?.id }, { usedRewards: isNaN(usedReward) ? 0 : usedReward, earnedRewards: isNaN(earnedReward) ? 0 : earnedReward })
        await Order.updateOne({ _id: getOrder._id }, { "user.usedRewards": isNaN(usedReward) ? 0 : usedReward , 'user.earnedRewards' :isNaN(earnedReward) ? 0 : earnedReward })

        let reward_deduct_amt = 0, coupon_deduct_per = 0;

        let coupon_per = getOrder?.coupon?.couponPercent
        let sellPrice = getOrder?.subTotal
        coupon_deduct_per = (sellPrice * coupon_per) / 100;
        coupon_deduct_per = !coupon_deduct_per || isNaN(coupon_deduct_per) ? 0 : coupon_deduct_per

        let reward_code = await Settings.findOne({ code: REWARD.REWARD_CALC });

        reward_deduct_amt = (getOrder?.usedRewardsForOrder * reward_code?.details?.price) / reward_code?.details?.reward;
        reward_deduct_amt = !reward_deduct_amt || isNaN(reward_deduct_amt) ? 0 : reward_deduct_amt
        return { reward_deduct_amt, coupon_deduct_per }
    } catch (error) {
        logger.error("Error - update reward points ", error)
        throw new Error(error)
    }
}

const generateInvoice = async (getOrder, transData, rewards) => {
    try {
        let invoiceData = {
            invNo: await idGenerator(SERIES.INV),
            date: await convertToTz({ tz: process.env.Tz, date: new Date(), format: 'DD-MM-YYYY' }),
            name: getOrder?.user?.name,
            address: getOrder?.address?.addrLine1 ? `${getOrder?.address?.addrLine1}, ${getOrder?.address?.addrLine2 ? `${getOrder?.address?.addrLine2}, ` : ""}${getOrder?.address?.cityNm}, ${getOrder?.address?.stateNm}, ${getOrder?.address?.countryNm} - ${getOrder?.address?.zipcode}` : '-',
            countryCode: getOrder?.user?.countryCode,
            phone: getOrder?.user?.mobNo,
            email: getOrder?.user?.email,
            courses: getOrder?.courses,
            tax: getOrder?.tax,
            coupon_disc: getOrder?.coupon?.couponAmt ? getOrder.coupon.couponAmt : rewards.coupon_deduct_per,
            reward_points: rewards.reward_deduct_amt,
            total: getOrder?.grandTotal ?? 0,
            subTotal: getOrder?.subTotal ?? 0,
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

        const receiptId = await generatePdfAndUpload(pdfObj, invoiceData, FILE_URI.INVOICES)
        const order = await Order.findOneAndUpdate({ orderNo: getOrder.orderNo }, { sts: ORDERSTATUS.SUCCESS, receiptId: receiptId, receiptNo: invoiceData?.invNo }, { new: true })
        await sendInvoice(order?._id)
    } catch (error) {
        logger.error("Error - generateInvoice (paytm payment) ", error)
        throw new Error(error)
    }
}

const completeTransaction = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNo: req.body.ORDERID })
        if (!order) {
            logger.error("Error - Order Not Found(completeTransaction) ")
            const message = _localize("module.notFound", req, "order")
            logger.info("Transaction Faild due to Order Not Found.")
            return utils.failureResponse(message, res)
        }
        const transaction = await Transactions.findOne({ orderId: order._id })
        if (!transaction) {
            let transData = await createTransaction({ amt: order.subTotal, channelId: req.body.channelId, status: req.body.STATUS }, order, req.body.channelId)
            if (req.body.STATUS == PAYTM_STATUS.TXN_SUCCESS) {
                await createCourseAndEarnings(order)
                const rewards = await updateRewardPoints(order)
                await generateInvoice(order, transData, rewards)
                res.message = _localize("payment.sucess", req, "transactions")
                logger.info("Transaction Completed.")
                return utils.successResponse({}, res)
            } else if (req.body.STATUS == PAYTM_STATUS.TXN_FAILURE) {
                await Promise.all(order.courses, async (course) => {
                    await Cart.deleteMany({ userId: order?.user?.id, courses: { $in: course?.courseId } })
                })
                logger.error("Error - Payment Failed(completeTransaction) ")
                Promise.resolve(History.create({
                    module: MODULE_NAME.PAYTM_PAYMENT,
                    historyDetalis: {
                        ...req.body
                    },
                    code: HISTORY_CODE.PAYTM_PAYMENT,
                    history_type: 2
                }))
                Promise.resolve(Order.updateOne({ orderNo: req.body.ORDERID }, { sts: ORDERSTATUS.FAILED }))
                const message = req.body?.RESPMSG ?? _localize("payment.failed", req)
                logger.error("Transaction Failed")
                return utils.failureResponse(message, res)
            }
        }
        if (req.body.STATUS == PAYTM_STATUS.TXN_FAILURE) {
            Promise.resolve(Order.updateOne({ orderNo: req.body.ORDERID }, { sts: ORDERSTATUS.FAILED }))
            const message = req.body?.RESPMSG ?? _localize("payment.failed", req)
            logger.error("Transaction Failed")
            return utils.failureResponse(message, res)
        }
        res.message = _localize("payment.sucess", req, "transactions")
        logger.info("Transaction Completed.")
        return utils.successResponse({}, res)
    } catch (error) {
        logger.error("Error - completeTransaction ", error)
        throw new Error(error)
    }
}

module.exports = {
    generateTransaction,
    completeTransaction
}