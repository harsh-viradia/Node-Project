const express = require('express')
const routes = express.Router()
const learnerController = require('./learnerController')

routes.post('/list',authenticate, _checkPermission, learnerController.list).descriptor("admin.learner.getAll");
routes.post('/course-details/:id',authenticate, _checkPermission, learnerController.getLernerCourseDetails).descriptor("admin.learner.getCourseDetails");
routes.patch("/partial-update/:id", authenticate, _checkPermission, learnerController.partialUpdate).descriptor("admin.learner.partialUpdate");
routes.put("/soft-delete", authenticate, _checkPermission, learnerController.softLernerDelete).descriptor("admin.learner.delete");

module.exports = routes;
