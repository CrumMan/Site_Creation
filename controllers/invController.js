const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try{
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  }
  catch(err){
    console.error("Error generating navigation:", err);
    res.render("index", { title: "Home", nav: "<ul></ul>" })
  }
}

invCont.buildByInventoryId = async function (req, res, next) {
    try{
    const inventory_id = req.params.inventory_id
    const car = await invModel.getByInventoryId(inventory_id)

    if(!car){
      next({ status: 404, message:"Vehicle not found"})
      return
    }
    const vehicleName = `${car.inv_make} ${car.inv_model}`
    let nav = await utilities.getNav()

    res.render("./inventory/vehicle", {
      title: vehicleName,
      nav,
      car
    })
  }
  catch{
    console.error("Error generating navigation:", err);
    res.render("index", { title: "Home", nav: "<ul></ul>" })
  }
}

  module.exports = invCont