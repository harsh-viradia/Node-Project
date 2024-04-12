const dbServices = require("./../../services/db.service")
const zipModel = require("./zipModel")

//zip code exist.
const isExists = async ({ id, data }) => {
    return await zipModel.findOne({ zipcode: data?.zipcode, _id: { $ne: id }, deletedAt: { $exists: false } })
}

//create zipcode service.
const create = async (data) => {
    try{
        if(await isExists({data})){
            return { flag : false, data : "module.alreadyExists"}
        }
        const createDoc = await dbServices.createDocument(zipModel, data);
        return { flag : true, data : createDoc}
    } catch (error) {
        logger.error("Error - create zipCode", error)
        throw new Error(error);
    }
}

//update zipcode service
const update = async (id, data) => {
    try{
        if(await isExists({id, data})){
            return { flag : false, data : "module.alreadyExists" }
        }
        const updateDoc = await zipModel.findOneAndUpdate({ _id : id }, data, { new : true });
        return { flag : true, data : updateDoc }
    } catch (error) {
        logger.error("Error - update zipCode", error);
        throw new Error(error)
    }
}

//partial-update/ active-deactive zipcode service
const partialUpdate = async(id, data) => {
    try{
        await zipModel.findOneAndUpdate({ _id : id }, data, { new : true });
        return {}
    } catch (error) {
        logger.error("Error - partialUpdate zipCode ", error);
        throw new Error(error)
    }
}

//soft-delete zipCode ervice
const softDelete = (async (ids, data) => {
    try{
        const Data = {
            isActive : false,
            ...data
        }
        await dbServices.bulkUpdate(zipModel, { _id : { $in : ids } }, Data )
        return {};
    } catch (error){
        logger.error("Error - softDelete zipCode", error);
        throw new Error(error);
    }
});

//get All searched zipcode data services
const getSearchedData =  (async (data) => {
    try {
        let options = {};
        let query = {};
        
        if(data?.options){
            options = {
                ...data?.options,
                sort : data?.options?.sort ? data?.options?.sort : { createdAt : -1 }
            }
        }
        if(data?.query){
            query = {
                ...data?.query,
                deletedAt: { $exists: false }
            }
        }
        const result = await dbServices.getAllDocuments(zipModel, { ...query }, options)
        return result;
    } catch (error) {
        logger.error("Error - getSearchedList - zipCode", error);
        throw new Error(error);
    }
})

//get single document by id.
const getSingleDoc = async (id) => {
    try{     
        const result = await zipModel.findById(id);
        if(result) {
            return { flag : true, data : result }
        }
        return { flag : false, data : "module.notFound"}

    } catch (error) {
        logger.error("Error - getSearchedList - zipCode", error);
        throw new Error(error);
    }
}

module.exports = {
    create,
    update,
    partialUpdate,
    softDelete,
    getSearchedData,
    getSingleDoc
}