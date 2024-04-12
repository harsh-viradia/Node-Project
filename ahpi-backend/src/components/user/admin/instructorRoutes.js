const instructController = require("./instructorController");
const express = require("express");
const instructorValidator = require("../validations/instructorValidation");
const routes = express.Router();

//create instructor
routes.post("/create", authenticate, _checkPermission, validate(instructorValidator.createInstructor), instructController.add).descriptor("admin.instructor.create");

routes.put("/update/:id", authenticate, _checkPermission, validate(instructorValidator.updateInstructor), instructController.update).descriptor("admin.instructor.update");

routes.put("/soft-delete", authenticate, _checkPermission, instructController.softInstructorDelete).descriptor("admin.instructor.delete");

routes.post("/", authenticate, _checkPermission, instructController.getList).descriptor("admin.instructor.getAll");

routes.patch("/partial-update/:id", authenticate, _checkPermission, instructController.partialUpdate).descriptor("admin.instructor.partialUpdate");

module.exports = routes;