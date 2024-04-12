const express = require('express')
const routes = express.Router()
const courseController = require('./courseController')
const courseValidation = require('../validations/courseValidations')

routes.post("/course-count", authenticate, _checkPermission, courseController.courseCount).descriptor("admin.courses.courseCount")
routes.post('/basic-info/add', authenticate, _checkPermission, validate(courseValidation.basicInfo), courseController.courseBasicInfo).descriptor("admin.courses.basicInfo");
routes.put('/course-info/add/:id', authenticate, _checkPermission, validate(courseValidation.courseInfo), courseController.courseInfo).descriptor("admin.courses.courseInfo");
routes.put('/price/add/:id', authenticate, _checkPermission, validate(courseValidation.coursePrice), courseController.coursePrice).descriptor("admin.courses.addPrice");
routes.put('/basic-info/update/:id', authenticate, _checkPermission, validate(courseValidation.basicInfo), courseController.courseBasicInfoUpdate).descriptor("admin.courses.updateBasicInfo");
routes.post('/publish', authenticate, _checkPermission, courseController.publishCourse).descriptor("admin.courses.publish");
routes.post('/', authenticate, _checkPermission, courseController.listCourse).descriptor("admin.courses.getAll");
routes.put('/soft-delete', authenticate, _checkPermission, courseController.softDelete).descriptor("admin.courses.delete");
routes.patch('/partial-update/:id', authenticate, _checkPermission, courseController.partialUpdate).descriptor("admin.courses.partialUpdate");
routes.get('/:id', authenticate, _checkPermission, courseController.getCourse).descriptor("admin.courses.get");
routes.patch('/verify-course/:id',authenticate, _checkPermission, courseController.verifyCourse).descriptor('admin.courses.verify');
routes.post('/preview-course-count',authenticate, _checkPermission, courseController.previewCourseCount).descriptor('admin.courses.previewCount');
routes.post('/reject-course/:id',authenticate, _checkPermission, courseController.rejectCourse).descriptor('admin.courses.reject');
routes.patch('/approve-course/:id', authenticate, _checkPermission, courseController.approveCourse).descriptor('admin.courses.approveCourse') 

module.exports = routes;
