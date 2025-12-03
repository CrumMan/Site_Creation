const Util = require(".")
const utilities = require(".")
const accountModel = require("../models/account-model")


  const { body, validationResult } = require("express-validator")
  const validate = {}
  /*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
        
  
      // valid email is required and cannot already exist in the DB
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }



  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.passwordEditRules = () => {
  return [
    body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Account ID is required"), // on error this message is sent.
      body("account_type")
      .trim()
      .notEmpty()
      .withMessage("Account type is required"),

    body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

validate.infoEditRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
         body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Account ID is required"),

      body("account_type")
      .trim()
      .notEmpty()
      .withMessage("Account type is required"),
  
      // valid email is required and cannot already exist in the DB
      // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, {req}) => {

          const existingAccount = await accountModel.checkExistingEmail(account_email)
          const currentAccountId = parseInt(req.body.account_id)
          if (existingAccount && existingAccount.account_id != currentAccountId) {
          throw new Error("Email exists. Please use different email")
          }
        }),
        ]
  }

validate.loginRules = () => {
  return [
    body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .withMessage("Please provide an Email."), // on error this message is sent.
    body("account_password")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a password."), // on error this message is sent.
        ]
}

validate.credentialEditRules = () => {
  return [
    body("account_type")
        .trim()
        .escape()
        .notEmpty()
        .isIn(['Client', 'Employee', 'Admin'])
        .withMessage("Please provide valid account type."),
    body("account_id")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Account ID is required"),
  ]
}

validate.checkCredentialEdit = async(req,res,next) =>{
  const{account_type, account_id} = req.body
  let errors =[]
  errors = validationResult(req)
  if (!errors.isEmpty()){
    errors.array().forEach(error => {
      req.flash('notice', error.msg)
    })
    return res.redirect(`/account/editCredential?id=${account_id}`)
  }
  next();
}

validate.checkLoginData = async (req,res,next) => {
  const {account_email, account_password} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("account/login", {
      errors,
      title: "account",
      nav,
      email,
      account_email,
    })
  }
  next()
}

validate.checkEditRules = async (req,res,next) => {
  const {account_firstname, account_lastname, account_email, account_id, account_type} = req.body
  let errors = []
  errors = validationResult(req)
  
  if (!errors.isEmpty()){
    const nav = await utilities.getNav()
    return res.status(400).render("account/edit-account",{
      errors,
      nav,
      title:"Update Account",
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_type
    })
  }
  next()
}
validate.checkEditPasswordRules =  async (req,res,next) => {
  const {account_id, account_type, account_password} = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()){
    const nav = await utilities.getNav()
    const user = res.locals.accountData
    
    return res.status(400).render("account/edit-account",{
      errors,
      nav,
      title: "Update Account",
      account_id: user.account_id,
      account_firstname: user.account_firstname,
      account_lastname: user.account_lastname,  
      account_email: user.account_email,        
      account_type: user.account_type  
    })
  }
  next()
}

module.exports = validate