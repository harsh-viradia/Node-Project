const sectionService = require('../services/sectionService')

const createSection = catchAsync(async(req, res) => {
    const result = await sectionService.addSection(req.body)
    res.message = _localize("module.add", req, "Section");
    return utils.successResponse(result, res)
})

const updateSection = catchAsync(async(req, res) => {
    const result = await sectionService.updateSection(req.params.id, req.body)
    res.message = _localize("module.update", req, "Section");
    return utils.successResponse(result, res)
})

const deleteSection = catchAsync(async(req, res) => {
    const result = await sectionService.deleteSection(req.body.ids)
    res.message = _localize("module.delete", req, "Section");
    return utils.successResponse({}, res)
})

const updateSequence = catchAsync(async(req, res) => {
    const result = await sectionService.updateSequence(req.params.id, req.body)
    res.message = _localize("module.updateSequence", req);
    return utils.successResponse({}, res)
})

const listSections = catchAsync(async (req, res) => {
    const result = await sectionService.getList(req.body);
    res.message = _localize("module.list", req, "sections");
    return utils.successResponse(result, res);
})

module.exports = {
    createSection,
    updateSection,
    deleteSection,
    updateSequence,
    listSections
}