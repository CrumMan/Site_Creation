// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const vehValidate = require('../utilities/vehicle-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build single vehicle in inventory
router.get("/detail/:inventory_id", utilities.handleErrors(invController.buildByInventoryId))

router.get("/", utilities.handleErrors(invController.buildInventory))

router.get("/addInv", utilities.handleErrors(invController.manageInventoryForm))
router.post("/addInv",vehValidate.vehicleRules(),vehValidate.checkVehicleData,utilities.handleErrors(invController.RegisterInventory))

module.exports = router;