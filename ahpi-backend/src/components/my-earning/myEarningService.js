const myEarningModel = require("./myEarningModel")
const roleModel = require("../roles/roleModel")
const mongoose = require("mongoose")
const { ROLE } = require("../../configuration/constants/authConstant")
const { convertPaginationResult } = require("../../configuration/common")

const myEarningList = async (data, user) => {
    try {
        let aggregateQuery = [], $match = {}, ObjIds, offset, limit, fromMonth, fromYear, toMonth, toYear

        offset = data.options.page > 1 ? (data.options.page - 1) * data.options.limit : 0;
        limit = data.options.limit || 10;

        const instructorRole = await roleModel.findOne({ code: ROLE.INSTRUCTOR })
        if (user?.roles[0]?.roleId.equals(instructorRole?._id)) {
            $match.instructorId = user?._id
        }

        if (data?.query) {
            fromMonth = parseInt(data?.query?.fromDate.split(" ")[0])
            fromYear = parseInt(data?.query?.fromDate.split(" ")[1])

            toMonth = parseInt(data?.query?.toDate.split(" ")[0])
            toYear = parseInt(data?.query?.toDate.split(" ")[1])

            if (data?.query?.courseIds) {
                ObjIds = _.map(data?.query?.courseIds, courseId => mongoose.Types.ObjectId(courseId))
                $match.courseId = { $in: ObjIds }
            }
            if (data?.query?.instructorIds) {
                ObjIds = _.map(data?.query?.instructorIds, instructorId => mongoose.Types.ObjectId(instructorId))
                $match.instructorId = { $in: ObjIds }
            }

            //month year range based condition
            if (fromMonth && toMonth && fromYear && toYear) {
                if (fromYear == toYear) {
                    Object.assign($match, { "earnings.month": { $gte: fromMonth, $lte: toMonth }, "earnings.year": toYear })
                } else if (fromYear < toYear) {
                    const andQuery = {
                        $or: [
                            {
                                $and: [
                                    { "earnings.month": { $gte: fromMonth } },
                                    { "earnings.year": fromYear }
                                ]
                            },
                            {
                                $and: [
                                    { "earnings.month": { $lte: toMonth } },
                                    { "earnings.year": toYear }
                                ]
                            }
                        ]
                    }
                    Object.assign($match, andQuery)
                } else if (fromYear > toYear) {
                    return { flag: false, data: `from year ${fromYear} must be less then to Year ${toYear}` }
                }
            }
        }
        aggregateQuery.push({
            $match
        },
            {
                '$lookup': {
                    from: 'publishCourses',
                    let: { id: "$courseId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "file",
                                let: { imgId: "$imgId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$imgId"]
                                            }
                                        }
                                    }, {
                                        $project: {
                                            uri: 1,
                                            _id: 0
                                        }
                                    }
                                ],
                                as: "imgId"
                            }
                        },
                        {
                            $project: {
                                "title": 1,
                                "imgId": 1
                            }
                        }
                    ],
                    as: 'courseId'
                }
            },
            {
                $lookup: {
                    from: "orders",
                    let: { id: "$courseId._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$courses.courseId", "$$id"]
                                },
                                deletedAt: { $exists: false }
                            }
                        },
                        {
                            $count: "purchased_course"
                        }
                    ],
                    as: "purchased_count"
                }
            },
            {
                $unwind: { path: "$purchased_count", preserveNullAndEmptyArrays: true }
            },
            {
                $unwind: { path: "$earnings", preserveNullAndEmptyArrays: true }
            },
            {
                $match: { "earnings.isEarningSend": { $exists: false } }
            },
            { $addFields: { 
                payableAmt: { 
                    $cond: {
                        if: { $lt: [ { $subtract: ["$earnings.totalEarning", "$withDrawnAmt"] }, 0 ] },
                        then: 0,
                        else: { $subtract: ["$earnings.totalEarning", "$withDrawnAmt"] }
                    }
                }
             } },
            {
                $group: {
                    _id: {
                        title: "$courseId.title", 
                        date: { $concat: [{ $toString: "$earnings.month" }, "/", { $toString: "$earnings.year" }] },
                        purchased_count: "$purchased_count.purchased_course",
                        month: "$earnings.month",
                        year:  "$earnings.year",
                        courseLogo: "$courseId.imgId.uri",
                        "payableAmt": "$payableAmt",
                        
                    },                   
                }
            },
            { $sort: { "_id": -1 } },
            {
                $project: {
                    _id: 0,
                    courseLogo : "$_id.courseLogo",
                    year: "$_id.year",
                    month: "$_id.month",
                    date: "$_id.date",
                    title: "$_id.title",
                    totalSale: "$_id.purchased_count",
                    totalEarning: "$_id.payableAmt"
                }
            },
            { $unwind: { path : "$courseLogo", preserveNullAndEmptyArrays: true } },
            { $unwind: { path : "$title", preserveNullAndEmptyArrays: true } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    docs: [{ $skip: offset }, { $limit: limit },]
                }
            }
        )
            
        const aggregateList = await myEarningModel.aggregate(aggregateQuery)
        const result = convertPaginationResult(aggregateList, { offset, limit })
        return { flag: true, data: result }
    } catch (error) {
        logger.error("Error - myEarningList ", error)
        throw new Error(error)
    }
}

