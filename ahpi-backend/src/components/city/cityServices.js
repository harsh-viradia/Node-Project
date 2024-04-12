const City = require("./cityModel");
const dbServices = require("../../services/db.service")

const createCityService = async (data) => {
  try {
    if (data?.isDefault) {
      await City.findOneAndUpdate(
        { stateId: data.stateId, isDefault: true },
        { isDefault: false }
      );
    }
    const result = await City.create(data);
    const count = await City.countDocuments({})
    await City.updateOne({ _id: result._id }, { $inc: { seq: count } })
    return result;
  } catch (error) {
    logger.error("Error - creatingCity", error);
    throw new Error(error);
  }
};

const updateCityService = async (id, data) => {
  try {
    const result = await City.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    return result;
  } catch (error) {
    logger.error("Error - updatingCity", error);
    throw new Error(error);
  }
};

const updateActivityStatusCityService = async (id, data) => {
  try {
    const result = await City.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    return result;
  } catch (error) {
    logger.error("Error - activityStatusCity", error);
    throw new Error(error);
  }
};

const deleteCityService = async (ids, bodyData) => {
  try {
      const city = await City.findOne({ _id : { $in : ids } });
      if (city?.canDel == true) {
       const result = await City.findOneAndUpdate({ _id : { $in : ids } }, bodyData, { new : true });
        await City.updateMany({seq: {$gt: city.seq}},{ $inc: { seq: -1 } })
        return {flag: true, data:result};
      }
    return {flag: false, data : city};
  } catch (error) {
    logger.error("Error - deletingCity", error);
    throw new Error(error);
  }
};

const updateDefaultStatusCityService = async (id, data) => {
  try {
    const result = await City.findByIdAndUpdate(id, data, { new: true });
    return result;
  } catch (error) {
    logger.error("Error - defaultStatusCity", error);
    throw new Error(error);
  }
};

const updateSequenceService = async (id, seq) => {
  try {
      let findDoc = await City.findOne({ _id: id })
      if (findDoc?.seq > seq) {
          await City.updateMany({ seq: { $gte: seq, $lt: findDoc?.seq }, deletedAt:{$exists: false} }, { $inc: { seq: 1 } })
      }
      else {
          await City.updateMany({ seq: { $gt: findDoc?.seq, $lte: seq }, deletedAt:{$exists: false} }, { $inc: { seq: -1 } })
      }
      const result = await City.updateOne({ _id: id }, { $set: { seq: seq } })
      return result
  } catch (error) {
    logger.error("Error - updateSequenceCity", error);
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
    const result = await dbServices.getAllDocuments(City, { ...query }, options);
    return result
  } catch (error) {
    logger.error("Error - getCategoryList", error);
    throw new Error(error);
  }
}

module.exports = {
  createCityService,
  updateCityService,
  updateActivityStatusCityService,
  deleteCityService,
  updateDefaultStatusCityService,
  updateSequenceService,
  getList
};
