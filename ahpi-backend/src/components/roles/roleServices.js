const Role = require("./roleModel");
const dbService = require("../../services/db.service");

const roleCreate = async (data) => {
  try {
    const findRole = await Role.findOne().sort({ weight: -1 });
    data.weight = findRole?.weight + 1;
    let checkCode = await Role.findOne({
      code: data.code
    });
    if (checkCode) {
      return { flag: false, data: "module.alreadyExists" };
    }
    const result = await Role.create(data);
    return {flag: true, data: result}
  } catch (error) {
    logger.error("Error - createRole", error);
    throw new Error(error);
  }
};

const roleList = async (req) => {
  try {
      let options = {};
      let query = {};
      if (req.body?.options) {
          options = {
              ...req.body.options,
              sort : req.body?.options?.sort ? req.body?.options?.sort : { createdAt: -1 }
          };
      }
      if (req.body?.query) {
          query = {
              ...req.body.query,
              deletedAt: { $exists: false }
          };
      }
      const result = await dbService.getAllDocuments(Role, { ...query }, options);
      return result
  } catch (error) {
      logger.error("Error - roleList", error);
      throw new Error(error);
  }
}

const roleUpdate = async (data, id) => {
  try {
    let checkCode = await Role.findOne({
      _id: { $ne: id },
      code: data.code,
    });
    if (checkCode) {
      return { flag: false, data: "module.alreadyExists" };
    }
    const result = await Role.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    return { flag: true, data: result };
  } catch (error) {
    logger.error("Error - updateRole", error);
    throw new Error(error);
  }
};

const roleDelete = async (ids) => {
  try {
    const data = {
      deletedAt: await convertToTz({ tz: process.env.TZ, date: new Date() }),
      isActive: false
    };
    await Promise.all(ids.map(async(id)=>{
      const findDoc = await Role.findOne({_id:id})
      await Role.updateMany({ weight: { $gt: findDoc?.weight } }, { $inc: { weight: -1 } })
    }))
    const result = await dbService.bulkUpdate(
      Role,
      { _id: { $in: ids }},
      data
    );
    return result;
  } catch (error) {
    logger.error("Error - deleteRole", error);
    throw new Error(error);
  }
};

module.exports = {
  roleCreate,
  roleList,
  roleUpdate,
  roleDelete,
};
