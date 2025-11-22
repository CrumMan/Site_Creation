const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventory_id
    const car = await invModel.getByInventoryId(inventory_id)

    const vehicleName = `${car.inv_make} ${car.inv_model}`
    let nav = await utilities.getNav()

    res.render("./inventory/vehicle", {
      title: vehicleName,
      nav,
      car,
      errors: null,
    })
}

invCont.buildInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const data = await invModel.getWholeInventory()
  const grid = await utilities.buildClassificationGrid(data)
  res.render("./inventory/allInv",{
    title: "Inventory",
    nav,
    grid,
    errors:null,
  })
}

invCont.manageInventoryForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  const select_form = await utilities.buildClassificationList()
  res.render("./inventory/addInv",{
    title : "Add Vehicle Registration",
    nav,
    select_form,
    errors: null,
  })
}

invCont.manageClassificationForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("classifications/addClassification",{
    title: "Add a Classification",
    nav,
    errors: null
  })
}

invCont.RegisterInventory = async function (req, res, next){
  let nav = await utilities.getNav()
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id
    
  } = req.body
  
  const regResult = await invModel.registerVehicle(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_price, 
    inv_miles, 
    inv_color,
    classification_id
  )
  
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've added a ${inv_make} ${inv_model}.`
    ) 
    const data = await invModel.getWholeInventory()
    const grid = await utilities.buildClassificationGrid(data)
    return res.status(201).render("inventory/allInv",{
      title: "Manage Inventory",
      nav,
      grid,
      errors:null,
    })
  } else {
    const select_form = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/addInv", {
      title: "Vehicle Registration",
      nav,
      select_form,
      errors:null,
    })
  }
}

invCont.registerClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  const{classification_name} = req.body
  const regResult = await invModel.registerClassification(classification_name)

  if(regResult){
    const data = await invModel.getWholeInventory()
    const grid = await utilities.buildClassificationGrid(data)
    req.flash( 'notice',`${classification_name} Classification Added`)
    res.status(501).render("inventory/allInv",{
      title : "Manage Inventory",
      nav,
      grid,
      errors:null,
    })
  }
  else{
    req.flash("notice", "Sorry, the adding a classification failed.")
    res.status(501).render("classifications/addClassification", {
      Title : "Add a Classification",
      nav,
      errors:null,

    })
  }
}

  module.exports = invCont