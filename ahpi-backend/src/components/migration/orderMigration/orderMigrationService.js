const order = require("../../order/order.model")

const addPrimaryCateToOrder = async () => {
    const orderDocs = await order.find({}).populate({
        path: "courses.courseId",
        populate: {
            path: "parCategory",
            select: "name"
        }
    })

    orderDocs.map(async (orderDoc) => {
        _.map(orderDoc?.courses, async (course, index) => {
            await order.updateOne({ _id: orderDoc?._id, "course.courseId": course?._id  }, { $set: { "courses.$[].primaryCat": course?.courseId?.parCategory[0]?._id } }, { new : true })
        })
    })
}

module.exports = {
    addPrimaryCateToOrder
}