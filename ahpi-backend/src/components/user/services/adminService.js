const UserModel = require('../userModel');

const updateProfile = async (data, id) => {
    const findEmail = await UserModel.findOne({email: data?.email, _id: {$ne: id}})
    if (findEmail) {
        return {flag: false}
    }
    const result = await UserModel.findOneAndUpdate({_id: id}, data, {new: true}).select("-passwords -tokens")
    return {flag: true, data: result}
}

module.exports = {
    updateProfile
}
