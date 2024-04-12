const express = require("express");
const routes = express.Router();

const progressController = require("./progressController");
const validator = require("../validation")

routes.put("/update", authenticate, _checkPermission, validate(validator.update),  progressController.updateProgress)

module.exports = routes;