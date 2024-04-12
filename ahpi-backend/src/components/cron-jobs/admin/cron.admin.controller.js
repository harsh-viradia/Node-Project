const {updateBadge, updateAverageRatings} = require("../crons/badge.cron");

const badgeCron = catchAsync( (req, res) => {
    updateBadge().then(() => logger.info('Badge cron run successfully!')).catch((error) => logger.error('Error - updateBadge API', error));
    res.message = 'Badge cron run successfully!';
    return utils.successResponse(null, res);
});

const updateReviewsInCourses = catchAsync( (req, res) => {
    updateAverageRatings().then(() => logger.info('Update reviews cron run successfully for courses!')).catch((error) => logger.error('Error - updateAverageRatings API', error));
    res.message = 'Update reviews cron run successfully for courses!';
    return utils.successResponse(null, res);
});

module.exports = {
    badgeCron: badgeCron,
    updateReviewsInCourses
}
