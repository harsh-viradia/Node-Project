const Settings = require('./settings.model')

const getPage = async(code) => {
    return await Settings.findOne({code: code})
}

module.exports = {
    getPage
}