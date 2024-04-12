const admin = require("firebase-admin");
const Settings = require('../components/settings/settings.model');
const { FIREBASE_PRIVATE_KEY } = require('./constants/settingConstants'); 

new Promise((resolve, reject) => {
    try {
        const firebaseData = Settings.findOne({code: FIREBASE_PRIVATE_KEY });
        resolve(firebaseData)
    } catch(error) {
        reject(error)
    }
}).then(firebaseData => {
    if(!firebaseData?.details || !Object.keys(firebaseData?.details).length) {
        logger.error('Not found Firebase private key object in DB.');
        process.exit(0);
    }
    admin.initializeApp({
        credential: admin.credential.cert(firebaseData?.details)
    });
    logger.info('Firebase Notification Initialized!🔥');
});