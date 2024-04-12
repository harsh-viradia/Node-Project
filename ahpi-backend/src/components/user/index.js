const express = require('express');
const routes = express.Router();
const adminRoutes = require('./admin/adminRoutes');
const instructorRoutes = require("./admin/instructorRoutes");
const userRoutes = require("./admin/userRoutes");
const lernerRoutes = require("./admin/learnerRoutes");
const authSSO = require('./services/authSSO');
const webRoutes = require('./web/learnerRoutes');
const deviceRoutes = require('./device/learnerRoutes');

routes.use('/admin', adminRoutes);
routes.use('/admin/instructor', instructorRoutes);
routes.use('/admin/users', userRoutes);
routes.use('/admin/lerner', lernerRoutes);
routes.post('/users/profile', authenticate, _checkPermission, authSSO.getUserProfile);
routes.use('/web/api/v1/learner', webRoutes);
routes.use('/device/api/v1/learner', deviceRoutes);

routes.use("/user", require("./authentication/index"))

module.exports = routes;

