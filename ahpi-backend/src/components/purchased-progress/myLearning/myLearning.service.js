const dbService = require("../../../services/db.service");
const MyLearning = require("./myLearning.model");
const User = require("../../user/userModel");
const { getFilterQuery } = require("../../../services/filterQuery.service");
const { convertPaginationResult } = require("../../../configuration/common");
const { ObjectId } = require("mongodb");
const { PROGRESS_STS } = require("../../../configuration/constants/courseConstant");
const { commonProjection } = require('../../../configuration/common')
const myLearning = require("../myLearning/myLearning.model")
const historyModel = require("../../common/models/history")
const {certificateQueueFunction} = require("../progress/progressServices")
const { MODULE_NAME, HISTORY_CODE } = require("../../../configuration/constants/historyConstant")

const listMyLearning = async (req) => {
  try {
    const searchQuery = {};
    const query = {
      userId: ObjectId(req.user.id),
      ...req.body.query,
    };
    if (req?.body?.query?.search && req?.body?.query?.searchColumns?.length) {
      let queryData = await getFilterQuery(req?.body?.query);
      Object.assign(searchQuery, queryData);
    }
    delete query?.search;
    delete query?.searchColumns;
    const offset =
      req?.body.options?.page > 1
        ? (req?.body.options.page - 1) * req?.body.options.limit
        : 0;
    const limit = req?.body.options.limit || 100;
    if (query?.courseId && query?.courseId.length) {
      query.courseId = query?.courseId?.map((courseId) => {
        return ObjectId(courseId);
      });
      query.courseId = { $in: query.courseId };
    }

    const aggregateArray = [
      {
        $match: query,
      },
      {
        $lookup: {
          from: "publishCourses",
          let: {
            course: "$courseId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$course"],
                },
                deletedAt: {
                  $exists: false,
                },
                isActive: true,
              },
            },
            {
              $lookup: {
                from: "categories",
                let: {
                  category: "$parCategory",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ["$_id", "$$category"],
                      },
                      deletedAt: {
                        $exists: false,
                      },
                      isActive: true,
                    },
                  },
                ],
                as: "parCategory",
              },
            },
            {
              $lookup: {
                from: "file",
                let: {
                  id: "$imgId",
                },
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
                      ...commonProjection
                    },
                  },
                ],
                as: "imgId",
              },
            },
            {
              $unwind: {
                path: "$parCategory",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $unwind: {
                path: "$imgId",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                ...commonProjection
              },
            },
          ],
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
        $lookup: {
          from: 'file',
          localField: 'certiId',
          foreignField: '_id',
          as: 'certiId'
        }
      },
      {
        $unwind: {
          path: "$certiId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: searchQuery,
      },
      {
        $sort: req?.body?.options?.sort
          ? req.body.options.sort
          : { createdAt: -1 },
      },
      {
        $project: {
          __v: 0,
          canDel: 0
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          docs: [{ $skip: offset }, { $limit: limit }],
        },
      },
    ];
    const list = await MyLearning.aggregate(aggregateArray);
    return convertPaginationResult(list, { offset, limit });
  } catch (error) {
    logger.error("Error - My Learning", error);
    throw new Error(error);
  }
};

const addCourseToMyLearning = async (courseId, userId, orbitProjectData) => {
  const data = {
    userId,
    courseId
  };
  if (orbitProjectData){
    orbitProjectData.isFromOsc ? Object.assign(data, { isFromOsc: true, redirectUrl: orbitProjectData.redirectUrl }) : Object.assign(data, { isFromOgm: true })
  }
  return dbService.createDocument(MyLearning, data);
};

const getCertificate = async (certiCode) => {
  return await MyLearning.findOne({
    certiCode: certiCode,
    sts: PROGRESS_STS.COMPLETED,
  }).populate([
    {
      path: "courseId",
      populate: [{ path: "parCategory imgId", select: "name uri slug nm" }, {
        path: "userId",
        populate: { path: "profileId", select: "nm uri" },
        select: "name",
      }],
      select: "title slug desc briefDesc about includes require imgId parCategory",
    },
    { path: "certiId", select: "nm uri" },
  ]);
};

const updateCertificate = async (req) => {
  await Promise.all(req.body.users.map(async(userData)=>{
    let user = await User.findOneAndUpdate({ email: userData.userEmail, deletedAt: { '$exists': false } }, userData,{ new:true })
    if (user){
      let query = {
        userId: user._id,
        progress: 100
      }
      req.body?.courseId && Object.assign(query,{ courseId: req.body?.courseId })
      myLearning.find(query).populate({ path: "userId courseId" }).then(async (courseDocs)=>{
        courseDocs.map(async (courseDoc)=>{
          const oldCertificateData = {
          module: MODULE_NAME.CERTIFICATE,
          historyDetalis: [
            {
              courseId: courseDoc?.courseId?._id,
              userId: user._id,
              certiId: courseDoc?.certiId,
              certiCode: courseDoc?.certiCode
            }
            ],
            code: HISTORY_CODE.CERTIFICATE,
            history_type: 1
          }
          const certiHistory = await historyModel.findOne({ "historyDeatalis.userId": user._id })
          if(certiHistory) {
            await historyModel.findOneAndUpdate({ "historyDeatalis.userId": user._id }, { $push : { historyDetalis : oldCertificateData.historyDetalis } }, { new : true })
          } else {
            await historyModel.create(oldCertificateData)
          }
          await certificateQueueFunction(courseDoc, courseDoc.isFromOgm ? {
            courseId: courseDoc?.courseId?._id,
            courseSlug: courseDoc?.courseId?.slug,
            email: courseDoc?.userId?.email
          }:{})
        })
      })
    }
  }))
  return true
}

module.exports = {
  listMyLearning: listMyLearning,
  addCourseToMyLearning: addCourseToMyLearning,
  getCertificate,
  updateCertificate,
};
