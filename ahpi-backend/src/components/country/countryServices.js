const countryModel = require('./countryModel')
const dbServices = require('../../services/db.service')

const countryListService = async (page, limit, query, countrySort) => {
    try {
        const countryList = await dbServices.getAllDocuments(countryModel, query, {
            ...(page && limit ? { page, limit, sort: countrySort } : {}),
        });
        return countryList
    } catch (error) {
        logger.error("Error - counryList", error);
        throw new Error(error)
    }
}

const createCountryService = async (data) => {
    try {
        if (data.isDefault === true) {
            await countryModel.updateOne({ isDefault: true }, { $set: { isDefault: false } })
        }
        let result = await dbServices.createDocument(countryModel, data)
        const count = await countryModel.countDocuments({})
        await countryModel.updateOne({ _id: result._id }, { $inc: { seq: count } })
        const resp = {
            name: result.name,
            code: result.code,
            ISOCode2: result.ISOCode2,
            ISOCode3: result.ISOCode3,
            _id: result._id,
            seq: result.seq,
            ISDCode: result.ISDCode
        }
        return resp
    } catch (error) {
        logger.error("Error - createCountry", error);
        throw new Error(error)
    }
};

const getCountryService = async (id) => {
    try {
        const result = await dbServices.getSingleDocumentById(countryModel, id, ["name", "code", "seq", "ISOCode2", "ISOCode3", "code", "ISDCode"])
        return result

    } catch (error) {
        logger.error("Error - getCountry", error);
        throw new Error(error)
    }
};

const updateCountryService = async (id, data) => {
    try {
        const result = await countryModel.findOneAndUpdate({ _id: id }, data, { new: true });
        const resp = {
            name: result.name,
            code: result.code,
            ISOCode2: result.ISOCode2,
            ISOCode3: result.ISOCode3,
            _id: result._id,
            seq: result.seq,
            ISDCode: result.ISDCode
        }
        return resp
    } catch (error) {
        logger.error("Error - updateCountry", error);
        throw new Error(error)
    }
}


const softDeleteCountryService = async (ids, bodyData) => {
    try {
        const country = await countryModel.findOne({ _id: { $in: ids } });
        if (country?.canDel == true && country) {
            const result = await countryModel.findOneAndUpdate({ _id: { $in: ids } }, bodyData, { new: true });
            await countryModel.updateMany({ seq: { $gt: country.seq } }, { $inc: { seq: -1 } })
            return { flag: true, data: result };
        }
        return { flag: false, data: country };
    } catch (error) {
        logger.error("Error - deletingCountry", error);
        throw new Error(error);
    }
}

const updateSequenceService = async (id, seq) => {
    try {
        let findDoc = await countryModel.findOne({ _id: id })
        if (findDoc.seq > seq) {
            await countryModel.updateMany({ seq: { $gte: seq, $lt: findDoc.seq } }, { $inc: { seq: 1 } })
        }
        else {
            await countryModel.updateMany({ seq: { $gt: findDoc.seq, $lte: seq } }, { $inc: { seq: -1 } })
        }
        const result = await countryModel.findOneAndUpdate({ _id: id }, { $set: { seq: seq } }, { new: true })

        const resp = {
            name: result.name,
            code: result.code,
            ISOCode2: result.ISOCode2,
            ISOCode3: result.ISOCode3,
            _id: result._id,
            seq: result.seq,
            ISDCode: result.ISDCode
        }
        return resp
    } catch (error) {
        logger.error("Error - updateSequenceCountry", error);
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
            options.sort = data?.options?.sort ? data?.options?.sort : { createdAt: -1 }
        }
        if (data?.query) {
            query = {
                ...data.query,
                deletedAt: { $exists: false }
            };
        }
        const result = await dbServices.getAllDocuments(countryModel, { ...query }, options);
        return result
    } catch (error) {
        logger.error("Error - getCategoryList", error);
        throw new Error(error);
    }
}

module.exports = {
    countryListService,
    createCountryService,
    getCountryService,
    updateCountryService,
    softDeleteCountryService,
    updateSequenceService,
    getList
}