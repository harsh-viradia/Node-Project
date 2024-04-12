const Address = require('./addressModel')
const dbService = require('../../services/db.service')

const addAddress = async (data) => {
    try {
        return await Address.create(data)
    } catch (error) {
        logger.error("Error - addAddress", error)
        throw new Error(error)
    }
}

const updateAddress = async (data, id) => {
    try {
        return await Address.findOneAndUpdate({ _id: id }, data, { new: true })
    } catch (error) {
        logger.error("Error - updateAddress", error)
        throw new Error(error)
    }
}

const getAddress = async (data,query) => {
    try {
        const findData = query.status ? {userId: data.id, isDefault: true } : { _id: data.id }
        return await Address.findOne({ ...findData })
    } catch (error) {
        logger.error("Error - getAddress", error)
        throw new Error(error)
    }
}

const deleteAddress = async (data) => {
    try {
        return await Promise.all(_.map(data?.ids, async (id) => {
            const result = await Address.findOne({ _id: id })
            if (result?.isDefault == false) {
                await Address.findOneAndUpdate({ _id: id}, data, {new: true})
                return true
            }
            return false;
        }))
    } catch (error) {
        logger.error("Error - deleteAddress", error)
        throw new Error(error)
    }
}

const partialUpdateAddress = async (data, id) => {
    try {
        if(data?.isDefault) {
            await Address.updateOne({ userId: data.userId, isDefault: true }, { isDefault: false })
            data.canDel = false;
            return await Address.findOneAndUpdate({ _id: id }, data, { new: true })
        }
    } catch (error) {
        logger.error("Error - partialUpdateAddress", error)
        throw new Error(error)
    }
}

const addressList = async (data) => {
    try {
        let options = {};
        let query = {};
        if (data?.options) {
            options = {
                ...data.options,
            };
            options.sort = data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                deletedAt: { $exists: false }
            };
        }
        const result = await dbService.getAllDocuments(Address, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - addressList", error);
        throw new Error(error);
    }
}

module.exports = {
    addAddress,
    updateAddress,
    getAddress,
    deleteAddress,
    partialUpdateAddress,
    addressList
}