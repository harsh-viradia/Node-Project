const Order = require('../order/order.model');
const mongoose = require("mongoose")
const Review = require("../review/review.model")
const MyLearning = require('../purchased-progress/myLearning/myLearning.model');
const { getMonthBetweenTwoYear } = require('../../configuration/common');
const { getFilterQuery } = require('../../services/filterQuery.service');
const { MONTHS, DATE_TYPES } = require('../../configuration/constants/analyticsConstants');
const { publishCourses } = require('../courses/courseModel');
const { ObjectId } = require('mongodb')
const moment = require('moment-timezone');
const { ORDERSTATUS } = require("../../configuration/constants/paymentConstant");
const { convertPaginationResult } = require("../../configuration/common");
const { exportToExcel } = require("../../helper/excelGenerator.helper");
const { ROLE } = require("../../configuration/constants/authConstant")
const Role = require("../roles/roleModel");

// Course Analytics
const courseAnalyticsReport = async (data) => {
    try {
        let response = [];
        let queryData;
        data.dateFormat = {
            format: data.dateFormat?.format ?? 'DD MMM Y',
            type: data.dateFormat?.type ?? _.first(DATE_TYPES.DAY)
        }
        const filterData = await analyticsFilter(data);
        if (data?.query?.search) {
            queryData = await getFilterQuery(data.query);
        }
        delete data.query?.search;
        delete data.query?.searchColumns;
        getMonthBetweenTwoYear(filterData?.startDate, filterData?.endDate, data).forEach((xAxis) => {
            response.push({
                xAxis, revenue: 0, totalSales: 0
            });
        })

        let aggregateQuery = []

        if (data?.filter?.instructorId) {
            aggregateQuery = [
                {
                    $lookup: {
                        from: "publishCourses",
                        localField: "courses.courseId",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                {
                    $match: {
                        $and: [{ createdAt: { $gte: new Date(filterData?.startDate) } }, { createdAt: { $lte: new Date(filterData?.endDate) } }],
                        ...(queryData ? queryData : {}),
                        ...(filterData.courseIds ? { "courses.courseId": { $in: filterData.courseIds } } : {}),
                        "course.userId": ObjectId(data.filter.instructorId),
                        sts: ORDERSTATUS.SUCCESS
                    }
                },
                {
                    $addFields: {
                        "course": {
                            $arrayElemAt: [
                                {
                                    "$filter": {
                                        "input": "$course",
                                        "as": "crs",
                                        "cond": {
                                            "$eq": [
                                                "$$crs.userId",
                                                ObjectId(data.filter.instructorId)
                                            ]
                                        }
                                    }
                                },
                                {
                                    $indexOfArray: [
                                        "$course",
                                        ObjectId(data.filter.instructorId)
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        "courses": {
                            $filter: {
                                input: "$courses",
                                cond: {
                                    $eq: ["$$this.courseId", "$course._id"]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        totalRevenue: "$courses.sellPrice",
                        totalSell: { $size: "$courses" }
                    }
                },
                { $unwind: "$totalRevenue" },
                {
                    $group: {
                        _id:{
                            course : "$course._id",
                            createdAt: "$createdAt" 
                        },
                        "totalRevenue": {
                            "$sum": "$totalRevenue"
                        },
                        "totalSell": {
                            "$sum": "$totalSell"
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "$dateToString": {
                                "date": "$_id.createdAt",
                                "format": "%Y-%m-%d"
                            }
                        },
                        "revenue": { $sum: "$totalRevenue" },
                        "totalSales": { $sum: "$totalSell" }
                    }
                },
                {
                    $sort: {
                        '_id': 1
                    }
                }]
        } else {
            aggregateQuery = [
                {
                    $match: {
                        $and: [{ createdAt: { $gte: new Date(filterData?.startDate) } }, { createdAt: { $lte: new Date(filterData?.endDate) } }],
                        ...(queryData ? queryData : {}),
                        ...(filterData.courseIds ? { "courses.courseId": { $in: filterData.courseIds } } : {}),
                        sts: ORDERSTATUS.SUCCESS
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                date: '$createdAt', format: DATE_TYPES.YEAR.includes(data?.dateFormat?.type) ? "%Y" : DATE_TYPES.MONTH.includes(data?.dateFormat?.type) ? "%Y-%m" : "%Y-%m-%d"
                            }
                        }, revenue: {
                            $sum: "$grandTotal"
                        }, totalSales: {
                            $sum: "$totalCourses"
                        }
                    }
                },
                {
                    $sort: {
                        '_id': 1
                    }
                }
            ]
        }

        const result = await Order.aggregate(aggregateQuery)
        if (result && result.length) {
            const dateFormat = data?.dateFormat
            result.forEach((data) => {
                return resultOperation(data, dateFormat, response)
            })
        }
        return response;
    } catch (error) {
        logger.error('Error - courseAnalyticsReport', error);
        throw new Error(error);
    }
}

const resultOperation = (data, dateFormat, response) => {
    let year, month, date, index;
    if (DATE_TYPES.DAY.includes(dateFormat?.type) || DATE_TYPES.WEEK.includes(dateFormat?.type)) {
        [year, month, date] = data._id.split('-');
        index = response.findIndex(item => DATE_TYPES.DAY.includes(dateFormat?.type) ? item.xAxis === `${date} ${MONTHS[parseInt(month) - 1]} ${year}` : moment(item.xAxis).weekday(0).format(dateFormat?.type) === moment(`${date} ${MONTHS[parseInt(month) - 1]} ${year}`).weekday(0).format(dateFormat?.type))
    }
    if (DATE_TYPES.MONTH.includes(dateFormat?.type)) {
        [year, month] = data._id.split('-');
        index = response.findIndex(item => item.xAxis === `${MONTHS[parseInt(month) - 1]} ${year}`)
    }
    if (DATE_TYPES.YEAR.includes(dateFormat?.type)) {
        year = data._id;
        index = response.findIndex(item => item.xAxis === `${year}`)
    }
    if (index !== -1) {
        response[index].revenue = DATE_TYPES.WEEK.includes(dateFormat?.type) ? response[index].revenue + data.revenue : data.revenue;
        response[index].totalSales = DATE_TYPES.WEEK.includes(dateFormat?.type) ? response[index].totalSales + data.totalSales : data.totalSales;
    }
}

const analyticsFilter = async (data) => {
    let filterData = {};
    if (data?.filter?.categories && data?.filter?.categories?.length) {
        let categoryIds = await Promise.all(
            data.filter.categories.map(async (id) => ObjectId(id))
        );
        let courseIds = await publishCourses.aggregate([
            {
                $match: {
                    $or: [
                        { "parCategory": { $in: categoryIds } }
                    ],
                }
            },
            {
                $project: {
                    _id: 1
                }
            }
        ])
        filterData.courseIds = courseIds.map(obj => obj._id);
    }

    if (data.filter?.startDate && data.filter?.startDate.trim() !== '' && data.filter?.endDate && data.filter?.endDate.trim() !== '') {
        filterData.startDate = await convertToTz({ tz: data?.timezone, date: data.filter.startDate });
        filterData.endDate = await convertToTz({ tz: data?.timezone, date: data.filter.endDate, time: "23:59:59" });
    }
    return filterData;
}

const courseAnalyticsList = async (data) => {
    try {
        const offset = data.options.page > 1 ? (data.options.page - 1) * data.options.limit : 0;
        const limit = data.options.limit || 100;
        let cateIds = []
        let sumObj = {
            totalPurchased: 0,
            totalprice: 0
        }
        let aggregate = [];
        let queryData;
        const filterData = await analyticsFilter(data);
        if (data?.query?.search) {
            queryData = await getFilterQuery(data.query);
        }
        delete data.query?.search;
        delete data.query?.searchColumns;
        if (data?.filter?.categories) {
            cateIds = _.map(data?.filter?.categories, category => mongoose.Types.ObjectId(category))
        }
        aggregate.push(
            {
                $lookup: {
                    from: 'publishCourses',
                    let: { id: '$courseId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$id"]
                                },
                                ...(data?.filter?.instructorId ? { userId: ObjectId(data?.filter?.instructorId) } : {})
                            }
                        },
                        {
                            $lookup: {
                                from: 'categories',
                                let: { categoryId: '$parCategory' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $in: ["$_id", "$$categoryId"]
                                            }
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
                                from: 'user',
                                let: { userId: '$userId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ['$_id', '$$userId']
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            firstName: 1,
                                            lastName: 1,
                                            _id: 0,
                                            email: 1
                                        }
                                    }
                                ],
                                as: "userId"
                            }
                        },
                        {
                            $unwind: "$userId"
                        },
                        {
                            $addFields: {
                                fullName: {
                                    $concat: [
                                        "$userId.firstName",
                                        " ",
                                        "$userId.lastName"
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                title: 1,
                                parCategory: 1,
                                avgStars: 1,
                                fullName: 1
                            }
                        }
                    ],
                    as: 'courseId'
                }
            }, { $unwind: { path: '$courseId', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$courseId._id",
                    courseNm: { $first: "$courseId.title" },
                    parCategory: { $first: "$courseId.parCategory" },
                    avgStarts: { $first: "$courseId.avgStars" },
                    fullName: { $first: "$courseId.fullName" }
                }
            },
            {
                $lookup: {
                    from: 'orders',
                    let: { courseId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $and: [{ createdAt: { $gte: new Date(filterData?.startDate) } }, { createdAt: { $lte: new Date(filterData?.endDate) } }],
                                $expr: {
                                    $in: ["$$courseId", "$courses.courseId"]
                                },
                                ...(data?.filter?.categories ? { "courses.primaryCat": { $in: cateIds } } : {}),
                                sts: ORDERSTATUS.SUCCESS
                            }
                        },
                        {
                            $addFields: {
                                courses: {
                                    $arrayElemAt: [{
                                        $filter: {
                                            input: "$courses",
                                            as: "course",
                                            cond: { $eq: ["$$course.courseId", "$$courseId"] }
                                        }
                                    }, 0]
                                }
                            }
                        }
                    ],
                    as: 'orders'
                }
            },
            {
                $match: {
                    $expr: {
                        $gt: [{ $size: "$orders" }, 0]
                    },
                    ...(queryData ? queryData : {}),
                    ...(filterData.courseIds ? { "_id": { $in: filterData.courseIds } } : {})
                }
            },
            {
                $addFields: {
                    purchasedCourses: { $size: "$orders" },
                    courseTotalPrice: { $sum: "$orders.courses.sellPrice" }
                }
            }, { $unset: "orders" },
            {
                $sort: data?.options?.sort ? data.options.sort : { purchasedCourses: -1 },
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    docs: [{ $skip: offset }, { $limit: limit },]
                }
            }
        )
        let resultData = await MyLearning.aggregate(aggregate);
        _.first(resultData).docs.map((resultObj) => {
            return sumObj = {
                totalPurchased: sumObj.totalPurchased + resultObj.purchasedCourses,
                totalprice: sumObj.totalprice + resultObj.courseTotalPrice,
            }
        })
        let result = convertPaginationResult(resultData, { offset, limit });
        return { ...result, ...sumObj }
    } catch (error) {
        logger.error('Error - courseAnalyticsList', error);
        throw new Error(error);
    }
}

const courseAnalyticsExport = async (data) => {
    try {
        const result = await courseAnalyticsList(data);
        const columns = [
            { header: 'Sr. No.', key: 'srNo' },
            { header: 'Course Name', key: 'courseNm' },
            { header: 'No. Of Purchase', key: 'purchasedCourses' },
            { header: 'Avg Star', key: 'avgStarts' },
            { header: 'Instructor Name', key: 'fullName' },
            { header: 'Primary Category', key: 'parCategory' },
            { header: 'Revenue', key: 'courseTotalPrice' },
        ];
        const resultData = result.data.map((item, index) => {
            return {
                srNo: index + 1,
                courseNm: item.courseNm,
                purchasedCourses: item?.purchasedCourses,
                parCategory: item?.parCategory[0].name,
                avgStarts: item?.avgStarts,
                fullName: item?.fullName,
                courseTotalPrice: item?.courseTotalPrice
            }
        });

        const fileName = `course-analysis-${moment(data.filter?.startDate).format('DDMMYYYY')}-To-${moment(data.filter?.endDate).format('DDMMYYYY')}-${moment().format("hhmmss-a")}`;
        let { worksheet, workbook } = await exportToExcel('Sheet', columns, resultData);
        if (result.data.length) {
            worksheet.insertRow(result.data.length + 3, ["Total", '', result.totalPurchased, '', '', result.totalprice], style = 'o+');
            worksheet.getRow(result.data.length + 3).font = { bold: true };
            worksheet.mergeCells(`A${result.data.length + 3}`, `B${result.data.length + 3}`);
            worksheet.mergeCells(`D${result.data.length + 3}`, `E${result.data.length + 3}`);
            worksheet.getCell(`A${result.data.length + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
        return {
            workbook, fileName: `${fileName}.xlsx`
        }
    } catch (error) {
        logger.error('Error - courseAnalyticsExport', error);
        throw new Error(error);
    }
}

// Category Analytics
const categoryAnalyticsReport = async (data, isList) => {
    try {
        let queryData;
        const filterData = await analyticsFilter(data);
        if (data?.query?.search) {
            queryData = await getFilterQuery(data.query);
        }
        delete data.query?.search;
        delete data.query?.searchColumns;
        let aggregate = [
            {
                $match: {
                    $and: [{ createdAt: { $gte: new Date(filterData?.startDate) } }, { createdAt: { $lte: new Date(filterData?.endDate) } }],
                    sts: ORDERSTATUS.SUCCESS,
                }
            },
            { '$unwind': { path: "$courses", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'categories',
                    let: { id: "$courses.primaryCat" },
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
                                name: 1
                            }
                        }
                    ],
                    as: 'courses.primaryCat'
                }
            },
            {
                '$unwind': { path: '$courses.primaryCat', preserveNullAndEmptyArrays: true }
            },
            {
                '$group': { _id: '$_id', primaryCate: { $addToSet: "$courses.primaryCat" }, grandTotal: { $first: "$grandTotal" } }
            },
            { $unwind: { path: "$primaryCate", preserveNullAndEmptyArrays: false } },
            {
                $group: {
                    _id: "$primaryCate.name",
                    revenue: {
                        $sum: "$grandTotal"
                    },
                    ...(isList?.flag ? { totalSales: { $sum: 1 } } : {})
                },
            },
            {
                $match: {
                    ...(queryData ? queryData : {})
                }
            },
            {
                $sort: data?.options?.sort ?? { revenue: -1, _id: 1 }
            }
        ]
        if (isList?.flag) {
            aggregate.push(
                {
                    $facet: {
                        metadata: [{ $count: "total" }],
                        docs: [{ $skip: isList?.offset }, { $limit: isList?.limit },]
                    }
                }
            )
        }
        const result = await Order.aggregate(aggregate)
        return result.length && result;
    } catch (error) {
        logger.error('Error - categoryAnalyticsReport', error);
        throw new Error(error);
    }
}

const categoryAnalyticsList = async (data) => {
    try {
        const offset = data.options.page > 1 ? (data.options.page - 1) * data.options.limit : 0;
        const limit = data.options.limit || 100;
        let sumObj = {
            totalPurchased: 0,
            totalRevenue: 0
        }
        const resultData = await categoryAnalyticsReport(data, { flag: true, offset: offset, limit: limit });
        _.first(resultData).docs.map((resultObj) => {
            return sumObj = {
                totalPurchased: sumObj.totalPurchased + resultObj.totalSales,
                totalRevenue: sumObj.totalRevenue + resultObj.revenue,
            }
        })
        let result = convertPaginationResult(resultData, { offset, limit });
        return { ...result, ...sumObj }
    } catch (error) {
        logger.error('Error - categoryAnalyticsList', error);
        throw new Error(error);
    }
}

const categoryAnalyticsExport = async (data) => {
    try {
        const result = await categoryAnalyticsList(data);
        const columns = [
            { header: 'Sr. No.', key: 'srNo' },
            { header: 'Program Name', key: 'categoryNm' },
            { header: 'No. Of Purchase', key: 'totalSales' },
            { header: 'Revenue', key: 'totalRevenue' }
        ];
        const resultData = result.data.map((item, index) => {
            return {
                srNo: index + 1,
                categoryNm: item._id,
                totalSales: item?.totalSales,
                totalRevenue: item?.revenue
            }
        });
        const fileName = `program-report-${moment(data.filter?.startDate).format('DDMMYYYY')}-To-${moment(data.filter?.endDate).format('DDMMYYYY')}-${moment().format("hhmmss-a")}-${moment(new Date()).format("DDMMYYYY")}`;
        let { worksheet, workbook } = await exportToExcel('Sheet', columns, resultData);
        if (result.data.length) {
            worksheet.insertRow(result.data.length + 3, ["Total", '', result.totalPurchased, result.totalRevenue], style = 'o+');
            worksheet.getRow(result.data.length + 3).font = { bold: true };
            worksheet.mergeCells(`A${result.data.length + 3}`, `B${result.data.length + 3}`);
            worksheet.getCell(`A${result.data.length + 3}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
        return {
            workbook, fileName: `${fileName}.xlsx`
        }
    } catch (error) {
        logger.error('Error - categoryAnalyticsExport', error);
        throw new Error(error);
    }
}

const courseSalesAnalytcs = async (data) => {
    try {
        let query = {}, publishCourseList, objIdArr, $and = [], countList = []

        if (data?.query) {
            if (data?.query?.instructorIds) {
                objIdArr = data?.query?.instructorIds.map(id => ObjectId(id))
                $and.push({ userId: { $in: objIdArr } })
            }
            if (data?.query?.courseIds) {
                objIdArr = data?.query?.courseIds.map(id => ObjectId(id))
                $and.push({ _id: { $in: objIdArr } })
            }
        }

        const instructorRole = await Role.findOne({ code: ROLE.INSTRUCTOR })
        if (!data?.query?.instructorIds && data?.user?.roles[0].roleId?._id.equals(instructorRole?._id)) {
            objIdArr = ObjectId(data?.user?._id)
            $and.push({ userId: objIdArr })
        }

        query.deletedAt = { $exists: false }
        if ($and.length > 0) {
            query.$and = $and
            publishCourseList = await publishCourses.find(query, { _id: 1, title: 1 })
        } else {
            publishCourseList = await publishCourses.find(query, { _id: 1, title: 1 })
        }

        const courseArr = await Promise.all(
            _.map(publishCourseList, async (course) => {
                const listArr = [];
                listArr.push(course.title)
                listArr.push(course._id)
                return listArr
            })
        )

        if (data?.query?.fromDate && data?.query?.toDate) {
            let fromDate, toDate
            fromDate = new Date(data?.query?.fromDate)
            toDate = new Date(data?.query?.toDate)
            toDate.setDate(toDate.getDate() + 1)

            countList = await Promise.all(
                _.map(courseArr, async (course) => {
                    let countPurchasedCourse = {},
                        courseCount;
                    courseCount = await Order.find({ sts: 1 }).countDocuments(
                        {
                            "courses.courseId": course[1],
                            createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) },
                        }
                    );
                    if (courseCount > 0) {
                        Object.assign(countPurchasedCourse, {
                            name: course[0],
                            y: courseCount,
                        });
                    } else {
                        return null
                    }
                    return countPurchasedCourse
                })
            )

        } else {
            countList = await Promise.all(
                _.map(courseArr, async (course) => {
                    let countPurchasedCourse = {},
                        courseCount;
                    courseCount = await Order.find({ sts: 1 }).countDocuments({
                        "courses.courseId": course[1],
                    });
                    if (courseCount > 0) {
                        Object.assign(countPurchasedCourse, { name: course[0], y: courseCount })
                    } else {
                        return null
                    }
                    return countPurchasedCourse
                })
            )
        }
        let resList = countList.filter(list => list)
        return resList
    }
    catch (error) {
        logger.error("Error - courseSalesAnalytcs ", error)
        throw new Error(error)
    }
}

const courseRatingAnalytics = async (data) => {
    try {
        let aggregation = [], $match = {}, startedCourseList, fromDate, toDate, query = {}

        Object.assign($match, { deletedAt: { $exists: false } })

        if (data?.query) {
            if (data?.query?.courseIds) {
                objIdArr = data?.query?.courseIds.map(id => ObjectId(id))
                Object.assign($match, { courseId: { $in: objIdArr } })
            }
        }

        if (data?.query) {
            if (data?.query?.fromDate && data?.query?.toDate) {
                toDate = new Date(data?.query?.toDate)
                toDate.setDate(toDate.getDate() + 1)
                Object.assign($match, {
                    createdAt: {
                        '$gte': new Date(data?.query?.fromDate),
                        '$lte': toDate
                    }
                })

            }
        }

        if ($match) {
            aggregation.push(
                {
                    $match: $match
                }
            )
            $match = {}
        }
        aggregation.push({
            $lookup: {
                from: "publishCourses",
                let: { id: "$courseId" },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ["$_id", "$$id"] } }
                    }
                ],
                as: "courseId"
            }
        })
        const instructorRole = await Role.findOne({ code: ROLE.INSTRUCTOR })
        if (data?.query) {
            if (data?.query?.instructorIds) {
                objIdArr = data?.query?.instructorIds.map(id => ObjectId(id))
                Object.assign($match, { "courseId.userId": { $in: objIdArr } })
            }
        }
        if (!data?.query?.instructorIds && data?.user?.roles[0].roleId?._id.equals(instructorRole?._id)) {
            objIdArr = ObjectId(data?.user?._id)
            Object.assign($match, { "courseId.userId": objIdArr })
        }
        if ($match) {
            aggregation.push(
                {
                    $match: $match
                }
            )
            $match = {}
        }

        aggregation.push(
            {
                $unwind: "$courseId"
            },
            { '$group': { _id: { name: '$courseId.title' }, y: { $sum: "$stars" } } },
            {
                $project: {
                    _id: 0,
                    name: "$_id.name",
                    y: 1
                }
            }
        )

        startedCourseList = await Review.aggregate(aggregation)
        return startedCourseList
    }
    catch (error) {
        logger.error("Error - courseRatingAnalytics ", error)
        throw new Error(error)
    }
}

module.exports = {
    courseAnalyticsReport,
    courseAnalyticsList,
    courseAnalyticsExport,

    categoryAnalyticsReport,
    categoryAnalyticsList,
    categoryAnalyticsExport,

    courseSalesAnalytcs,
    courseRatingAnalytics
}
