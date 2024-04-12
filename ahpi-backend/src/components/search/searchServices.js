const Search = require('./searchModel')
const User = require('../user/userModel')

const createSearch = async(deviceToken, data) => {
    try {
        data.deviceToken = deviceToken
        if(data?.userId) {
            await User.findOneAndUpdate({_id: data.userId }, { $addToSet: { deviceToken: deviceToken } }, { new: true })
        }
        const result = await Search.create(data)
        return result;
    } catch (error) {
        logger.error('Error - createSearch', error);
        throw new Error(error)
    }
}

const updateSearch = async(deviceToken, data, id) => {
    try {
        data.deviceToken = deviceToken
        if(data?.userId) {
            await User.findOneAndUpdate({_id: data.userId }, { $addToSet: { deviceToken: deviceToken } }, { new: true })
        }
        const result = await Search.findOneAndUpdate({_id: id }, data, {new: true})
        return result;
    } catch (error) {
        logger.error('Error - updateSearch', error);
        throw new Error(error)
    }
}

module.exports = {
    createSearch,
    updateSearch
}