const { sendMail } = require('../novuService');
const { sendNotifications } = require('../sendNotifications');
const { generateCertificate } = require('../../components/purchased-progress/progress/progressServices');
const { refDataUpdate, refDataDelete } = require('../../configuration/common');

const _processors = {
    sendMail: async (processObj) => {
        try {
            console.log('Email processing started!');
            await sendMail(processObj.data);
            console.log('Email processing completed!');
        } catch (error) {
            logger.error('Error - sendMailProcess', error);
        }
    },
    sendNotifications: async (processObj) => {
        try {
            console.log('Notifications processing started!');
            await sendNotifications(processObj.data);
            console.log('Notifications processing completed!');
        } catch (error) {
            logger.error('Error - sendNotificationsProcess', error);
        }
    },
    generateCertificate: async (processObj) => {
        try {
            console.log('Generate certificate processing started!');
            await generateCertificate(processObj.data);
            console.log('Generate certificate processing completed!');
        } catch (error) {
            logger.error('Error - sendNotificationsProcess', error);
        }
    },
    refDataUpdation: async (processObj) => {
        try {
            console.info('refDataUpdation processing started!');
            await refDataUpdate(processObj.data);
            console.info('refDataUpdation processing completed!');
        } catch (error) {
            logger.error('Error - refDataUpdation', error);
        }
    },
    refDataDeletion: async (processObj) => {
        try {
            console.info('refDataDeletion processing started!');
            await refDataDelete(processObj.data);
            console.info('refDataDeletion processing completed!');
        } catch (error) {
            logger.error('Error - refDataDeletion', error);
        }
    }
}


module.exports = {
    _processors
}