const earningAnalytics = async (data, user) => {
    let aggregation = [], instructorRole, objIds = [], fromMonth, fromYear, toMonth, toYear

    instructorRole = await roleModel.findOne({ code: ROLE.INSTRUCTOR })
    if (user?.roles[0]?.roleId.equals(instructorRole?._id)) {
        aggregation.push(
            { $match: { instructorId: user?._id } },
        )
    } else {
        if (data?.query?.instructorIds) {
            objIds = _.map(data?.query?.instructorIds, instructorId => mongoose.Types.ObjectId(instructorId))
            aggregation.push(
                { $match: { instructorId: { $in: objIds } } },
            )
        }
    }

    if (data?.query) {
        fromMonth = parseInt(data?.query?.fromDate.split(" ")[0])
        fromYear = parseInt(data?.query?.fromDate.split(" ")[1])

        toMonth = parseInt(data?.query?.toDate.split(" ")[0])
        toYear = parseInt(data?.query?.toDate.split(" ")[1])
        if (data?.query?.courseIds) {
            objIds = _.map(data?.query?.courseIds, courseId => mongoose.Types.ObjectId(courseId))
            aggregation.push(
                { $match: { courseId: { $in: objIds } } },
            )
        }

        if (fromMonth && toMonth && fromYear && toYear) {
            if (fromYear == toYear) {
                aggregation.push(
                    { $match: { "earnings.month": { $gte: fromMonth, $lte: toMonth } } },
                    {
                        $project: {
                            earnings: {
                                $filter: {
                                    input: "$earnings",
                                    as: "earning",
                                    cond: {
                                        $or: [
                                            { $eq: ["$$earning.month", 11] },
                                            { $eq: ["$$earning.month", 12] },
                                        ]
                                    }
                                }
                            }
                        }
                    }
                )

                aggregation.push(
                    { $match: { "earnings.year": toYear } },
                    {
                        $project: {
                            earnings: {
                                $filter: {
                                    input: "$earnings",
                                    as: "earning",
                                    cond: {
                                        $eq: ["$$earning.year", toYear]
                                    }
                                }
                            }
                        }
                    }
                )
            } else if (fromYear < toYear) {
                const orQuery = {
                    $match: {
                        $or: [
                            {
                                $and: [
                                    { "earnings.month": { $gte: fromMonth } },
                                    { "earnings.year": fromYear }
                                ]
                            },
                            {
                                $and: [
                                    { "earnings.month": { $lte: toMonth } },
                                    { "earnings.year": toYear }
                                ]
                            }
                        ]
                    }
                }
                aggregation.push({ ...orQuery })
            } else if (fromYear > toYear) {
                return { flag: false, data: `from year ${fromYear} must be less then to Year ${toYear}` }
            }
        }
    }

    aggregation.push(
        {
            $match: {
                deletedAt: { $exists: false }
            }
        },
        { $unwind: { path: "$earnings", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: { $concat: [{ $toString: "$earnings.month" }, "/", { $toString: "$earnings.year" }] },
                y: {
                    $sum: "$earnings.totalEarning"
                }
            },
        },
        {
            $project:
            {
                "_id" : 0,
                x: "$_id",
                y: 1
            }
        }
    )

    const result = await myEarningModel.aggregate(aggregation)
    return { flag: true, data: result }
}

const incomeList = async (user) => {
    let currMonth, aggregation = []

    currMonth = new Date().getMonth() + 1

    aggregation.push(
        {
            $match: {
                'instructorId': user?._id
            },
        },
        {
            $project: {
                netIncome: {
                    $sum: "$earnings.totalEarning"
                },
                earnings: 1,
                withDrawnAmt: 1,
                currMonthEarning: {
                    $arrayElemAt: [
                        "$earnings",
                        {
                            $indexOfArray: [
                                "$earnings.month", currMonth
                            ]
                        }
                    ]
                }
            }
        },
        {
            $addFields: {
                creditedAmt: "$withDrawnAmt",
                pendingClearance: { $subtract: [ "$currMonthEarning.totalEarning", "$withDrawnAmt" ]}
            }
        },
        {
            $group: {
                _id: null,
                creditedAmt: { $sum: "$creditedAmt" },
                pendingClearance: { $sum: "$pendingClearance" },
                netIncome: { $sum: "$netIncome" }
            }
        }
    )
    
    const result = await myEarningModel.aggregate(aggregation)
    return result
}

module.exports = {
    myEarningList,
    earningAnalytics,
    incomeList
}