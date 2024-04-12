const userServices = require("../services/userServices");
const role = require("../../roles/roleModel");
const { ROLE } = require('../../../configuration/constants/authConstant')

//add instructor.
const add = catchAsync( async (req, res) => {

    const roles = await role.findOne({ code : ROLE.INSTRUCTOR });

    const data = {
        ...req.body,
        roles : [ { roleId : roles._id } ]
    }
    const result = await userServices.createUser(data);
    if(!result.flag){
        message = _localize(result.data, req, 'instructor');
        return utils.failureResponse(message, res);
    }
    res.message = _localize("module.create", req, 'instructor');
    return utils.successResponse(result.data, res);
})

//update instructor
const update = catchAsync( async (req, res) => {

    const result = await userServices.updateUser(req)
    if(!result.flag) {
        let msg =  _localize("reasonsFor.courseLimit", req)
        message = _localize(result.data, req, msg);
        return utils.failureResponse(message, res);
    }
    res.message = _localize("module.update", req, 'instructor');
    return utils.successResponse(result.data, res, 'instructor');
})

//partial update api (upadte instructor activation).
const partialUpdate = catchAsync(async (req, res) => {
    const result = await userServices.partialUpdate(req.params.id, req.body);
    if(req.body?.isActive){
        res.message = _localize("module.activate", req, 'instructor');
    } else {
        res.message = _localize("module.deactivate", req, 'instructor');
    }
    return utils.successResponse({}, res)
});

//get all instructor data.
const getList = catchAsync( async (req, res ) => {
    const result = await userServices.getList(req.body, true);
    res.message = _localize("module.list", req, 'instructors');
    return utils.successResponse(result, res);
})

//soft delete instructor.
const softInstructorDelete = catchAsync( async ( req, res ) => {
    const result = await userServices.softDeleteUser(req.body.ids);
    res.message = _localize("module.delete", req, 'instructor');
    return utils.successResponse(result, res);
})

module.exports = {
    add,
    update,
    softInstructorDelete,
    getList,
    partialUpdate
};