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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/allInv",{
    title: "Inventory",
    nav,
    classificationSelect,
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
  
  const classificationSelect = await utilities.buildClassificationList()
    return res.status(201).render("inventory/allInv",{
      title: "Manage Inventory",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// edit inventory
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) 
  const nav = await utilities.getNav()
  const itemData = await invModel.getByInventoryId(inv_id)
  
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
 
  console.log("itemData:", itemData);
  console.log("inv_id param:", req.params.inv_id);

  res.render("inventory/edit-inventory",{
    title: "Edit " + itemName,
    nav,
    select_form: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
//delete inventory view
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) 
  const nav = await utilities.getNav()
  const itemData = await invModel.getByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  console.log("itemData:", itemData);


  res.render("inventory/delete-confirm",{
    title: "Delete " + itemName,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors:null,
    })
}
invCont.deleteVehicle = async function (req,res,next) {
let nav = await utilities.getNav()
  const { inv_id } = req.body
  const itemData = await invModel.getByInventoryId(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  const deletedVehicle = await invModel.deleteInventoryItem(inv_id)

  if(deletedVehicle){
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  }
  else{
     req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Delete " + itemName,
    nav,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
    errors,
    })
  }
}
  module.exports = invCont