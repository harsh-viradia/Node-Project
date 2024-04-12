const express = require("express");
const router = express.Router();
const {
  countryList,
  get,
} = require("./countryController");

router.post("/all", countryList);
router.get("/:id", authenticate, _checkPermission, get);

module.exports = router;
