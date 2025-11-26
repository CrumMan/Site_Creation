const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


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

        body("inv_image")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 10 })
          .withMessage("Please provide an image."),
  
        body("inv_thumbnail")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min: 3 })
          .withMessage("Please provide a Thumbnail."),
          
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
  validate.checkVehicleData = async (req, res, next) => {
    const { 
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
  } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let itemName = `${inv_make} ${inv_model}`
        const classificationSelect = await utilities.buildClassificationList(classification_id)
      res.render("inventory/edit-inventory", {
        errors,
        inv_id,
        title: "Edit " + itemName,
        nav,
        inv_image:inv_image,
        inv_thumbnail:inv_thumbnail,
        inv_make:inv_make,
        inv_model:inv_model,
        inv_year:inv_year,
        inv_description:inv_description,
        inv_price:inv_price,
        inv_miles:inv_miles,
        inv_color:inv_color,
        select_form: classificationSelect
     })
    return
    }
    next()
  }
  
  module.exports = validate