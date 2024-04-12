const { draftCourses, publishCourses } = require("../courseModel");
const { STATUS, MATERIAL } = require("../../../configuration/constants/courseConstant");
const { emailFunction } = require("../../emails/emailServices");
const {
  FILE_STATUS,
} = require("../../../configuration/constants/fileConstants");
const { draftSections, publishSections } = require("../sectionModel");
const { draftMaterials, publishMaterials } = require("../materialsModel");
const { draftQuestions, publishQuestions } = require("../questionsModel");
const { ObjectId } = require("mongodb");
const { Master } = require("@knovator/masters-node");
const {
  coursePercentage,
} = require("../../purchased-progress/progress/progressServices");
const Search = require("../../search/searchModel");
const { TYPE } = require("../../../configuration/constants/wishlistConstants");
const SEARCH = require("../../../configuration/constants/searchConstants");
const { MAIL_EVENT_NAMES } = require("../../../configuration/constants/novu.constant")
const {
  convertPaginationResult,
  commonProjection,
} = require("../../../configuration/common");
const { getFilterQuery } = require("../../../services/filterQuery.service");
const {
  ORDERSTATUS,
} = require("../../../configuration/constants/paymentConstant");
const Order = require("../../order/order.model");
const role = require("../../roles/roleModel");
const { ROLE, JWT_STRING, SSO_REGISTER } = require("../../../configuration/constants/authConstant");
const rejectCourseLog = require("../../courses/rejectCourseModel");
const Settings = require("../../settings/settings.model");
const moment = require("moment");
const {
  TOP_LIST_SETTINGS,
  BADGE_SETTINGS,
  SETTING_CODE,
  REWARD
} = require("../../../configuration/constants/settingConstants");
const axios = require("axios");
const userModel = require("../../user/userModel")
const { ssoGenerateToken } = require("../../../configuration/common")
const jwt = require('jsonwebtoken');
const timestamp = require('unix-timestamp');
const { storeCachingData } = require("../../../services/redis.service");
const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");

const topicMasters = {
  $lookup: {
    from: "master",
    let: { ids: { $ifNull: ["$topics", []] } },
    pipeline: [
      {
        $match: {
          $expr: {
            $in: ["$_id", "$$ids"],
          },
          isActive: true,
        },
      },
      {
        $project: {
          ...commonProjection,
        },
      },
    ],
    as: "topics",
  },
};

const commonPopulatesInCourse = async (array) => {
  array.push(
    {
      $lookup: {
        from: "categories",
        let: { id: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$id"],
              },
              deletedAt: { $exists: false },
              isActive: true,
            },
          },
          topicMasters,
          {
            $project: {
              ...commonProjection,
            },
          },
        ],
        as: "category",
      },
    },
    {
      $lookup: {
        from: "categories",
        let: { id: "$parCategory" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$_id", "$$id"],
              },
              deletedAt: { $exists: false },
              isActive: true,
            },
          },
          topicMasters,
          {
            $project: {
              ...commonProjection,
            },
          },
        ],
        as: "parCategory",
      },
    },
    {
      $lookup: {
        from: "file",
        let: { id: "$imgId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
            },
          },
          {
            $project: {
              ...commonProjection,
            },
          },
        ],
        as: "imgId",
      },
    },
    { $unwind: { path: "$imgId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "master",
        let: { id: "$levelId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
              deletedAt: { $exists: false },
              isActive: true,
            },
          },
          {
            $project: {
              code: 1,
              name: 1,
              names: 1,
              seq: 1,
              parentId: 1,
              parentCode: 1,
            },
          },
        ],
        as: "levelId",
      },
    },
    { $unwind: { path: "$levelId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "master",
        let: { id: "$badgeId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
              deletedAt: { $exists: false },
              isActive: true,
            },
          },
          {
            $project: {
              code: 1,
              name: 1,
              names: 1,
              seq: 1,
              parentId: 1,
              parentCode: 1,
            },
          },
        ],
        as: "badgeId",
      },
    },
    { $unwind: { path: "$badgeId", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "master",
        let: { id: "$lang" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$id"],
              },
              deletedAt: { $exists: false },
              isActive: true,
            },
          },
          {
            $project: {
              code: 1,
              name: 1,
              names: 1,
              seq: 1,
              parentId: 1,
              parentCode: 1,
            },
          },
        ],
        as: "lang",
      },
    },
    { $unwind: { path: "$lang", preserveNullAndEmptyArrays: true } }
  );
  return array;
};

