const axios = require('axios');
const { google } = require('googleapis');
const Settings = require('../components/settings/settings.model');
const { FIREBASE_PRIVATE_KEY } = require('../configuration/constants/settingConstants');
const Logs = require('../components/common/models/logs');
const { LOG_TYPE, LOG_STATUS } = require('../configuration/constants/logConstant');
const SCOPES = [process.env.FCM_MESSAGING_SCOPE]


const getAccessToken = () => {
    if (!process.env.FCM_MESSAGING_SCOPE) {
        logger.error("Please add firebase messaging scope in your ENV file.");
        process.exit(0);
    }
    return new Promise(async(resolve, reject) => {
        let firebaseData = await Settings.findOne({code: FIREBASE_PRIVATE_KEY });
        const jwtClient = new google.auth.JWT(
            firebaseData?.details?.client_email,
            null,
            firebaseData?.details?.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize((error, tokens) => {
            if(error){
                reject(error)                                                                                                                              
            }
            resolve({acess_token: tokens?.access_token, firbase_private_key: firebaseData});
        });
    });
}

const sendNotifications = async(processObject) => {
    let notificationLogs = {
        type: LOG_TYPE.NOTIFICATIONS,
        sentData: processObject
    };
    const logs = await Logs.create(notificationLogs)
    try {
        if (!process.env.FIREBASE_NOTIFICATION_LINK) {
            logger.error('Please add firebase notification url/link in your ENV file.');
            process.exit(0);
        }
        let { acess_token,firbase_private_key } = await getAccessToken();
        const config = {
            url: process.env.FIREBASE_NOTIFICATION_LINK?.replace(/{{projectId}}/, firbase_private_key?.details?.project_id),
            headers: {
              Authorization: `Bearer ${acess_token}`,
              "Content-Type": "application/json"
            },
            data: processObject,
            method: "POST",
        };
        const resp = await axios(config);
        notificationLogs.status = LOG_STATUS.SENT;
        notificationLogs.response = resp?.data;
        await Logs.findOneAndUpdate({_id: logs?._id}, notificationLogs, {new: true});
    } catch(error) {
        if(error?.response && error?.response?.data) {
            notificationLogs.status = LOG_STATUS.FAILED;
            notificationLogs.response = error?.response?.data;
            await Logs.findOneAndUpdate({_id: logs?._id}, notificationLogs, {new: true});
        };
        logger.error("Error - sendNotifications", error);
    }
};

module.exports = {
    sendNotifications
}