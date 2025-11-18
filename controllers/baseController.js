const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function(req, res){
    const navHTML = await utilities.getNav(req, res); // calls getNav()
    // req.flash("notice", "This is a flash message.")
    res.render("index", 
        { title: "Home",
         nav: navHTML,
        errors: null, });
}



module.exports = baseController