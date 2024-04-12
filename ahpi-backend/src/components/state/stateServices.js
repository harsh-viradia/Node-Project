const State = require("./stateModel");
const dbService = require("../../services/db.service")
const mongoose = require("mongoose")

const createStateService = async (data) => {
  try {
    if (data?.isDefault) {
      await State.findOneAndUpdate(
        { countryId: data.countryId, isDefault: true },
        { isDefault: false }
      );
    }
    const result = await State.create(data);
    const count = await State.countDocuments({})
    await State.updateOne({ _id: result._id }, { $inc: { seq: count } })
    return result;
  } catch (error) {
    logger.error("Error - creatingState", error);
    throw new Error(error);
  }
};

const updateStateService = async (id, data) => {
  try {
    return await State.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
  } catch (error) {
    logger.error("Error - updatingState", error);
    throw new Error(error);
  }
};

const updateActivityStatusStateService = async (id, data) => {
  try {
    return await State.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
  } catch (error) {
    logger.error("Error - updateActivityStatusState", error);
    throw new Error(error);
  }
};

const deleteStateService = async (ids, bodyData) => {
  try {
    const state = await State.findOne({ _id: { $in: ids } });
    if (state?.canDel == true && state) {
      const result = await State.findOneAndUpdate({ _id: { $in: ids } }, bodyData, { new: true });
      await State.updateMany({ seq: { $gt: state.seq } }, { $inc: { seq: -1 } })
      return { flag: true, data: result };
    }
    return { flag: false, data: state };
  } catch (error) {
    logger.error("Error - deletingCountry", error);
    throw new Error(error);
  }
};

const updateDefaultStatusStateService = async (id, data) => {
  try {
    return await State.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    logger.error("Error - defaultStatusState", error);
    throw new Error(error);
  }
};

const updateSequenceService = async (id, seq) => {
  try {
    let findDoc = await State.findOne({ _id: id })
    if (findDoc?.seq > seq) {
      await State.updateMany({ seq: { $gte: seq, $lt: findDoc?.seq } }, { $inc: { seq: 1 } })
    }
    else {
      await State.updateMany({ seq: { $gt: findDoc?.seq, $lte: seq } }, { $inc: { seq: -1 } })
    }
    const result = await State.updateOne({ _id: id }, { $set: { seq: seq } })
    return result
  } catch (error) {
    logger.error("Error - updateSequenceState", error);
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
    const result = await dbService.getAllDocuments(State, { ...query }, options);
    return result
  } catch (error) {
    logger.error("Error - getCategoryList", error);
    throw new Error(error);
  }
}

module.exports = {
  createStateService,
  updateStateService,
  updateActivityStatusStateService,
  deleteStateService,
  updateDefaultStatusStateService,
  updateSequenceService,
  getList
};
