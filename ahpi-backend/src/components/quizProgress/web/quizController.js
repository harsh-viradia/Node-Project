const quizServices = require('../quizService')

const startQuiz = catchAsync(async(req, res) => {
    req.body.userId = req.user._id;
    const result = await quizServices.startQuiz(req.body)
    if(result.flag) {
        res.message = _localize("module.startTest", req, "quiz");
        return utils.successResponse(result.data, res);
    }
    message = _localize(result.data, req, result.module);
    return utils.failureResponse(message, res);
})

const saveQuestionAnswer = catchAsync(async(req, res) => {
    req.body.userId = req.user._id;
    const result = await quizServices.saveQuestionAnswer(req.body)
    if(result.flag) {
        res.message = _localize("specificMsg.answered", req);
        return utils.successResponse(result.data, res);
    }
    message = _localize(result.data, req, result.module);
    return utils.failureResponse(message, res);

})

const submitQuiz = catchAsync(async(req, res) => {
    req.body.userId = req.user._id;
    const result = await quizServices.submitQuiz(req.body)
    if(result) {
        res.message = _localize("module.submitTest", req, "quiz");
        return utils.successResponse(result.data, res);
    }
})

module.exports = {
    startQuiz,
    saveQuestionAnswer,
    submitQuiz
}