const courseFilter = async (data, array) => {
  let filter = [];
  if (data?.filter?.userIds && data?.filter?.userIds?.length > 0) {
    let userIds = await Promise.all(
      data.filter.userIds.map(async (id) => ObjectId(id))
    );
    filter.push({ "userId._id": { $in: userIds } });
  }
  if (data?.filter?.categories && data?.filter?.categories?.length > 0) {
    let categoryIds = await Promise.all(
      data.filter.categories.map(async (id) =>
        /^[0-9a-fA-F]{24}$/.test(id) ? ObjectId(id) : id
      )
    );
    filter.push({
      $or: [
        { "category.slug": { $in: categoryIds } },
        { "parCategory.slug": { $in: categoryIds } },
        { "category._id": { $in: categoryIds } },
        { "parCategory._id": { $in: categoryIds } },
      ],
    });
  }
  if (data?.filter?.topics && data?.filter?.topics?.length > 0) {
    filter.push({
      $or: [
        { "category.topics.code": { $in: data?.filter?.topics } },
        { "parCategory.topics.code": { $in: data?.filter?.topics } },
      ],
    });
  }
  if (data?.filter?.levels && data?.filter?.levels?.length > 0) {
    filter.push({ "levelId.code": { $in: data?.filter?.levels } });
  }
  if (data?.filter?.lang && data?.filter?.lang?.length > 0) {
    filter.push({ "lang.code": { $in: data?.filter?.lang } });
  }
  if (data?.filter?.ratings || data?.filter?.ratings == 0) {
    filter.push({ avgStars: { $gte: data.filter.ratings } });
  }
  if (data?.filter?.prices && data?.filter?.prices?.length > 0) {
    let queryArray = [];
    await Promise.all(
      _.map(data.filter.prices, async (price) => {
        const splitPrice = price.split("-");
        const priceQuery =
          splitPrice.length == 1
            ? { $gte: parseInt(splitPrice[0]) }
            : { $lte: parseInt(splitPrice[1]), $gte: parseInt(splitPrice[0]) };
        queryArray.push({ "price.sellPrice": priceQuery });
      })
    );
    filter.push({
      $or: [...queryArray],
    });
  }
  if (filter?.length > 0) {
    array.push({
      $match: {
        $and: filter,
      },
    });
  }
};

const slugExist = async (data, id) => {
  slug = data.slug ? data.slug : slugify(data?.name);
  const draftSlug = await draftCourses.findOne({
    slug: slug,
    _id: { $ne: id },
  });
  const publishSlug = await publishCourses.findOne({
    slug: slug,
    _id: { $ne: id },
  });
  return { draftSlug, publishSlug };
};
const createBasicInfo = async (data) => {
  try {
    const courseSlug = await slugExist(data);
    if (courseSlug.draftSlug || courseSlug.publishSlug) {
      return { flag: false };
    }
    const result = await draftCourses.create(data);
    return { flag: true, data: result };
  } catch (error) {
    logger.error("Error - createBasicInfoCourse", error);
    throw new Error(error);
  }
};

const createUpdateCourseInfo = async (data, id) => {
  try {
    const result = await draftCourses.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return { flag: true, data: result };
  } catch (error) {
    logger.error("Error - createCourseInfo", error);
    throw new Error(error);
  }
};

const createUpdatePrice = async (data, id) => {
  try {
    if (data?.price?.sellPrice > data?.price?.MRP) {
      return { flag: false };
    }
    if (data?.price?.InAppPurchaseSellPrice > data?.price?.InAppPurchaseMRP) {
      return { flag: false, errMsg: "specificMsg.validPriceTier" };
    }
    if (data?.rewardPoints) {
      const rewardValPrice = await Settings.findOne({ code: REWARD.REWARD_CALC })
      const rewardCalPrice = rewardValPrice?.details?.price * data?.rewardPoints
      if (rewardCalPrice > data?.price?.sellPrice) {
        return { errMsg: "module.greaterVal" }
      }
    }
    const result = await draftCourses.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return { flag: true, data: result };
  } catch (error) {
    logger.error("Error - createCoursePrice", error);
    throw new Error(error);
  }
};

const updateBasicInfo = async (id, data) => {
  try {
    const courseSlug = await slugExist(data, id);
    if (courseSlug.draftSlug || courseSlug.publishSlug) {
      return { flag: false };
    }
    const result = await draftCourses.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    await draftSections.updateMany(
      { courseId: id },
      { userId: result?.userId },
      { new: true }
    );
    await draftMaterials.updateMany(
      { courseId: id },
      { userId: result?.userId },
      { new: true }
    );
    await draftQuestions.updateMany(
      { courseId: id },
      { userId: result?.userId },
      { new: true }
    );
    return { flag: true, data: result };
  } catch (error) {
    logger.error("Error - updateBasicInfoCourse", error);
    throw new Error(error);
  }
};

