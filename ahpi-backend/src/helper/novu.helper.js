const { Novu } = require('@novu/node')
const novuInstance = new Novu(process.env.NOVU_API_KEY, {
    backendUrl: process.env.NOVU_BACKEND_URL
});

/**
 *
 * @param userId : string || objectId - userId
 * @param userData : any - user data will contains firstName, lastName, email, phone, avatar, etc
 * @returns {Promise<any>}
 */
const addSubscriber = async (userId, userData) => {
    try {
       return (await novuInstance.subscribers.identify(userId, {
        email: userData.email,
       })).data;
    } catch (error) {
        throw error
    }
}
/**
 *
 * @param eventName : string - Novu event name
 * @param userId : string - subscriberId register in Novu
 * @param payload : any  - payload to send to Novu
 */

const sendEmail = async (eventName, subId, payload) => {
    try {
        // const subId = await addSubscriber(userId._id, userId)
        const finalMail = await novuInstance.trigger(eventName, {
            to: {
                subscriberId: subId
            },
            payload: payload
        });
    } catch (error) {
        throw error
    }
}


module.exports = {
    addSubscriber: addSubscriber,
    sendEmail: sendEmail
}
