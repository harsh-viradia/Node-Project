const { Master } = require("@knovator/masters-node");



const updateMaster = async () => {
    const masterDocs = await Master.find();
    

    masterDocs.map(async (masterDoc, index) => {
        await Master.updateOne({ _id: masterDoc?._id }, { $set: { "names": {en:masterDoc?.name,id:masterDoc?.name } } })       
    })
}

module.exports = {
    updateMaster
}