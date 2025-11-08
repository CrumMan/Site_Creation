const baseController = require("../controllers/baseController");

// Index route
application.get("/", baseController.buildHome)