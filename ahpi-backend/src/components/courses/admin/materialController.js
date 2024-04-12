const materialService = require('../services/materialService')

const createMaterial = catchAsync(async(req, res) => {
    const result = await materialService.addMaterial(req.body)
    res.message = _localize("module.add", req, "material");
    return utils.successResponse(result, res)
})

const updateMaterial = catchAsync(async(req, res) => {
    const result = await materialService.updateMaterial(req.params.id, req.body)
    res.message = _localize("module.update", req, "material");
    return utils.successResponse(result, res)
})

const deleteMaterial = catchAsync(async(req, res) => {
    const result = await materialService.deleteMaterial(req.body.ids)
    res.message = _localize("module.delete", req, "material");
    return utils.successResponse({}, res)
})

const partialUpdate = catchAsync(async(req, res) => {
    const result = await materialService.partialUpdate(req.params.id, req.body)
    if (req.body?.seq) {
        res.message = _localize("module.updateSequence", req);
    } else if (req.body?.canDownload) {
        res.message = _localize("specificMsg.enable", req);
    } else {
        res.message = _localize("specificMsg.disable", req);
    }
    return utils.successResponse({}, res)
})

const listMaterial = catchAsync(async (req, res) => {
    const result = await materialService.getList(req.body);
    res.message = _localize("module.list", req, "Materials");
    return utils.successResponse(result, res);
})

module.exports = {
    createMaterial,
    updateMaterial,
    deleteMaterial,
    partialUpdate,
    listMaterial
}