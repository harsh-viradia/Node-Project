const express = require("express");
const router = express.Router();
const {
    countryList,
    add,
    get,
    update,
    softDelete,
    updateActivityStatus,
    updateDefault,
    updateSequence
} = require('./countryController')

const countryValidation = require('../validation')

router.post('/all', countryList).descriptor("admin.country.getAll");
router.post('/create',  authenticate, _checkPermission, validate(countryValidation.create), add).descriptor("admin.country.create");
router.get('/:id',  authenticate, _checkPermission, get);
router.put('/update/:id',  authenticate, _checkPermission, validate(countryValidation.update), update).descriptor("admin.country.update");
router.put('/soft-delete',  authenticate, _checkPermission, softDelete).descriptor("admin.country.delete");
router.patch('/paritial-update/:id',  authenticate, _checkPermission, validate(countryValidation.paritialUpdate), updateActivityStatus).descriptor("admin.country.partialUpdate");
router.patch('/update-default/:id',  authenticate, _checkPermission, validate(countryValidation.updateDefault), updateDefault).descriptor("admin.country.default");
router.patch('/update/sequence/:id',  authenticate, _checkPermission, validate(countryValidation.updateSequence), updateSequence).descriptor("admin.country.updateSequence");

module.exports = router;





