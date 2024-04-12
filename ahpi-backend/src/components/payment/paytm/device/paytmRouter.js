const routes = require("express").Router()

const paytmController = require("./paytmController")

routes.post("/generate-trans", authenticate, paytmController.generateTransaction)
routes.post("/complete-transaction", paytmController.completeTransaction)

module.exports = routes