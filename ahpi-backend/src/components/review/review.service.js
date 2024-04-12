const Review = require("./review.model");
const dbService = require("../../services/db.service");
const Settings = require("../settings/settings.model");
const {BADGE_SETTINGS} = require("../../configuration/constants/settingConstants");
const MyLearning = require('../purchased-progress/myLearning/myLearning.model');
const { PROGRESS_STS } = require('../../configuration/constants/courseConstant')

const create = async (req) => {
    try {
        let data = req.body;
        let isCoursePurchased = await MyLearning.findOne({userId: data?.userId, courseId: data?.courseId, sts: PROGRESS_STS.COMPLETED});
        if(!isCoursePurchased) {
            return {flag: false, data: _localize("module.cannotGive", req, {'{reason}':_localize("reasonsFor.notCompletedCourse", req)})};
        }
        let reviewExists = await Review.findOne({courseId: data?.courseId, userId: data?.userId});
        if(reviewExists) {
            return {flag: false, data: _localize("module.alreadyGiven", req, "response")}
        }
        return {flag: true, data: await dbService.createDocument(Review, data)}
    } catch (error) {
        logger.error("Error - createReviewError", error);
        throw new Error(error);
    }
};

const getReviewList = async (data, user) => {
    try {
        let options = {};
        let query = {};
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort = data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                ...data.filter,
                deletedAt: { $exists: false }
            };
        }
        const result = await dbService.getAllDocuments(Review, { ...query }, options);
        const userReview = await Review.find({userId: user?.id, courseId: data.query?.courseId})
        return {...result,userReview:userReview}
    } catch (error) {
        logger.error("Error - reviewList", error);
        throw new Error(error);
    }
};

const updateActiveStatus = async (id, data) => {
    try {
        const result = await Review.findByIdAndUpdate({ _id: id }, data, {
            new: true,
        });
        return result;
    } catch (error) {
        logger.error("Error - activityStatusreview", error);
        throw new Error(error);
    }
};

const bestRatedCourse = async () => {
    try {
        const setting = await Settings.findOne({code: BADGE_SETTINGS.BEST_RATED, isActive: true});
        const result = await Review.aggregate([
            {
                $match: {
                    deletedAt: {$exists: false}
                }
            },
            {
                '$group': {
                    '_id': '$courseId',
                    'totalReview': {
                        '$sum': 1
                    },
                    'average': {
                        '$avg': '$stars'
                    }
                }
            }, {
                '$match': {
                    'totalReview': {
                        '$gte': parseInt(setting?.details?.minimumReviews, 10) || 5
                    },
                    'average': {
                        '$gte': parseInt(setting?.details?.minimumRating, 10) || 4
                    }
                }
            }, {
                '$group': {
                    '_id': null,
                    'bestRatedCourse': {
                        '$push': '$_id'
                    }
                }
            }
        ]);
        if(result && result.length > 0) {
            return result[0].bestRatedCourse;
        }
        return [];
    } catch (error) {
        logger.error("Error - bestRatedCourse", error);
        throw new Error(error);
    }
}

module.exports = {
    create,
    getReviewList,
    updateActiveStatus,
    bestRatedCourse: bestRatedCourse
};
