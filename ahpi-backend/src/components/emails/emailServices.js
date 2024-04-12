const { createJobQueue } = require('../../services/bull-jobs/createJobs');
const { JOB_NAME } = require('../../configuration/constants/queueConstant');

const emailFunction = async(eventName, user, payload) => {
    const emailObj = {
        eventName: eventName,
        user: user,
        payload: payload
    }
    await createJobQueue(JOB_NAME.SENDMAIL, emailObj); // 3rd params is optional and it is options for job.
}

module.exports = {
    emailFunction
}