const publishCourse = async (req) => {
  try {
    const data = req.body
    const user = req.user
    let findDraftCourse = await draftCourses.aggregate([
      {
        $match: {
          _id: ObjectId(data?.courseId),
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { id: "$parCategory" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$id"],
                },
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $lookup: {
          from: "user",
          let: { id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', "$$id"]
                }
              }
            }
          ],
          as: "instructor"
        }
      },
      { $unwind: { path: "$instructor", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "file",
          let: { id: "$imgId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],
                },
              },
            },
            {
              $project: {
                uri: 1,
              },
            },
          ],
          as: "imageUrl",
        },
      },
      { $unwind: { path: "$imageUrl", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "draftSections",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$courseId"],
                },
              },
            },
            {
              $project: {
                ...commonProjection,
              },
            },
          ],
          as: "sections",
        },
      },
      {
        $lookup: {
          from: "draftMaterials",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$courseId"],
                },
              },
            },
            {
              $project: {
                ...commonProjection,
              },
            },
          ],
          as: "materials",
        },
      },
      {
        $lookup: {
          from: "draftQuestions",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$id", "$courseId"],
                },
              },
            },
            {
              $project: {
                ...commonProjection,
                "opts._id": 0,
              },
            },
          ],
          as: "questions",
        },
      },
      {
        $addFields: {
          totalLessons: { $size: "$materials" }
        },
      },
      {
        $addFields: {
          "materials.completionPercent": {
            $cond: {
              if: { $ne: ["$totalLessons", 0] },
              then: { $divide: [100, "$totalLessons"] },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          ...commonProjection,
        },
      },
    ]);
    const courseData = _.first(findDraftCourse);
    if (!courseData || !courseData.sections.length || !courseData.materials.length) {
      return { flag: false, msg: "specificMsg.publishErr", data: "" };
    }
    let findCourse = await publishCourses.findOne({ _id: data.courseId });
    if (findCourse) {
      await publishCourses.deleteOne({ _id: data.courseId });
    }
    const draftResult = await draftCourses.findOneAndUpdate(
      { _id: data.courseId },
      { sts: STATUS.PUBLISH, isActive: true, isPreview: false, isReject: false },
      { new: true }
    );
    if (draftResult?.sts) {
      courseData.sts = draftResult.sts;
      courseData.isActive = draftResult.isActive;
    }
    let quizWithCertificateMaterials = courseData.materials.filter((materialDoc) => materialDoc.type == MATERIAL.QUIZ_WITH_CERTIFICATE);
    for (let index = 0; index < quizWithCertificateMaterials.length; index++) {
      let quizWithCertificateQuestions = courseData.questions.filter((question) => question.quizId == quizWithCertificateMaterials[index]._id.toString());
      let quizWithCertificateSection = courseData.sections.filter((section) => section._id.toString() == quizWithCertificateMaterials[index].secId);
      let totalMarks = _.sumBy(quizWithCertificateQuestions, 'posMark');
      if (quizWithCertificateMaterials[index].passingScore > totalMarks) {
        // give error total marks is less than passing score
        return { flag: false, msg: "specificMsg.passingScoreErr", data: { "{section}": `${quizWithCertificateSection[0].nm}`, "{material}": `${quizWithCertificateMaterials[index].nm}` } };
      }
    }
    await Promise.all([
      publishSections.insertMany(courseData.sections),
      publishCourses.create(courseData),
      publishMaterials.insertMany(courseData.materials),
      publishQuestions.insertMany(courseData.questions),
    ]);
    if (req.headers?.[CASHING_KEY_NAME]) {
      req.params.slug = courseData.slug
      getCourse(req, STATUS.PUBLISH, publishCourses).then(async (resp) => {
        await storeCachingData(req.headers[CASHING_KEY_NAME], resp)
      })
    }
    return { flag: true, data: courseData.title };
  } catch (error) {
    logger.error("Error - publishNow", error);
    throw new Error(error);
  }
};

