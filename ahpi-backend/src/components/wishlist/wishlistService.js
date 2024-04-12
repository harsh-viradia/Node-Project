const Wishlist = require("./wishlistModel");
const { ObjectId } = require("mongodb");
const { convertPaginationResult, commonProjection } = require("../../configuration/common");
const { TYPE } = require("../../configuration/constants/wishlistConstants");
const moment = require('moment-timezone')
const { getFilterQuery } = require('../../services/filterQuery.service')

const saveCourse = async(data) => {
    try {
        const savedCourse = await Wishlist.findOne({userId: data?.userId, courseId: data?.courseId, type: TYPE.SAVE})
        if (savedCourse) {
            data = {
                deletedAt : await convertToTz({ tz: process.env.TZ, date: new Date() }),
                deletedBy: data?.userId
            }
            await Wishlist.findOneAndUpdate({_id: savedCourse?._id}, data, {new: true})
            return false
        } else {
            await Wishlist.create(data)
            return true
        }
    } catch(error) {
        logger.error('Error - wishlistSaveRemove', error);
        throw new Error(error)
    }
}

const list = async(data) => {
    try {
        const offset = data.options?.page >1 ? (data.options?.page -1) * (data.options?.limit) : 0;
        const limit = data.options?.limit || 100;
        if (data?.query?.search) {
            let queryData = await getFilterQuery(data.query)
            Object.assign(data.query, queryData)
          }
          delete data.query?.search
          delete data.query?.searchColumns
        let aggregateArray = []
        aggregateArray.push(
            {
                $match:{
                    deletedAt: { $exists: false },
                    userId: ObjectId(data?.userId),
                    type: TYPE.SAVE,
                    ...data.query
                }
            },
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
                                deletedAt: {
                                    $exists: false
                                },
                                isActive: true
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
                                            ...commonProjection
                                        }
                                    }
                                ],
                                as: "imgId"
                            }
                        },
                        { $unwind: { path: "$imgId", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: "$levelId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$id"]
                                            },
                                            deletedAt: { $exists: false },
                                            isActive: true
                                        }
                                    },
                                    {
                                        $project: {
                                            code: 1,
                                            name: 1,
                                            names: 1,
                                            seq: 1,
                                            parentId: 1,
                                            parentCode: 1
                                        }
                                    }
                                ],
                                as: "levelId"
                            }
                        }, { $unwind: { path: "$levelId", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: "$badgeId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$id"]
                                            },
                                            deletedAt: { $exists: false },
                                            isActive: true
                                        }
                                    },
                                    {
                                        $project: {
                                            code: 1,
                                            name: 1,
                                            names: 1,
                                            seq: 1,
                                            parentId: 1,
                                            parentCode: 1
                                        }
                                    }
                                ],
                                as: "badgeId"
                            }
                        }, { $unwind: { path: "$badgeId", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: "$lang" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$id"]
                                            },
                                            deletedAt: { $exists: false },
                                            isActive: true
                                        }
                                    },
                                    {
                                        $project: {
                                            code: 1,
                                            name: 1,
                                            names: 1,
                                            seq: 1,
                                            parentId: 1,
                                            parentCode: 1
                                        }
                                    }
                                ],
                                as: "lang"
                            }
                        }, { $unwind: { path: "$lang", preserveNullAndEmptyArrays: true } },
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
                        //               if: {$ne:[{$size:"$reviews"}, 0]},
                        //               then: { $round : [{$divide: [{ $sum: "$reviews.stars" }, { $size: "$reviews" }]}, 1] },
                        //               else: 0
                        //             }
                        //           },
                        //         totalReviews: { $size: "$reviews"}
                        //     }
                        // },
                        // {
                        //     $project: {
                        //         reviews: 0
                        //     }
                        // }
                    ],
                    as: 'courseId'
                }
            }, {$unwind: {path: '$courseId', preserveNullAndEmptyArrays: true}},
            {
                $match: {
                    courseId: {$exists: true}
                }
            },
            {
                $sort: data.options?.sort ? data.options?.sort : { createdAt : -1 }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    docs: [{ $skip: offset }, { $limit: limit }],
                },
            }
        )
        const list = await Wishlist.aggregate(aggregateArray)
        const result = convertPaginationResult(list, { offset, limit })
        return result;
    } catch (error) {
        logger.error('Error - wishlistList', error)
        throw new Error(error)
    }
}

const courseViewed = async (data) => {
    try {
      const findData = await Wishlist.find({
        type: data.type,
        courseId: data.courseId,
        userId: data.userId,
        deletedAt:{$exists: false}
      });
      if (findData.length) {
        const lastViewed = await Wishlist.findOne({ type: data.type, courseId: data.courseId, userId: data.userId, deletedAt:{$exists: false}}).sort({ createdAt: -1 })
        const diff = moment().diff( lastViewed.createdAt, "hours" );
        if (diff > parseInt(process.env.VIEWED_TIME_HOURS)) {
          await Wishlist.create(data);
        }
      } else {
        await Wishlist.create(data);
      }
    } catch (error) {
      logger.error("Error - courseViewed", error);
      throw new Error(error);
    }
  };

module.exports = {
    saveCourse,
    list,
    courseViewed
};