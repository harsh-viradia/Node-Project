const { Novu } = require('@novu/node');
const novu = new Novu(process.env.NOVU_API_KEY, { backendUrl: process.env.NOVU_BACKEND_URL });

const addSubscriber = async(user) => {
    try {
        await novu.subscribers.identify(user.id, {
            email: user?.email,
            phone: user?.mobNo,
            firstName: user?.firstName,
            lastName: user?.lastName
        })
    } catch (error) {
        logger.error('Error - addSubscriber', error)
    }
}

const updateSubscriber = async(user) => {
    try{
        await novu.subscribers.update(user.id, {
            email: user?.email,
            phone: user?.mobNo,
            firstName: user?.firstName,
            lastName: user?.lastName,
            avatar: user?.profileId?.uri
        })
    } catch(error) {
        logger.error('Error - updateSubscriber', error)
    }
}

const sendMail = async(emailData) => {
    try{
        const result  = await novu.trigger(emailData?.eventName, {
            to: {
                subscriberId : emailData?.user?._id ?? emailData?.user?.id,
                email: emailData?.user?.email,
                firstName: emailData?.user?.firstName,
                lastName: emailData?.user?.lastName
            },
            payload: emailData?.payload
        })
        return result;
    } catch(error) {
        logger.error('Error - sendMail', error);
    } 
}

module.exports = {
    addSubscriber,
    updateSubscriber,
    sendMail
}