const getList = async (data, status, model) => {
  try {
    const offset =
      data.options?.page > 1 ? (data.options.page - 1) * data.options.limit : 0;
    const limit = data.options.limit || 100;
    let search = data?.query?.search;
    const instructorRole = await role.findOne({ code: ROLE.INSTRUCTOR });
    let aggregateArray = [];

    if (data?.query?.search) {
      let queryData = await getFilterQuery(data.query);
      Object.assign(data.query, queryData);
    }
    delete data.query?.search;
    delete data.query?.searchColumns;

    if (data?.user?.roles[0]?.roleId?._id.equals(instructorRole._id)) {
      aggregateArray.push({
        $match: {
          deletedAt: { $exists: false },
          ...data.query,
          userId: data?.user?._id,
        },
      });
    } else {
      aggregateArray.push({
        $match: {
          deletedAt: { $exists: false },
          ...data.query,
        },
      });
    }

    aggregateArray.push(
      {
        $lookup: {
          from: "user",
          let: { id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],
                },
                deletedAt: { $exists: false },
                isActive: true,
              },
            },
            {
              $project: {
                name: 1,
                email: 1,
                countryCode: 1,
                mobNo: 1,
                isActive: 1,
              },
            },
          ],
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      // {
      //   $lookup: {
      //     from: "reviews",
      //     let: { id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$courseId", "$$id"],
      //           },
      //           deletedAt: { $exists: false },
      //           isActive: true,
      //         },
      //       },
      //     ],
      //     as: "reviews",
      //   },
      // },
      {
        $lookup: {
          from: "wishlist",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
                deletedAt: { $exists: false },
                type: TYPE.SAVE,
                userId: ObjectId(data?.user?._id),
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $lookup: {
          from: "myLearning",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
                deletedAt: { $exists: false },
                userId: ObjectId(data?.user?._id),
              },
            },
          ],
          as: "myLearning",
        },
      },
      {
        $lookup: {
          from: "carts",
          let: {
            id: "$_id",
            token: data?.deviceToken,
            userId: ObjectId(data?.user?._id),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$id", "$courses"] },
                    data.user
                      ? { $eq: ["$userId", "$$userId"] }
                      : { $eq: ["$deviceToken", "$$token"] },
                  ],
                },
              },
            },
          ],
          as: "carts",
        },
      },
      {
        $lookup: {
          from: "wishlist",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
                type: TYPE.VIEW,
              },
            },
          ],
          as: "viewedList",
        },
      }
    );
    await commonPopulatesInCourse(aggregateArray);
    aggregateArray.push(
      {
        $addFields: {
          // avgStars: {
          //   $cond: {
          //     if: { $ne: [{ $size: { $ifNull: ["$reviews", []] } }, 0] },
          //     then: {
          //       $round: [
          //         {
          //           $divide: [
          //             { $sum: "$reviews.stars" },
          //             { $size: "$reviews" },
          //           ],
          //         },
          //         1,
          //       ],
          //     },
          //     else: 0,
          //   },
          // },
          totalViewed: { $size: "$viewedList" },
          isSaved: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$wishlist", []] } }, 0] },
              then: true,
              else: false,
            },
          },
          isPurchased: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$myLearning", []] } }, 0] },
              then: true,
              else: false,
            },
          },
          inCart: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$carts", []] } }, 0] },
              then: true,
              else: false,
            },
          },
          // totalReviews: { $size: "$reviews" },
        },
      },
      {
        $project: {
          // reviews: 0,
          myLearning: 0,
          carts: 0,
          viewedList: 0,
          wishlist: 0,
          __v: 0,
        },
      },
      {
        $sort: data.options.sort ?? { createdAt: -1 },
      }
    );
    await courseFilter(data, aggregateArray);
    aggregateArray.push({
      $facet: {
        metadata: [{ $count: "total" }],
        // added for return all data of course for cron
        docs: data.options.pagination == false ? [{ $skip: offset }] : [{ $skip: offset }, { $limit: limit }],
      },
    });
    const list = await model.aggregate(aggregateArray);
    const result = convertPaginationResult(list, { offset, limit });
    if (data?.saveSearch) {
      let storeSearch = {
        title: search,
        searchResultCount: result.paginator?.itemCount,
        userId: data?.userId,
        deviceToken: data?.deviceToken,
        type: SEARCH.GLOBAL,
        createdBy: data?.userId,
        updatedBy: data?.userId,
      };
      await Search.create(storeSearch);
    }
    return result;
  } catch (error) {
    logger.error("Error - courseList", error);
    throw new Error(error);
  }
};

