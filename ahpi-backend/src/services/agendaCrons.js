const agenda = require("../configuration/agenda");
const { CRON_JOB_NAME } = require('../configuration/constants/cronConstants');
const { updateBadge, updateAverageRatings } = require("../components/cron-jobs/crons/badge.cron");
const moment = require('moment');

/**
 * Badge cron runs at every day at 12:00 AM
 */
agenda.define(
    CRON_JOB_NAME.BADGE_RUN,
    {
        concurrency: 1,
        priority: 20
    },
    async () => {
        logger.info(`Badge agenda scheduler runs at ${moment().tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss")}`);
        updateBadge().catch(err => {
            logger.error("Error - updateBadge Cron", err);
        })
    }
);

// Update average ratings in courses cron runs at every 12:45 AM. 
agenda.define(
    CRON_JOB_NAME.UPDATE_RATINGS,
    {
        concurrency: 1,
        priority: 20
    },
    async () => {
        logger.info(`${CRON_JOB_NAME.UPDATE_RATINGS} cron runs at ${moment().tz(process.env.TZ).format("YYYY-MM-DD HH:mm:ss")}`);
        updateAverageRatings().catch(error => logger.error('Error - updateAverageRatings Cron', error))
    }
);


// common function for cron.
async function runCrons() {
    await agenda.start();
    await agenda.every("0 0 * * *", CRON_JOB_NAME.BADGE_RUN);
    await agenda.every("45 0 * * *", CRON_JOB_NAME.UPDATE_RATINGS);
}

module.exports = {
    runCrons
}