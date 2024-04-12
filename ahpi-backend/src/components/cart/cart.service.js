const Cart = require("./cart.model");
const User = require('../user/userModel')
const order = require("../order/order.model")
const { commonProjection } = require('../../configuration/common');
const { ObjectId } = require('mongodb');
const {updateNotificationsList} = require('../notification/notificationService');

const updateCart = async (data) => {
    try {
        return Cart.findOneAndUpdate({
            ...(data?.userId ? { userId: data?.userId } : { deviceToken: data.deviceToken })
        }, {
            $addToSet: {
                courses: data.courses
            },
            userId: data?.userId,
            fcmToken: data?.fcmToken
        }, {
            new: true,
            upsert: true
        }).populate({
            path: "courses",
            populate: {
                path: 'parCategory levelId lang imgId', select: "name names code uri nm"
            }
        });
    } catch (error) {
        logger.error("Error - updateCart", error);
        throw new Error(error)
    }
}

const removeItemFromCart = async (data) => {
    try {
        return Cart.findOneAndUpdate({
            ...(data?.userId ? { userId: data?.userId } : { deviceToken: data.deviceToken })
        }, {
            $pull: {
                courses: data?.courseId
            },
            userId: data?.userId,
            fcmToken: data?.fcmToken
        }, {
            new: true
        }).populate({
            path: "courses",
            populate: {
                path: 'parCategory levelId lang imgId', select: "name names code uri nm"
            }
        });
    } catch (error) {
        logger.error("Error - updateCart", error);
        throw new Error(error)
    }
}

const getCart = async ({deviceToken, userId}) => {
    try {
        let cartData = await Cart.aggregate([
            ...cartCoursesAggregation({deviceToken, userId}),
            {
                $lookup: {
                    from: 'publishCourses',
                    let: { course: '$courses' },
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
                                        },
                                    },
                                    {
                                        $project: {
                                            name: 1,
                                            slug: 1
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
                                            ...commonProjection
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
                        {
                            $project: {
                                title: 1,
                                slug: 1,
                                "imgId.uri": 1,
                                "imgId.nm": 1,
                                avgStars: 1,
                                totalReviews: 1,
                                price: 1,
                                totalLessons: 1,
                                parCategory: 1,
                                category: 1,
                                rewardPoints:1
                                // ratings: 1
                            }
                        }
                    ],
                    as: 'courses'
                }
            }
        ])
        return cartData;
    } catch (error) {
        logger.error("Error - getCart", error);
        throw new Error(error)
    }
}

const cartCoursesAggregation = ({deviceToken, userId}) => {
    return [
        {
            $match: {
                ...(userId ? { userId: ObjectId(userId) } : { deviceToken: deviceToken })
            }
        },
        {
            $group: {
                _id: userId ? "$userId" : "$deviceToken",
                courses: { $addToSet: "$courses" },
                coupon: {$first: "$coupon"}
            }
        },
        {
            $project: {
                _id: 1,
                courses: {
                    "$reduce": {
                        "input": "$courses",
                        "initialValue": [],
                        "in": { "$setUnion": ["$$value", "$$this"] }
                    }
                },
                coupon: 1
            }
        }
    ]
}

const cartCount = async({deviceToken, userId}) => {
    if(userId) {
        await updateCartAndUser(deviceToken, userId);
    }
    if(deviceToken || userId) {
        const result = await Cart.aggregate([
            ...cartCoursesAggregation({deviceToken, userId}),
            {
                "$lookup": {
                    "from": "publishCourses",
                    "let": {
                        "course": "$courses"
                    },
                    "pipeline": [
                        {
                            "$match": {
                                "$expr": {
                                    "$in": [
                                        "$_id",
                                        "$$course"
                                    ]
                                },
                                "deletedAt": {
                                    "$exists": false
                                },
                                "isActive": true
                            }
                        }
                    ],
                    "as": "courses"
                }
            }
        ]);
        return _.first(result)?.courses?.length ?? 0;
    }
    return 0;
}

const updateCartAndUser = async(deviceToken, userId) => {
    // new Promise(async(resolve, reject) => {
        try {
            let usrOrder
                await User.findOneAndUpdate({_id: userId, deviceToken: {$nin: deviceToken} }, { $addToSet: { deviceToken: deviceToken } }, { new: true });
                await Cart.findOne({deviceToken: deviceToken, userId: {$exists: false}, deviceToken: {$exists: true}}).then(async(resp) => {
                    usrOrder = await order.findOne({ "user.id" : userId, "courses.courseId" : { $in : resp?.courses }, sts : 1 })
                    if(usrOrder) {
                        await Cart.deleteOne({_id: resp?._id});
                    }else {
                        await Cart.findOneAndUpdate({ userId: userId }, { $unset: {"deviceToken": 1 }, $addToSet: {courses: resp?.courses}}, { new: true, upsert: true }).then(async() => {
                            await Cart.deleteOne({_id: resp?._id});
                        });
                    }
            }).then(await updateNotificationsList(deviceToken, userId));
            // resolve();
        } catch(error) {
            logger.error("Error - updateCartAndUser",error);
        }
    // })
        
}

module.exports = {
    getCart: getCart,
    updateCart: updateCart,
    removeItemFromCart: removeItemFromCart,
    cartCount,
    updateCartAndUser
};
