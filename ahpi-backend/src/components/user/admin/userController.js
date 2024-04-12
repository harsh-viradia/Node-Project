const userServices = require("../services/userServices");

//add User.
const add = catchAsync( async (req, res) => {
    const data = {
        ...req.body
    }
    const result = await userServices.createUser(data);
    if(!result.flag){
        message = _localize(result.data, req);
        return utils.failureResponse(message, res);
    }
    res.message = _localize("module.create", req, 'user');
    return utils.successResponse(result.data, res);
})

//update User
const update = catchAsync( async (req, res) => {

    const result = await userServices.updateUser(req)
    if(!result.flag) {
        message = _localize(result.data, req, 'user');
        return utils.failureResponse(message, res);
    }
    res.message = _localize("module.update", req, 'user');
    return utils.successResponse(result.data, res);
})

//partial update api (upadte User activation).
const partialUpdate = catchAsync(async (req, res) => {
    const result = await userServices.partialUpdate(req.params.id, req.body);
    if(req.body?.isActive){
        res.message = _localize("module.activate", req, 'user');
    } else {
        res.message = _localize("module.deactivate", req, 'user');
    }
    return utils.successResponse({}, res)
});

//get all User data.
const getList = catchAsync( async (req, res ) => {
    const result = await userServices.getList(req.body);

    res.message = _localize("module.list", req, 'Users');
    return utils.successResponse(result, res);
})

//soft delete User.
const softDeleteUser = catchAsync( async ( req, res ) => {
    const result = await userServices.softDeleteUser(req.body.ids);
    res.message = _localize("module.delete", req, 'User');
    return utils.successResponse(result, res);
})

module.exports = {
    add,
    update,
    softDeleteUser,
    getList,
    partialUpdate
};