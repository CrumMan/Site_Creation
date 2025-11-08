// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build single vehicle in inventory
router.get("/detail/:inventory_id", invController.buildByInventoryId)

module.exports = router;