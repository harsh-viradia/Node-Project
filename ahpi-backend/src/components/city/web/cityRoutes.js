const express = require("express");
const routes = express.Router();
const cityController = require("./cityController");

routes.post("/get-city-list", cityController.getList)

module.exports = routes;
