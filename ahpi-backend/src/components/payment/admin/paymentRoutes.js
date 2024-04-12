const express = require('express')
const routes = express.Router()
const paymentController = require("./paymentController");

routes.post("/", authenticate, _checkPermission, paymentController.listTransactions).descriptor("admin.transactions.getAll");
routes.get("/export", paymentController.exportTransactions).descriptor("admin.transactions.export");

module.exports = routes;
