const express = require("express");
const routes = express.Router();
const zipController = require("./zipController");

routes.post("/", zipController.getSearchedData);
routes.get("/:id", zipController.getsingleDoc);

module.exports = routes;