const getFilterList = async (data) => {
  try {
    let topics = {};
    let levels = {};
    let languages = {};
    let price = {};
    let priceRange = ["Price range"];
    data.saveSearch = false;
    const coursesDetails = await getList(data, STATUS.publish, publishCourses)
    coursesDetails.data.map(course => {
      if (
        course?.parCategory?.[0]?.topics &&
        course?.category?.[0]?.topics
      ) {
        course.parCategory[0].topics.forEach((topic) => {
          topics[topic.code] = topic;
        });
        course?.category?.[0]?.topics.forEach((topic) => {
          topics[topic.code] = topic;
        });
      }
      if (!levels[course.levelId.code]) {
        levels[course.levelId.code] = course.levelId;
      }
      if (!languages[course?.lang?.code]) {
        languages[course.lang?.code] = course.lang;
      }
      if (!price[course?.price?.sellPrice]) {
        price[course?.price?.sellPrice] = course.price.sellPrice;
      }
    })
    const maxPrice = Object.values(price).pop();
    const midPrice = await priceCalculations(maxPrice / process.env.PRICEROWS);
    let i = 0;
    if (maxPrice <= 1) {
      priceRange.push("0 - 1");
    } else {
      while (i < maxPrice) {
        priceRange.push(`${i == 0 ? i : i + 1} - ${i + midPrice}`);
        i = await priceCalculations(i + midPrice);
      }
    }
    const ratings = await Master.find({ parentCode: "RATINGS" });
    const headings = await Master.find({
      $or: [{
        code: "LANGUAGES"
      }, {
        code: "LEVEL"
      }, {
        code: "TOPICS"
      }, {
        code: "RATINGS"
      }]
    });
    ratings.splice(0, 0, headings[2]);

    var topicObj = Object.values(topics);
    topicObj.splice(0, 0, headings[3]);

    var levelsObj = Object.values(levels);
    levelsObj.splice(0, 0, headings[1]);

    var languagesObj = Object.values(languages);
    languagesObj.splice(0, 0, headings[0]);

    return {
      topics: topicObj,
      levels: levelsObj,
      languages: languagesObj,
      priceRange: priceRange,
      ratings: ratings,
    };
  } catch (error) {
    logger.error("Error - getFilterList", error);
    throw new Error(error);
  }
};

const priceCalculations = async (value) => {
  try {
    value = Math.round(value);
    const roundOffNearest =
      value.toString().length === 2 || 1
        ? 10
        : value.toString().length === 3
          ? 100
          : 1000;
    return Math.ceil(value / roundOffNearest) * roundOffNearest;
  } catch (error) {
    logger.error("Error - priceCalculations", error);
    throw new Error(error);
  }
};

const softDeleteCourse = async (data) => {
  try {
    if (data.ids) {
      await draftCourses.deleteOne({ _id: { $in: data.ids } });
      await Promise.all([
        publishCourses.updateMany({ _id: { $in: data.ids } }, data),
        publishSections.updateMany({ courseId: { $in: data.ids } }, data),
        publishMaterials.updateMany({ courseId: { $in: data.ids } }, data),
        publishQuestions.updateMany({ courseId: { $in: data.ids } }, data),
      ]);
    }
    return { flag: true };
  } catch (error) {
    logger.error("Error - courseDelete", error);
    throw new Error(error);
  }
};

const partialUpdate = async (data, id) => {
  try {
    let course = await draftCourses.findOne({ _id: id });
    if (course?.sts === STATUS.DRAFT && data.isActive) {
      return false;
    }
    data.activatedAt = await convertToTz({
      tz: process.env.TZ,
      date: new Date(),
    });
    return Promise.all([
      publishCourses.findOneAndUpdate({ _id: id }, data, { new: true }),
      draftCourses.findOneAndUpdate({ _id: id }, data, { new: true }),
    ]);
  } catch (error) {
    logger.error("Error - coursePartialUpdate", error);
    throw new Error(error);
  }
};

