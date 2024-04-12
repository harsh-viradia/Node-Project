const { publishCourses } = require("../../courses/courseModel");
const moment = require("moment-timezone");
const { Master } = require("@knovator/masters-node");
const Settings = require("../../settings/settings.model");
const { BADGE_SETTINGS } = require("../../../configuration/constants/settingConstants");
const { bestRatedCourse } = require("../../review/review.service");
const { hotSellingCourse } = require("../../courses/services/courseService");
const Reviews = require('../../review/review.model');

const updateNewPublishedBadge = async () => {
    try {
        const setting = await Settings.findOne({ code: BADGE_SETTINGS.NEW_PUBLISHED, isActive: true });
        let startDate = moment().subtract(80, 'days');
        let endDate = moment();
        if (setting && setting.details && setting.details.lastXPublishedDays) {
            startDate = moment().subtract(parseInt(setting.details.lastXPublishedDays, 10), 'days');
        }
        const badge = await Master.findOne({ code: BADGE_SETTINGS.NEW_PUBLISHED, parentCode: 'BADGE' });
        await publishCourses.updateMany({ badgeId: badge._id }, { $set: { badgeId: null } });
        await publishCourses.updateMany({
            updatedAt: { $gte: startDate, $lte: endDate }, deletedAt: { $exists: false }
        }, {
            $set: {
                badgeId: badge._id
            }
        });
        logger.info('🔰 New Published Badge updated successfully!');
    } catch (error) {
        logger.error('updateNewPublishedBadge', error);
    }
}
const updateBestRatedBadge = async () => {
    try {
        const badge = await Master.findOne({ code: BADGE_SETTINGS.BEST_RATED, parentCode: 'BADGE' });
        const bestRatedCourses = await bestRatedCourse();
        await publishCourses.updateMany({ badgeId: badge._id }, { $set: { badgeId: null } });
        await publishCourses.updateMany({ _id: { $in: bestRatedCourses } }, { $set: { badgeId: badge._id } });
        logger.info('🔰 Best Rated Badge updated successfully!');
    } catch (error) {
        logger.error('updateBestRatedBadge', error);
    }
}

const updateHotSellingBadge = async () => {
    try {
        const badge = await Master.findOne({ code: 'HOT_SELLING', parentCode: 'BADGE' });
        const hotSellingCourseIds = await hotSellingCourse();
        await publishCourses.updateMany({ badgeId: badge._id }, { $set: { badgeId: null } });
        await publishCourses.updateMany({
            _id: { $in: hotSellingCourseIds },
        }, {
            $set: {
                badgeId: badge._id
            }
        });
        logger.info('🔰 Hot Selling Badge updated successfully!');
    } catch (error) {
        logger.error('updateHotSellingBadge', error);
    }

}
const updateBadge = async () => {
    await updateNewPublishedBadge();
    await updateBestRatedBadge();
    await updateHotSellingBadge();
}

const updateAverageRatings = async() => {
    try {
        const allCourses = await publishCourses.find();
        allCourses.map(async(course) => {
            let allReviews = await Reviews.find({courseId: course._id, isActive: true });
            if(allReviews.length) {
                let updateData = {
                    avgStars: allReviews.filter((review) => review.stars !== 0 ).length ? Math.round((allReviews.reduce((data, item) =>  data + item.stars , 0) / allReviews.filter((review) => review.stars !== 0 ).length) * 10) / 10 : 0,
                    totalReviews: allReviews.length,
                    ratings: {
                        '0Stars': allReviews.filter((review) => review.stars == 0 ).length,
                        '1Stars': allReviews.filter((review) => review.stars == 1 ).length,
                        '2Stars': allReviews.filter((review) => review.stars == 2 ).length,
                        '3Stars': allReviews.filter((review) => review.stars == 3 ).length,
                        '4Stars': allReviews.filter((review) => review.stars == 4 ).length,
                        '5Stars': allReviews.filter((review) => review.stars == 5 ).length
                    }
                }
                await publishCourses.updateOne({ _id: course._id }, {$set: updateData});
                logger.info('⭐ All details of reviews updated successfully in course!');
            } else {
                logger.warn(`😲 No Reviews found for “${course?.title}”!`);
            }
        })
    } catch (error) {
        logger.error('Error - updateAverageRatings', error);
    }
}

module.exports = {
    updateBadge: updateBadge,
    updateAverageRatings
}