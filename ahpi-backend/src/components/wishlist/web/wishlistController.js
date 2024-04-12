const wishlistService = require('../wishlistService')

const saveCourse = catchAsync(async(req, res) => {
    req.body.userId = req.user._id
    const result = await wishlistService.saveCourse(req.body)
    if (result) {
        res.message = _localize("module.save", req, 'wishlist');
    } else {
        res.message = _localize("module.remove", req, 'wishlist');
    }
    return utils.successResponse({}, res)
})

const list = catchAsync(async(req, res) => {
    req.body.userId = req.user._id
    const result = await wishlistService.list(req.body)
    res.message = _localize("module.list", req, "wishlists");
    return utils.successResponse(result, res);
})

const courseViewed = catchAsync(async(req, res) => {
    req.body.userId = req.user._id
    await wishlistService.courseViewed(req.body)
    res.message = _localize("module.viewed", req, "course");
    return utils.successResponse({}, res)
})

module.exports = {
    saveCourse,
    list,
    courseViewed
}