const { AHPI_emailQueue, AHPI_notificationQueue, AHPI_generateCertiQueue, AHPI_refUpdateQueue } = require('./jobConfig');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { JOB_NAME } = require('../../configuration/constants/queueConstant')
const basicAuth = require('express-basic-auth');

// create or produce a job.
const createJobQueue = async(jobName, dataObj, opts = {}) => {
    const defaultOpts = { 
        priority: 0, 
        attempts: 3, 
        delay: 2000, 
        removeOnComplete: false,
        removeOnFail: false 
    };
    let QueueName;

    const JOB_TYPES = {
        [JOB_NAME.SEND_NOTIFICATIONS]: AHPI_notificationQueue,
        [JOB_NAME.GENERATE_CERTIFICATE]: AHPI_generateCertiQueue,
        [JOB_NAME.SENDMAIL]: AHPI_emailQueue,
        [JOB_NAME.REF_DATA_UPDATION]: AHPI_refUpdateQueue,
        [JOB_NAME.REF_DATA_DELETION]: AHPI_refUpdateQueue
    }
    QueueName = JOB_TYPES[jobName]
    QueueName.add(jobName, dataObj, Object.keys(opts).length > 0 ? opts : defaultOpts)
}

// queue middleware function.
const queueMiddleware = basicAuth({
    users: {[process.env.BULLADAPTER_USER] : process.env.BULLADAPTER_CRED},
    challenge: true
});

// To check all jobs in bull-board UI.
const myServerAdapter = new ExpressAdapter();
myServerAdapter.setBasePath('/queue');
createBullBoard({queues: [new BullAdapter(AHPI_emailQueue), new BullAdapter(AHPI_notificationQueue), new BullAdapter(AHPI_generateCertiQueue), new BullAdapter(AHPI_refUpdateQueue)], serverAdapter: myServerAdapter })

module.exports = {
    createJobQueue,
    myServerAdapter,
    queueMiddleware
}