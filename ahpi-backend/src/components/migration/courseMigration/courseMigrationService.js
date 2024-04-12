const { publishCourses } = require("../../courses/courseModel")
const certificateModel = require("../../certificates/certificate.model")

const addCertificateId = async() => {
    const defaultCertificate = await certificateModel.findOne({ isDefault : true })
    const courseList= await publishCourses.find({})
    _.map(courseList, async course => {
        await publishCourses.findOneAndUpdate({ _id: course?._id }, { $set : { "certificateId": defaultCertificate?._id } })
    })
}

module.exports = {
    addCertificateId
}