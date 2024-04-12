const { draftQuestions, publishQuestions } = require("../questionsModel");
const dbService = require("../../../services/db.service");

const addQuestions = async (data) => {
  try {
    const result = await draftQuestions.create(data);
    return result;
  } catch (error) {
    logger.error("Error - addQuestions", error);
    throw new Error(error);
  }
};

const updateQuestions = async (id, data) => {
  try {
    const result = await draftQuestions.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return result;
  } catch (error) {
    logger.error("Error - updateQuestions", error);
    throw new Error(error);
  }
};

const deleteQuestions = async (ids) => {
  try {
    await Promise.all(
      ids.map(async (id) => {
        const findDoc = await draftQuestions.findOne({ _id: id });
        await draftQuestions.updateMany(
          { seq: { $gt: findDoc?.seq }, courseId: findDoc?.courseId, secId: findDoc?.secId },
          { $inc: { seq: -1 } }
        );
      })
    );
    const result = await dbService.deleteMultipleDocuments(draftQuestions, ids);
    return result;
  } catch (error) {
    logger.error("Error - deleteQuestions", error);
    throw new Error(error);
  }
};

const updateSequence = async (id, data) => {
  try {
    const modelSeq = await draftQuestions.findOne({
      _id: id,
      deletedAt: { $exists: false },
    });
    let updateSet 
    if (modelSeq?.seq > data?.seq) {
      await draftQuestions.updateMany(
        { $and:[{seq: { $gte: data.seq }}, {seq: { $lt: modelSeq.seq }}], courseId: modelSeq?.courseId, secId: modelSeq?.secId },
        { $inc: { seq: 1 } }
        );
    } else {
      await draftQuestions.updateMany(
        { $and:[{seq: { $gt: modelSeq.seq }}, {seq: { $lte: data.seq }}], courseId: modelSeq?.courseId, secId: modelSeq?.secId },
        { $inc: { seq: -1 } }
        );
      }
    const result = await draftQuestions.updateOne(
      { _id: id },
      { $set: { seq: data.seq } }
    );

    return result;
  } catch (error) {
    logger.error("Error - updateSequenceQuestions", error);
    throw new Error(error);
  }
};

const getList = async (data) => {
  try {
    let options = {};
    let query = {};
    if (data?.options) {
      options = {
        ...data.options,
      };
      options.sort = data?.options?.sort ? data?.options?.sort : { seq: 1 };
    }
    if (data?.query) {
      query = {
        ...data.query,
        deletedAt: { $exists: false },
      };
    }
    const result = await dbService.getAllDocuments(
      draftQuestions,
      { ...query },
      options
    );
    return result;
  } catch (error) {
    logger.error("Error - courseQuestionList", error);
    throw new Error(error);
  }
};

module.exports = {
  addQuestions,
  updateQuestions,
  deleteQuestions,
  updateSequence,
  getList,
};
