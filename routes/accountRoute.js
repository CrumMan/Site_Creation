const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')
const { check } = require("express-validator")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.get('/login', utilities.handleErrors(accountController.buildLogin))


router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get('/register', utilities.handleErrors(accountController.buildRegister))

router.post('/register', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

router.get('/updateUser', utilities.checkLogin,  utilities.handleErrors(accountController.editAccountView))

router.post('/update-info', utilities.checkLogin, 
  regValidate.infoEditRules(), regValidate.checkEditRules, 
  utilities.handleErrors(accountController.editAccountInfo))

router.post('/edit-password', utilities.checkLogin,
  regValidate.passwordEditRules(), regValidate.checkEditPasswordRules,
  utilities.handleErrors(accountController.editPassword))

router.get('/credentialView', utilities.checkCredentials, utilities.checkLogin, utilities.handleErrors(accountController.selectAccountView))

router.get('/editCredential', utilities.checkCredentials, utilities.checkLogin, utilities.handleErrors(accountController.createCredentialEdit) )

router.post('/editCredential', utilities.checkCredentials, utilities.checkLogin, regValidate.credentialEditRules(), regValidate.checkCredentialEdit, utilities.handleErrors(accountController.editCredentials))

router.get('/logout', accountController.logoutOfAccount)
//
module.exports = router