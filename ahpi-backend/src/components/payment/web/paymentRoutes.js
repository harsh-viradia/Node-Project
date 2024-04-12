const express = require('express')
const routes = express.Router()
const paymentController = require("./paymentController");

routes.post("/url", authenticate, paymentController.getTransactionUrl);
routes.post("/transaction-status", paymentController.getTransactionStatus);
routes.get("/transaction-status", paymentController.getTransactionStatus);
routes.get("/status/:id", paymentController.getStatus);
routes.post("/invoice", authenticate, paymentController.getInvoice);
routes.post("/list", authenticate, paymentController.getTransactionsList)

module.exports = routes;
