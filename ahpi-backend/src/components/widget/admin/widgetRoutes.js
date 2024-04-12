const express = require("express");
const router = express.Router();
const widgetController = require('./widgetController')
const validations = require('../widgetValidations');

// create widget
router.post('/create', authenticate, _checkPermission, validate(validations.createWidget), widgetController.addWidget).descriptor('admin.widgets.create');

//update widget
router.put('/update/:id', authenticate, _checkPermission, validate(validations.createWidget), widgetController.updateWidget).descriptor('admin.widgets.update');

// delete widget
router.put('/soft-delete', authenticate, _checkPermission, widgetController.deleteWidget).descriptor('admin.widgets.delete');

// list widget with filter option
router.post('/list', authenticate, _checkPermission, widgetController.listWidget).descriptor('admin.widgets.getAll');

router.get('/get/:id', authenticate, _checkPermission, widgetController.getWidgetById).descriptor('admin.widgets.get');

router.patch('/partial-update/:id', authenticate, _checkPermission, widgetController.partialUpdate).descriptor('admin.widgets.partialUpdate');

//export router.
module.exports = router;
