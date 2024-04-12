const router = require("express").Router()
const validation = require("./validation")
const authenticationController = require("./authenticationController")

router.post("/register", validate(validation.register), authenticationController.registerUser)
router.post("/validate", authenticationController.validateOtp)
router.post("/login", hasAccess, validate(validation.login), authenticationController.login)
router.put("/change-password", authenticate, authenticationController.changePassword)
router.post("/logout", authenticate, authenticationController.logout)
router.put("/get-otp", hasAccess, authenticationController.generateOtp)
router.put("/update-password", authenticationController.updateForgotPass)

module.exports = router