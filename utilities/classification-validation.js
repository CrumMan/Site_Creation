const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.classificaionRules = () => {
    return [
      // inv_make is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Please provide a Classification."), // on error this message is sent.
        ]
  }


  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { 
    classification_name
  } = req.body
    let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()) {
          let nav = await utilities.getNav()
          return res.render("classifications/addClassification",{
          title: "Add a Classification",
          nav,
          errors,
          classification_name,
    })
  }
  next()
}
module.exports = validate