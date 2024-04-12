const dbService = require("../../services/db.service");
const PageModel = require('./pageModel')
const { TYPE } = require('../../configuration/constants/wishlistConstants')
const { ObjectId } = require('mongodb')
const { commonProjection } = require('../../configuration/common')

async function updatePage(id, data) {
    try {
        await dbService.updateDocument(PageModel, id, data)
    } catch (error) {
        logger.error("Error - updatePage", error);
        throw new Error(error)
    }
}

const getPageList = async (data) => {
    try {
        let options = {};
        let query = {};
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort =  data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                deletedAt: {$exists: false}
            };
        }
        const result = await dbService.getAllDocuments(PageModel, { ...query }, options);
        return result
    } catch(error){
        logger.error("Error - getPageList", error);
        throw new Error(error);
    }
  }

const getPage = async(slug, user, deviceToken) => {
    try {
        const result  = await PageModel.aggregate([
            {
                $match: {
                    deletedAt: {
                        $exists: false
                    },
                    slug: slug
                }
            },
            { $unwind: { path: '$widget', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'widgets',
                    let: { widget: "$widget.widgetId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$widget"]
                                },
                                deletedAt: {$exists: false},
                                isActive: true
                            }
                        },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: '$type' },
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
                                        $project: {
                                            name: 1,
                                            names: 1,
                                            code: 1
                                        }
                                    }
                                ],
                                as: 'type'
                            }
                        }, { $unwind: { path: "$type", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: '$secType' },
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
                                        $project: {
                                            name: 1,
                                            names: 1,
                                            code: 1
                                        }
                                    }
                                ],
                                as: 'secType'
                            }
                        }, { $unwind: { path: "$secType", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: 'master',
                                let: { id: '$imgType' },
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
                                        $project: {
                                            name: 1,
                                            names: 1,
                                            code: 1
                                        }
                                    }
                                ],
                                as: 'imgType'
                            }
                        }, { $unwind: { path: "$imgType", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: '$img', preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "file",
                                let: { fileId: "$img.fileId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$fileId"]
                                            },
                                        }
                                    },
                                    {
                                        $project: {
                                            ...commonProjection
                                        }
                                    }
                                ],
                                as: "fileId"
                            }
                        }, { $unwind: { path: "$fileId", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "file",
                                let: { fileId: "$img.fileIdIndo" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$fileId"]
                                            },
                                        }
                                    },
                                    {
                                        $project: {
                                            ...commonProjection
                                        }
                                    }
                                ],
                                as: "fileIdIndo"
                            }
                        }, { $unwind: { path: "$fileIdIndo", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "widgetTabs",
                                let: { id: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$widgetId", "$$id"]
                                            },
                                            deletedAt: { $exists: false },
                                            isActive: true
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'master',
                                            let: { id: '$cardType' },
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
                                                    $project: {
                                                        name: 1,
                                                        names: 1,
                                                        code: 1
                                                    }
                                                }
                                            ],
                                            as: 'cardType'
                                        }
                                    }, { $unwind: { path: "$cardType", preserveNullAndEmptyArrays: true } },
                                    {
                                        $lookup: {
                                            from: 'categories',
                                            let: { category: '$categories' },
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
                                                    $lookup: {
                                                        from: "file",
                                                        let: { fileId: "$image" },
                                                        pipeline: [
                                                            {
                                                                $match: {
                                                                    $expr: {
                                                                        $eq: ["$_id", "$$fileId"]
                                                                    },
                                                                }
                                                            },
                                                            {
                                                                $project: {
                                                                    ...commonProjection
                                                                }
                                                            }
                                                        ],
                                                        as: "image"
                                                    }
                                                }, { $unwind: { path: "$image", preserveNullAndEmptyArrays: true } },
                                            ],
                                            as: 'categories'
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: 'publishCourses',
                                            let: { course: '$course' },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $in: ["$_id", "$$course"]
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
                                                {
                                                    $lookup: {
                                                      from: 'wishlist',
                                                      let : { id: '$_id'},
                                                      pipeline: [
                                                        {
                                                          $match: {
                                                            $expr: {
                                                              $eq: ["$courseId", "$$id"]
                                                            },
                                                            deletedAt: {$exists: false },
                                                            type: TYPE.SAVE,
                                                            userId: ObjectId(user?._id)
                                                          }
                                                        }
                                                      ],
                                                      as: 'wishlist'
                                                    }
                                                  },
                                                  {
                                                    $lookup: {
                                                      from: 'myLearning',
                                                      let : { id: '$_id'},
                                                      pipeline: [
                                                        {
                                                          $match: {
                                                            $expr: {
                                                              $eq: ["$courseId", "$$id"]
                                                            },
                                                            deletedAt: {$exists: false },
                                                            userId: ObjectId(user?._id)
                                                          }
                                                        }
                                                      ],
                                                      as: 'myLearning'
                                                    }
                                                  },
                                                  {
                                                    $lookup: {
                                                      from: 'carts',
                                                      let : { id: '$_id', token: deviceToken, userId: ObjectId(user?._id)},
                                                      pipeline: [
                                                        {
                                                          $match: {
                                                            $expr: {
                                                              $and: [
                                                                  {$in: ["$$id", "$courses"]},
                                                                  user ? {$eq: ["$userId", "$$userId"]} : {$eq: ["$deviceToken", "$$token"]}
                                                              ]
                                                            },
                                                          }
                                                        }
                                                      ],
                                                      as: 'carts'
                                                    }
                                                  },
                                                {
                                                    $addFields: {
                                                        // avgStars: {
                                                        //     $cond: {
                                                        //         if: { $ne: [{ $size: "$reviews" }, 0] },
                                                        //         then: { $round : [{$divide: [{ $sum: "$reviews.stars" }, { $size: "$reviews" }]}, 1] },
                                                        //         else: 0
                                                        //     }
                                                        // },
                                                        isSaved: {
                                                            $cond: {
                                                              if: { $ne: [{ $size: "$wishlist" }, 0] },
                                                              then: true,
                                                              else: false,
                                                            },
                                                          },
                                                          isPurchased: {
                                                            $cond: {
                                                              if: { $ne: [{ $size: "$myLearning" }, 0] },
                                                              then: true,
                                                              else: false,
                                                            },
                                                          },
                                                          inCart: {
                                                            $cond: {
                                                              if: { $ne: [{ $size: {$ifNull: [ "$carts", [] ]} }, 0] },
                                                              then: true,
                                                              else: false,
                                                            },
                                                          },
                                                        // totalReviews: { $size: "$reviews" }
                                                    }
                                                },
                                                {
                                                    $project: {
                                                        // reviews: 0,
                                                        wishlist: 0,
                                                        carts: 0,
                                                        myLearning: 0
                                                    }
                                                }
                                            ],
                                            as: 'course'
                                        }
                                    }
                                ],
                                as: "tabs"
                            }
                        },
                        {
                            $lookup: {
                                from: "reviews",
                                let: { review: "$reviews" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $in: ["$_id", "$$review"]
                                            },
                                        }
                                    },
                                    {
                                        $project: {
                                            ...commonProjection
                                        }
                                    },
                                    {
                                        $lookup:{
                                          from:'user',
                                          let: {id: "$userId"},
                                          pipeline:[
                                            {
                                              $match:{
                                                $expr:{
                                                  $eq:["$_id", "$$id"]
                                                },
                                                deletedAt: {$exists: false},
                                                isActive: true
                                              }
                                            },
                                            {
                                              $lookup: {
                                                  from: "file",
                                                  let: { fileId: "$profileId" },
                                                  pipeline: [
                                                      {
                                                          $match: {
                                                              $expr: {
                                                                  $eq: ["$_id", "$$fileId"]
                                                              },
                                                          }
                                                      },
                                                      {
                                                          $project: {
                                                              ...commonProjection
                                                          }
                                                      }
                                                  ],
                                                  as: "profileId"
                                              }
                                          }, { $unwind: { path: "$profileId", preserveNullAndEmptyArrays: true } },
                                            {
                                              $project:{
                                                roles: 0,
                                                passwords: 0,
                                                deviceToken: 0,
                                                tokens: 0
                                              }
                                            }
                                          ],
                                          as: "userId"
                                        }
                                      },{$unwind: {path:"$userId", preserveNullAndEmptyArrays: true}},
                                ],
                                as: "reviews"
                            }
                        },
                        {
                            $group: {
                                _id: '$_id',
                                tabs: { $first: "$tabs" },
                                name: { $first: "$name" },
                                headingTitle: { $first: "$headingTitle" },
                                headingTitleID: { $first: "$headingTitleID" },
                                code: { $first: '$code' },
                                type: { $first: '$type' },
                                secType: { $first: '$secType' },
                                isMultiTabs: { $first: '$isMultiTabs' },
                                isActive: { $first: '$isActive' },
                                isAutoPlay: { $first: '$isAutoPlay' },
                                imgType: { $first: "$imgType" },
                                img: {
                                    $push: { fileId: "$fileId",fileIdIndo: "$fileIdIndo", alt: "$img.alt",altID: "$img.altID", link: "$img.link", title: "$img.title",titleID: "$img.titleID", _id: "$img._id" }
                                },
                                image: { $first: '$img' },
                                reviews: { $first: '$reviews' },
                                rowPerMobile: { $first: '$rowPerMobile' },
                                rowPerWeb: { $first: '$rowPerWeb' },
                                rowPerTablet: { $first: '$rowPerTablet' },
                            }
                        },
                        {
                            $addFields: {
                                img: {
                                    $cond: [{
                                        $and: [
                                            { $eq: ['$image', null] }
                                        ]
                                    }, [], '$img']
                                },
                            },
                        }, { $unset: "image" },
                        {
                            $sort: {
                                seq: 1
                            }
                        }
                    ],
                    as: "widgetId"
                }
            }, { $unwind: { path: "$widgetId", preserveNullAndEmptyArrays: true } },
            {
                $sort: {
                    "widget.seq": 1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    slug: { $first: "$slug" },
                    widget: { $push: "$widgetId" }
                }
            }
        ])
        return result
    } catch(error) {
        logger.error('Error - getPage', error)
        throw new Error(error)
    }
}

module.exports = {
    updatePage,
    getPageList,
    getPage
}
