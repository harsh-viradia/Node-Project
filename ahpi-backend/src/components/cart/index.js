const express=require("express")
const route=express.Router()
const cartWebRoute=require("./web/cart.web.routes")
const cartDeviceRoute=require("./web/cart.web.routes")

route.use("/web/api/v1/cart", cartWebRoute);
route.use("/device/api/v1/cart", cartDeviceRoute);

module.exports = route;