const getCourse = async (req, status, model, onlyActive = [true]) => {
  try {
    if (req.query.isFromAdmin) {
      const draftCourse = await draftCourses.findOne({ slug: req.params.slug })
      onlyActive = [draftCourse?.isActive]
    }

    let obj = {};
    if (req.params.id) {
      Object.assign(obj, { _id: ObjectId(req.params.id) });
    } else {
      Object.assign(obj, { slug: req.params.slug });
    }
    let aggregateArray = [];
    aggregateArray.push({
      $match: {
        deletedAt: { $exists: false },
        ...obj,
        isActive: { $in: onlyActive },
      },
    });
    await commonPopulatesInCourse(aggregateArray);
    aggregateArray.push(
      {
        $lookup: {
          from: "user",
          let: { id: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],
                },
                deletedAt: { $exists: false },
                isActive: true,
              },
            },
            {
              $lookup: {
                from: "file",
                let: { fileId: "$profileId" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$fileId"],
                      },
                    },
                  },
                  {
                    $project: {
                      ...commonProjection,
                    },
                  },
                ],
                as: "profileId",
              },
            },
            {
              $unwind: { path: "$profileId", preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                name: 1,
                email: 1,
                countryCode: 1,
                mobNo: 1,
                isActive: 1,
                bio: 1,
                profileId: 1,
                companyNm: 1,
                socialLinks: 1
              },
            },
          ],
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: `${status}Sections`,
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
              },
            },
          ],
          as: "sections",
        },
      },
      {
        $lookup: {
          from: "certificate",
          let: { id: "$certificateId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$id']
                }
              }
            }
          ],
          as: "certificateId"
        }
      },
      // {
      //   $lookup: {
      //     from: "reviews",
      //     let: { id: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $eq: ["$courseId", "$$id"],
      //           },
      //           deletedAt: { $exists: false },
      //           isActive: true,
      //         },
      //       },
      //     ],
      //     as: "reviews",
      //   },
      // },
      {
        $lookup: {
          from: "wishlist",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
                deletedAt: { $exists: false },
                type: TYPE.SAVE,
                userId: ObjectId(req.user?._id),
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $lookup: {
          from: "myLearning",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$id"],
                },
                deletedAt: { $exists: false },
                userId: ObjectId(req.user?._id),
              },
            },
          ],
          as: "myLearning",
        },
      },
      {
        $lookup: {
          from: "carts",
          let: {
            id: "$_id",
            token: req.query?.deviceToken,
            userId: ObjectId(req.user?._id),
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$id", "$courses"] },
                    req.user
                      ? { $eq: ["$userId", "$$userId"] }
                      : { $eq: ["$deviceToken", "$$token"] },
                  ],
                },
              },
            },
          ],
          as: "carts",
        },
      },
      {
        $addFields: {
          totalSections: { $size: "$sections" },
          // avgStars: {
          //   $cond: {
          //     if: { $ne: [{ $size: { $ifNull: ["$reviews", []] } }, 0] },
          //     then: {
          //       $round: [
          //         {
          //           $divide: [
          //             { $sum: "$reviews.stars" },
          //             { $size: "$reviews" },
          //           ],
          //         },
          //         1,
          //       ],
          //     },
          //     else: 0,
          //   },
          // },
          isSaved: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$wishlist", []] } }, 0] },
              then: true,
              else: false,
            },
          },
          isPurchased: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$myLearning", []] } }, 0] },
              then: true,
              else: false,
            },
          },
          inCart: {
            $cond: {
              if: { $ne: [{ $size: { $ifNull: ["$carts", []] } }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          sections: 0,
          // reviews: 0,
          wishlist: 0,
          carts: 0,
        },
      }
    );
    const result = await model.aggregate(aggregateArray);
    return result;
  } catch (error) {
    logger.error("Error - getCourse", error);
    throw new Error(error);
  }
};


