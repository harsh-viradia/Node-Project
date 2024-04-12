const express = require("express");
const routes = express.Router();

const roleRoutes = require('./roles/index')
const permissionRoutes = require('./permissions/index')
const fileRouters = require("./file/index")
const categoryRouters = require("./category/index");
const myEarningRoutes = require("./my-earning/index")
const migrationRoutes = require("./migration/index")
const notificationRoute = require("./notification/index")
const progressRoutes = require("./purchased-progress/progress/index")
const zipRoutes = require("./zipCode/index")
const courseRoutes = require('./courses/index')
const widgetRouters = require("./widget/index");
const userRoutes = require('./user/index')
const pageRoute = require('./page/index')
const seoRoutes = require("./seo/index")
const cartRoute = require('./cart/index')
const orderRoute = require('./order')
const paymentRoute = require('./payment/index')
const htmlTemplateRoute = require('./htmlTemplete')
const cityRoutes = require("./city/index");
const countryRoutes = require("./country/index");
const addressRoutes = require("./addresses/index");
const stateRoutes = require("./state/index")
const reviewRoutes = require("./review/index")
const settingsRoutes = require("./settings/index")
const searchRoutes = require('./search/index')
const wishlistRoutes = require('./wishlist/index')
const myLearningRouts = require('./purchased-progress/myLearning/index')
const cronRoutes = require('./cron-jobs/index')
const ogmRoutes = require('./courses/OGM/ogmRoute')
const quizRoutes = require('./quizProgress/index')
const queueRoutes = require('../services/bull-jobs/index')
const analyticsRoutes = require('./analytics/index');
const couponRoutes = require('./coupon/index');
const certificateRoutes = require('./certificates/index');
const payoutRoutes = require("./payout/index")

routes.use('/', roleRoutes);
routes.use('/', permissionRoutes);
routes.use("/", fileRouters);
routes.use("/", categoryRouters);
routes.use("/", myEarningRoutes);
routes.use("/", notificationRoute);
routes.use("/", progressRoutes);
routes.use("/", zipRoutes);
routes.use("/", courseRoutes);
routes.use("/", widgetRouters);
routes.use('/', userRoutes);
routes.use("/", seoRoutes);
routes.use('/', pageRoute);
routes.use('/', cartRoute);
routes.use('/', orderRoute);
routes.use('/', paymentRoute);
routes.use('/', htmlTemplateRoute);
routes.use("/", cityRoutes);
routes.use("/", countryRoutes);
routes.use("/", stateRoutes);
routes.use("/", reviewRoutes);
routes.use("/", settingsRoutes);
routes.use('/', searchRoutes);
routes.use('/', wishlistRoutes);
routes.use('/', myLearningRouts);
routes.use('/', cronRoutes);
routes.use('/ogm', ogmRoutes);
routes.use('/', quizRoutes);
routes.use('/', addressRoutes);
routes.use('/', queueRoutes);
routes.use('/', analyticsRoutes);
routes.use('/', couponRoutes);
routes.use('/', certificateRoutes)
routes.use('/migration', migrationRoutes)
routes.use("/", payoutRoutes)

module.exports = routes;

