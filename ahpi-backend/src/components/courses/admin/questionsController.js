const questionsService = require('../services/questionsService')

const addQuestions = catchAsync(async(req, res) => {
    const result = await questionsService.addQuestions(req.body)
    res.message = _localize("module.add", req, "question");
    return utils.successResponse(result, res)
})

const updateQuestions = catchAsync(async(req, res) => {
    const result = await questionsService.updateQuestions(req.params.id, req.body)
    res.message = _localize("module.update", req, "question");
    return utils.successResponse(result, res)
})

const deleteQuestions = catchAsync(async(req, res) => {
    const result = await questionsService.deleteQuestions(req.body.ids)
    res.message = _localize("module.delete", req, "question");
    return utils.successResponse({}, res)
})

const updateSequence = catchAsync(async(req, res) => {
    const result = await questionsService.updateSequence(req.params.id, req.body)
    res.message = _localize("module.updateSequence", req);
    return utils.successResponse({}, res)
})

const listQuestions = catchAsync(async (req, res) => {
    const result = await questionsService.getList(req.body);
    res.message = _localize("module.list", req, "questions");
    return utils.successResponse(result, res);
})

module.exports = {
    addQuestions,
    updateQuestions,
    deleteQuestions,
    updateSequence,
    listQuestions
}