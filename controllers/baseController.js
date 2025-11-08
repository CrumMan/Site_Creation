const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
try {
    const navHTML = await utilities.getNav(req, res); // calls getNav()
    res.render("index", { title: "Home", nav: navHTML });
  } catch (err) {
    console.error("Error generating navigation:", err);
    res.render("index", { title: "Home", nav: "<ul></ul>" });
  }
}



module.exports = baseController