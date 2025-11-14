const baseController = require("../controllers/baseController");
const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
// Index route
router.get("/", utilities.handleErrors(baseController.buildHome))

module.exports = router