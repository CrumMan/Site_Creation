const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.vehicleRules = () => {
    return [
      // inv_make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a make."), // on error this message is sent.
  
      // inv_model is required and must be string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."), // on error this message is sent.
        // inv_year is required and must be numeric
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 4, max:4 })
        .withMessage("Please provide a year."), // on error this message is sent.
        // inv_description is reqired and must be a string
        body("inv_description")
        .trim()
        .notEmpty()
        .withMessage("Please provide a description.")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters long")
        .escape(),

        // inv_price is required and must be numeric
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1})
        .withMessage("Please provide a price."), // on error this message is sent.

        // inv_price is required and must be numeric
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1})
        .withMessage("Please provide how many Miles."), // on error this message is sent.
      // inv_price is required and must be string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a Color."),
        //vehicle_classification
        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1})
        .withMessage("Please select a Vehicle Classification.")
    ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
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
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const select_form = await utilities.buildClassificationList()
    res.render("inventory/addInv", {
      errors,
      title: "Vehicle Registration",
      nav,
      select_form,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate