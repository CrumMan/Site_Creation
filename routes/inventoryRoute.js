// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities')
const vehValidate = require('../utilities/vehicle-validation')
const classValidate = require('../utilities/classification-validation')
const vehUpdateValidate = require("../utilities/edit_vehicle_validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build single vehicle in inventory
router.get("/detail/:inventory_id", utilities.handleErrors(invController.buildByInventoryId))

//build list by classification Id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//management view
router.get("/", utilities.checkCredentials ,utilities.handleErrors(invController.buildInventory))


//add inventory get and post
router.get("/addInv", utilities.checkCredentials, utilities.handleErrors(invController.manageInventoryForm))
router.post("/addInv", utilities.checkCredentials, vehValidate.vehicleRules(),vehValidate.checkVehicleData,utilities.handleErrors(invController.RegisterInventory))

//crete classification routes
router.get("/addClassification", utilities.checkCredentials, invController.manageClassificationForm)
router.post("/addClassification", utilities.checkCredentials, classValidate.classificaionRules(),classValidate.checkClassificationData, invController.registerClassification)


//update inventory routes
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update/", vehUpdateValidate.vehicleRules(), vehUpdateValidate.checkVehicleData, utilities.handleErrors(invController.updateInventory))
//delete inventory
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete", utilities.handleErrors(invController.deleteVehicle))
module.exports = router;