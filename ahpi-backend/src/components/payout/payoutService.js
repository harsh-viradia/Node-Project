const dbService = require("../../services/db.service")
const payoutModel = require("./payoutModel")
const user = require("../user/userModel")
const { incomeList } = require("../my-earning/myEarningService")
const myEarning = require("../my-earning/myEarningModel")
const mongoose = require("mongoose")

const add = async (data) => {
    try {
        const user = { _id: mongoose.Types.ObjectId(data?.user) }
        const isPaymentAvail = await incomeList(user)

        if (!isPaymentAvail?.[0]?.pendingClearance > 0) {
            return { flag: false, data: "module.alreadySend" }
        }
        //remove transffered amount from myearning 
        let earningArr = []
        const currEarning = await myEarning.find({ instructorId: data?.user })
        let earningObj = currEarning.map(earningDoc => {
            const courseId = earningDoc.courseId
            let deductAmtList = earningDoc.earnings[0].totalEarning - earningDoc.withDrawnAmt
            let value, ovbj = {}
            if (deductAmtList > 0) {
                value = Number(deductAmtList.toFixed(2))
                earningArr.push(value)
                ovbj[courseId] = value
                return Object.assign({}, ovbj)
            }
        }
        )
        earningObj = earningObj.filter(objVal => objVal)

        //TODO -- loop through array of earningArr , 
        //check if both are equal then set it to 0 and break loop
        // if not matched then find less vlaue then data.amt and set it to 0 remove deducted value from data?.amt store index of updated value in another array and continue to loop.
        // if not found less value then data.amt then find gereater value deduct amout from thet and break from loop.
        let deductAmt = Number(data.amt)
        await updateMyEarning(deductAmt, earningObj, earningArr, data)
        const result = await payoutModel.create(data)
        return { flag: true, data: result }
    } catch (error) {
        logger.error("Error - add payout ", error)
        throw new Error(error)
    }
}

const updateMyEarning = async (deductAmt, earningObj, earningArr, data) => {
    try{
        let existingWithdrawnAmt
        if (deductAmt != 0) {
            let amtDeducted = earningArr.indexOf(parseInt(deductAmt))
            if (amtDeducted >= 0) {
                let courseId = Object.keys(earningObj[amtDeducted])
                existingWithdrawnAmt = await myEarning.findOne({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) })
                await myEarning.findOneAndUpdate({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) }, { withDrawnAmt: Number((earningArr[amtDeducted] + (existingWithdrawnAmt?.withDrawnAmt).toFixed(2)) ?? 0) }, { new: true })
                earningArr[amtDeducted] = 0
                deductAmt = 0
            }
            if (amtDeducted == -1) {
                for (let earningCount = 0; earningCount < earningArr.length; earningCount++) {
                    if (earningArr[earningCount] < deductAmt && deductAmt > 0) {
                        const courseId = Object.keys(earningObj[earningCount])
                        existingWithdrawnAmt = await myEarning.findOne({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) })
                        if (earningArr[earningCount] <= deductAmt) {
                            const PCAmt = Number((earningArr[earningCount] + existingWithdrawnAmt?.withDrawnAmt).toFixed(2))
                            await myEarning.findOneAndUpdate({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) }, { withDrawnAmt: PCAmt }, { new: true })
                            deductAmt = deductAmt - earningArr[earningCount]
                            earningArr[earningCount] = 0
                        } else if (earningArr[earningCount] > deductAmt) {
                            const PCAmt = Number((existingWithdrawnAmt?.withDrawnAmt + deductAmt).toFixed(2))
                            await myEarning.findOneAndUpdate({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) }, { withDrawnAmt: PCAmt }, { new: true })
                            deductAmt = deductAmt - existingWithdrawnAmt?.withDrawnAmt
                            earningArr[earningCount] = 0
                        }
                    } else {
                        const courseId = Object.keys(earningObj[earningCount])
                        existingWithdrawnAmt = await myEarning.findOne({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) })
                        if (earningArr[earningCount] <= deductAmt) {
                            const PCAmt = Number((earningArr[earningCount] + existingWithdrawnAmt?.withDrawnAmt).toFixed(2))
                            await myEarning.findOneAndUpdate({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) }, { withDrawnAmt: PCAmt }, { new: true })
                            deductAmt = deductAmt - earningArr[earningCount]
                        } else if (earningArr[earningCount] > deductAmt) {
                            const PCAmt = Number((existingWithdrawnAmt?.withDrawnAmt + deductAmt).toFixed(2))
                            await myEarning.findOneAndUpdate({ instructorId: data?.user, courseId: mongoose.Types.ObjectId(courseId[0]) }, { withDrawnAmt: PCAmt }, { new: true })
                            deductAmt - earningArr[earningCount] > 0 ? deductAmt = deductAmt - earningArr[earningCount] : deductAmt = 0
                        }
                        break;
                    }
                }
            }
        }
    } catch (error) {
        logger.error('Error - updateMyEarning (addPayout) ', error)
        throw new Error(error)
    }
}

const list = async (data) => {
    let options = {}, query = {}, fromMonth, fromYear, toMonth, toYear, fromDate, toDate

    if (data?.query) {
        query = {
            ...data?.query
        }

        if (data?.query?.filter) {
            if (data?.query?.filter?.fromDate && data?.query?.filter?.toDate) {
                fromMonth = parseInt(data?.query?.filter?.fromDate.split(" ")[0])
                fromYear = parseInt(data?.query?.filter?.fromDate.split(" ")[1])

                toMonth = parseInt(data?.query?.filter?.toDate.split(" ")[0])
                toYear = parseInt(data?.query?.filter?.toDate.split(" ")[1])
            }

            if (fromMonth && toMonth && fromYear && toYear) {
                if (fromYear == toYear) {
                    query.month = { $gte: fromMonth, $lte: toMonth }
                    query.year = toYear
                } else if (fromYear < toYear) {
                    query.$or = [
                        {
                            $and: [
                                { month: { $gte: fromMonth } },
                                { year: fromYear }
                            ]
                        },
                        {
                            $and: [
                                { month: { $lte: toMonth } },
                                { year: toYear }
                            ]
                        }
                    ]
                } else if (fromYear > toYear) {
                    return { flag: false, data: `from year ${fromYear} must be less then to Year ${toYear}` }
                }
            }

            data?.query?.filter?.payoutType ? query.payoutType = { $in: data?.query?.filter?.payoutType } : ""
            data?.query?.filter?.user ? query.user = { $in: data?.query?.filter?.user } : ""
            if (data?.query?.filter?.startDate && data?.query?.filter?.endDate) {
                fromDate = new Date(data?.query?.filter?.startDate)
                fromDate.setDate(fromDate.getDate() - 1)
                toDate = new Date(data?.query?.filter?.endDate)
                toDate.setDate(toDate.getDate() + 1)
                query.$and = [{ transferDate: { $gte: fromDate, $lte: toDate } }]
            }
            data?.query?.filter?.status ? query.status = data?.query?.filter?.status : ""

            delete query?.filter
        }
    }

    if (data?.options) {
        options = {
            ...data.options,
        };
        options.sort = data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
    }

    return { flag: true, data: await dbService.getAllDocuments(payoutModel, query, options) }
}

module.exports = {
    add,
    list
}