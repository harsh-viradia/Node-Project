const express = require('express')
const router = express.Router()
const htmlTemplateController = require('./htmlTemplate.admin.controller')
const validations = require('../validation')

router.route('/create').post(validate(validations.create), authenticate, _checkPermission, htmlTemplateController.create)
router.route('/list').post(authenticate, _checkPermission, htmlTemplateController.findAll)
router.route('/:id').get(authenticate, _checkPermission, htmlTemplateController.view)
router.route('/update/:id').put(validate(validations.update), authenticate, _checkPermission, htmlTemplateController.update)
router.route("/partially-update/:id").put(authenticate, _checkPermission, htmlTemplateController.partiallyUpdate)
router.route('/delete/:id').delete(authenticate, _checkPermission, htmlTemplateController.destroy)

module.exports = router
