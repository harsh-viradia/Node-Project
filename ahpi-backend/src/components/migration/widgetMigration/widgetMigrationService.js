const Widget = require('../../widget/widgetModel')


const addTitleToWidget = async () => {
    const widgetDocs = await Widget.find({})

    widgetDocs.map(async (widgetDoc, index) => {
        await Widget.updateOne({ _id: widgetDoc?._id }, { $set: { "headingTitleID": widgetDoc?.headingTitle } })

        _.map(widgetDoc?.img, async (img, index2) => {
            await Widget.updateOne({ _id: widgetDoc?._id, "img._id": img?._id }, { $set: { "img.$.titleID": img?.title, "img.$.altID": img?.alt, "img.$.fileIdIndo": img?.fileId } })
        })
    })
}

module.exports = {
    addTitleToWidget
}