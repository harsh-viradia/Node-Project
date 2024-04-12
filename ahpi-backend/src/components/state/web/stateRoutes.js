const express = require("express");
const routes = express.Router();
const stateController = require("./stateController");

routes.post("/get-state-list", stateController.getList)

module.exports = routes;