const topCourseByHighestSell = async () => {
  try {
    const setting = await Settings.findOne({
      code: TOP_LIST_SETTINGS.TOP_COURSE,
      isActive: true,
    });
    const details = setting.details;
    let aggregateArray = [];
    if (details && details.purchaseInLastXDays) {
      const endDate = moment();
      const startDate = moment().subtract(
        parseInt(details.purchaseInLastXDays, 10),
        "days"
      );
      aggregateArray.push({
        $match: {
          $and: [
            { createdAt: { $gte: new Date(startDate) } },
            { createdAt: { $lte: new Date(endDate) } },
          ],
        },
      });
    }
    aggregateArray = aggregateArray.concat([
      {
        $match: {
          sts: ORDERSTATUS.SUCCESS,
        },
      },
      {
        $unwind: {
          path: "$courses",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$courses.courseId",
          totalPurchase: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalPurchase: -1,
        },
      },
      {
        $limit: details?.limit || 20,
      },
      {
        $group: {
          _id: "",
          topCourse: {
            $push: "$_id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          topCourse: 1,
        },
      },
    ]);
    const result = await Order.aggregate(aggregateArray);
    if (result && result[0] && result[0].topCourse) {
      return result[0].topCourse;
    }
    return [];
  } catch (error) {
    logger.error("Error - topCourseByHighestSell", error);
    throw new Error(error);
  }
};

const topCategoryByHighestSell = async () => {
  try {
    const setting = await Settings.findOne({
      code: TOP_LIST_SETTINGS.TOP_CATEGORY,
      isActive: true,
    });
    const details = setting.details;
    let aggregateArray = [];
    if (details && details.purchaseInLastXDays) {
      const endDate = moment();
      const startDate = moment().subtract(
        parseInt(details.purchaseInLastXDays, 10),
        "days"
      );
      aggregateArray.push({
        $match: {
          $and: [
            { createdAt: { $gte: new Date(startDate) } },
            { createdAt: { $lte: new Date(endDate) } },
          ],
        },
      });
    }
    aggregateArray = aggregateArray.concat([
      {
        $match: {
          sts: ORDERSTATUS.SUCCESS,
        },
      },
      {
        $lookup: {
          from: "publishCourses",
          localField: "courses.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$course.category",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$course.category",
          totalPurchase: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalPurchase: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $group: {
          _id: "",
          topCategory: {
            $push: "$_id",
          },
        },
      },
      {
        $project: {
          _id: 0,
          topCategory: 1,
        },
      },
    ]);
    const result = await Order.aggregate(aggregateArray);
    if (result && result[0] && result[0].topCategory) {
      return result[0].topCategory;
    }
    return [];
  } catch (error) {
    logger.error("Error - topCategoryByHighestSell", error);
    throw new Error(error);
  }
};

const hotSellingCourse = async () => {
  try {
    const setting = await Settings.findOne({
      code: BADGE_SETTINGS.HOT_SELLING,
      isActive: true,
    });
    const aggregate = [
      {
        $match: {
          sts: ORDERSTATUS.SUCCESS,
        },
      },
      {
        $unwind: {
          path: "$courses",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "publishCourses",
          let: { id: "$courses.courseId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$id"],
                }
              }
            }
          ],
          as: "course"
        }
      }, {
        '$unwind': { path: '$course', preserveNullAndEmptyArrays: false }
      },
      {
        $group: {
          _id: "$courses.courseId",
          totalPurchase: {
            $sum: 1,
          },
          average: { $first: "$course.avgStars" }
        },
      },
      {
        $match: {
          totalPurchase: {
            $gte: parseInt(setting?.details?.minimumPurchase, 10) || 10,
          },
          average: {
            $gte: parseInt(setting?.details?.minimumRating, 10) || 3,
          },
        }
      },
      // {
      //   $lookup: {
      //     from: "reviews",
      //     let: {
      //       id: "$_id",
      //     },
      //     pipeline: [
      //       {
      //         $match: {
      //           deletedAt: {
      //             $exists: false,
      //           },
      //           $expr: {
      //             $eq: ["$courseId", "$$id"],
      //           },
      //         },
      //       },
      //       {
      //         $group: {
      //           _id: "$courseId",
      //           average: {
      //             $avg: "$stars",
      //           },
      //         },
      //       },
      //       {
      //         $match: {
      //           average: {
      //             $gte: parseInt(setting?.details?.minimumRating, 10) || 3,
      //           },
      //         },
      //       },
      //     ],
      //     as: "review",
      //   },
      // },
      // {
      //   $match: {
      //     average: {
      //       $gte: parseInt(setting?.details?.minimumRating, 10) || 3,
      //     },
      //   },
      // },
      // {
      //   $unwind: {
      //     path: "$review",
      //     preserveNullAndEmptyArrays: false,
      //   },
      // },
      {
        $group: {
          _id: null,
          hotSelling: {
            $push: "$_id",
          },
        },
      },
    ]
    const result = await Order.aggregate(aggregate);
    if (result && result[0] && result[0].hotSelling) {
      return result[0].hotSelling;
    }
    return [];
  } catch (error) {
    logger.error("Error - hotSellingCourse", error);
  }
};

const updateOrbitProjectCourseDetails = async (data) => {
  try {
    const authToken = await ssoGenerateToken(data?.instructor)
    const config = {
      headers: {
        Authorization: `${JWT_STRING}${authToken.data.data.token}`,
      },
      data: { ...data, requestType: SSO_REGISTER },
      method: "PUT",
    };
    const orbitProjectWebhookUrls = {
      ogmApiUrl: `${process.env.OGM_API_URL}/web/user-stages/update/course/${data?.slug}`,
      oscApiUrl: `${process.env.OSC_API_URL}/admin/product/update-course`,
    }
    for (let webHookUrl in orbitProjectWebhookUrls) {
      Promise.resolve(
        axios({ url: orbitProjectWebhookUrls[webHookUrl], ...config }))
        .then().catch((err) => logger.error(err));
    }
    return { flag: true };
  } catch (error) {
    logger.error("Error-updateOrbitProjectCourseDetails", error);
  }
};

const approveCourse = async (id) => {
  try {
    await draftCourses.findOneAndUpdate(
      { _id: id },
      { isPreview: true, isReject: false }
    );
    return true;
  } catch (error) {
    logger.error("Error-approveInstructorCourse", error);
  }
};

