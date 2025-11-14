const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function(req, res){
    const navHTML = await utilities.getNav(req, res); // calls getNav()
    res.render("index", { title: "Home", nav: navHTML });
}



module.exports = baseController