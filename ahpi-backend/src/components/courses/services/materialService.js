const { draftMaterials, publishMaterials } = require('../materialsModel')
const { draftQuestions, publishQuestions } = require("../questionsModel");
const dbService = require('../../../services/db.service')

const addMaterial = async(data) => {
    try {
        const result = await draftMaterials.create(data)
        return result
    } catch (error) {
        logger.error('Error - addMaterial', error)
        throw new Error(error)
    } 
}

const updateMaterial = async(id, data) => {
    try {
        const result = await draftMaterials.findOneAndUpdate({_id: id}, data, { new: true })
        return result
    } catch (error) {
        logger.error('Error - updateMaterial', error)
        throw new Error(error)
    } 
}

const deleteMaterial = async(ids) => {
    try {
        await Promise.all(ids.map(async(id)=>{
            const findDoc = await draftMaterials.findOne({_id:id})
            await draftMaterials.updateMany({ seq: { $gt: findDoc?.seq }, courseId: findDoc?.courseId, secId: findDoc?.secId }, { $inc: { seq: -1 } })
        }))
        const result = await dbService.deleteMultipleDocuments(draftMaterials, ids)
        return result
    } catch (error) {
        logger.error('Error - deleteMaterial', error)
        throw new Error(error)
    }
}

const partialUpdate = async(id, data) => {
    try {
        if (data.seq) {
            const modelSeq = await draftMaterials.findOne({_id: id, deletedAt:{$exists: false}})
            if ( modelSeq?.seq > data?.seq) {
                await draftMaterials.updateMany({ $and:[{seq: { $gte: data.seq }}, {seq: { $lt: modelSeq.seq }}], courseId: modelSeq?.courseId, secId: modelSeq?.secId }, { $inc: { seq: 1 } })
            } else {
                await draftMaterials.updateMany({ $and:[{seq: { $gt: modelSeq.seq }}, {seq: { $lte: data.seq }}], courseId: modelSeq?.courseId, secId: modelSeq?.secId }, { $inc: { seq: -1 } })
            }
            const result = await draftMaterials.updateOne({ _id: id }, { $set: { seq: data.seq } })
            return result
        } else {
            const result = await draftMaterials.updateOne({ _id: id }, { $set: { canDownload: data.canDownload } })
            return result
        }
    } catch (error) {
        logger.error('Error - partialUpdateMaterial', error)
        throw new Error(error)
    }
}

const getList = async (data) => {
    try {
        let options = {};
        let query = {};
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort =  data?.options?.sort ? data?.options?.sort : { seq: 1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                deletedAt:{$exists: false}
            };
        }
        const result = await dbService.getAllDocuments(draftMaterials, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - materialsList", error);
        throw new Error(error);
    }
}

module.exports = {
    addMaterial,
    updateMaterial,
    deleteMaterial,
    partialUpdate,
    getList
}