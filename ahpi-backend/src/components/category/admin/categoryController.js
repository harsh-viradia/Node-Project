const { CASHING_KEY_NAME } = require("../../../configuration/constants/cacheConstants");
const { setExpireTime } = require("../../../services/redis.service");
const categotyService = require("../categoryService");

//add category
const add = catchAsync(async (req, res) => {
    const data = {
        ...req.body
    }

    const result = await categotyService.create(data);
    if (result.flag) {
        //  clear category data from redis for add new category
        await setExpireTime(req.headers[CASHING_KEY_NAME],0)
        res.message = _localize("module.create", req, "Category");
        return utils.successResponse(result.data, res);
    }
    message = _localize("module.alreadyExists", req, "Category");
    return utils.failureResponse(message, res);
});

//update category.
const update = catchAsync(async (req, res) => {
    const data = {
        ...req.body
    }
    const updateCategory = await categotyService.update(req.params.id, data);

    if (updateCategory.flag) {
        res.message = _localize("module.update", req, "Category");
         //  clear category data from redis for update
         await setExpireTime(req.headers[CASHING_KEY_NAME],0)
        return utils.successResponse(updateCategory.data, res);
    } else{
        message = _localize("module.alreadyExists", req, "Category");
        return utils.failureResponse(message, res);
    }
});

//partial update.
const partialUpdate = catchAsync ( async (req, res) => {
    await categotyService.partialUpdate(req.params.id, req.body);
    //  clear category data from redis for update
    await setExpireTime(req.headers[CASHING_KEY_NAME],0)
    if (req.body?.isActive) {
        res.message = _localize("module.activate", req, "Category");
      } else {
        res.message = _localize("module.deactivate", req, "Category");
      }
    return utils.successResponse({}, res);
});

//get List controller.
const getList = catchAsync(async (req, res) => {
    req.body.user = req.user
    const result = await categotyService.getList(req.body);
    res.message = _localize("module.list", req, "categories");
    return utils.successResponse(result, res);
});

//delete category.
const deleteCategoryController = catchAsync(async (req, res) => {
    const result = await categotyService.softDeleteCategory(req.body.ids, req.body);
    if (result.flag) {
        //  clear category data from redis for update
        await setExpireTime(req.headers[CASHING_KEY_NAME],0)
        res.message = _localize("module.delete", req, "Category");
        return utils.successResponse(result.data, res);
    }
    message = _localize("validations.deleteError", req, {"{module}": `category`, "{reason}": "it is selected as parent"});
    return utils.failureResponse(message, res); 
});

module.exports = {
    add,
    update,
    deleteCategoryController,
    getList,
    partialUpdate
};