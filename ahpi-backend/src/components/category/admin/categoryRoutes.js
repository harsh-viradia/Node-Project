const express = require("express");
const router = express.Router();
const categoryValidation = require("../validation");

const categoryController = require("./categoryController");

//add category route.
router.post('/', authenticate, _checkPermission, validate(categoryValidation.categoryCreate), categoryController.add).descriptor("admin.program.create");

router.put('/update/:id', authenticate, _checkPermission, validate(categoryValidation.categoryUpdate), categoryController.update).descriptor("admin.program.update");

router.put('/soft-delete', authenticate, _checkPermission, categoryController.deleteCategoryController).descriptor("admin.program.delete");

router.post("/list", authenticate, _checkPermission, categoryController.getList).descriptor("admin.program.getAll");

router.patch('/partial-update/:id', authenticate, _checkPermission, categoryController.partialUpdate).descriptor("admin.program.partialUpdate");

module.exports = router;