const previewCourseCount = async (data) => {
  try {
    const findAdminRole = await role.findOne({ code: ROLE.ADMIN });

    if (data?.user?.roles[0]?.roleId?._id.equals(findAdminRole._id)) {
      let countPreview = await draftCourses.count({ isPreview: true, isReject: false });
      return countPreview
    }
  } catch (error) {
    logger.error("Error-previewInstructorCourse", error);
  }
};
const verifyCourse = async (id, user) => {
  try {
    const verifiedCourse = await draftCourses.findOneAndUpdate(
      { _id: id },
      { isPreview: false, isVerified: true, isReject: false },
      { new: true, populate: [{ path: "userId" }] }
    );

    await publishCourse({ courseId: id }, user)
    await publishCourses.findOneAndUpdate(
      { _id: id },
      { isPreview: false, isVerified: true, isReject: false },
    )
    await emailFunction(MAIL_EVENT_NAMES.VERIFIED_COURSE, verifiedCourse?.userId, { userNm: `${verifiedCourse?.userId?.firstName}${verifiedCourse?.userId?.lastName}`, courseName: verifiedCourse?.title });
  } catch (error) {
    logger.error("Error-verifyInstructorCourse", error);
  }
};
const rejectCourse = async (data, id) => {
  try {
    const rejectCourse = await draftCourses.findOne({ _id: id }).populate("userId");
    const payload = {
      rejectReason: data.rejectList,
      courseNm: rejectCourse?.title,
      userNm: `${rejectCourse?.userId?.firstName}${rejectCourse?.userId?.lastName}`
    };
    await emailFunction(MAIL_EVENT_NAMES.REJECT_COURSE, rejectCourse?.userId, payload);
    await draftCourses.findOneAndUpdate({ _id: id }, { isReject: true })
    const isDocExist = await rejectCourseLog.findOne({ courseId: id });
    const updateData = {
      rejectReason: data?.rejectList,
    };
    if (isDocExist) {
      updateData.updatedBy = data?.user?._id;
    } else {
      updateData.createdBy = data?.user?._id;
    }
    await rejectCourseLog.findOneAndUpdate({ courseId: id }, updateData, {
      upsert: true,
    });
  } catch (error) {
    logger.error("Error-rejectInstructorCourse", error);
  }
};

const courseCount = async ({ id, courseLimit, isAdminUpdate }) => {
  try {
    let count = 0, matchedCourseLimit, matchedCond

    const userDoc = await userModel.findOne({ _id: id })
    const draftCourse = await draftCourses.find({ userId: userDoc?._id })
    matchedCourseLimit = courseLimit ?? userDoc?.agreement?.courseLimit
    matchedCond = isAdminUpdate ? draftCourse.length > matchedCourseLimit : draftCourse.length >= matchedCourseLimit
    if (matchedCond) {
      return { flag: false, count: draftCourse.length }
    } else {
      return { flag: true, count: draftCourse.length }
    }
  } catch (error) {
    logger.error("Error - courseCount ", error)
    throw new Error(error)
  }
}

const generateInAppsToken = async () => {
  try {
    const inAppsPurchasDetails = await Settings.findOne({ code: SETTING_CODE.IN_APPS_PURCHASE_DETAILS })

    return `Bearer ${jwt.sign({
      "iss": inAppsPurchasDetails.details.iss,
      "iat": timestamp.now(),
      "exp": timestamp.now("+1h"),
      "aud": inAppsPurchasDetails.details.aud,
      "bid": inAppsPurchasDetails.details.bid
    }, inAppsPurchasDetails.details.privateKey, {
      algorithm: "ES256",
      header: inAppsPurchasDetails.details.header
    })}`
  } catch (error) {
    logger.error("Error - inAppsPurchasDetails.details.iss ", error)
    throw new Error(error)
  }
}

module.exports = {
  createBasicInfo,
  updateBasicInfo,
  createUpdateCourseInfo,
  createUpdatePrice,
  publishCourse,
  getList,
  getFilterList,
  softDeleteCourse,
  partialUpdate,
  getCourse,
  topCourseByHighestSell: topCourseByHighestSell,
  topCategoryByHighestSell: topCategoryByHighestSell,
  hotSellingCourse: hotSellingCourse,
  approveCourse: approveCourse,
  previewCourseCount: previewCourseCount,
  verifyCourse: verifyCourse,
  rejectCourse: rejectCourse,
  courseCount: courseCount,
  generateInAppsToken
};
