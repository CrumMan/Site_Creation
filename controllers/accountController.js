//Deliver login view
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

async function buildRegister(req,res,next){
  let nav = await utilities.getNav()
  res.render("account/register",{
    title: "Register",
    nav,
    errors:null
  })
}

/* Process Registration */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  // Hash the password before storing
  let hashedPassword
  
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
     res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      
      utilities.createAccessToken(accountData, res)

      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error(error)
    throw new Error('Access Forbidden')
  }
}

async function buildManagement(req, res){
  try{
    let nav = await utilities.getNav()
    let user = res.locals.accountData

    res.render("account/manage",{
      nav,
      title: "Account Management",
      user
      
    })
  }
  catch (error){
    const account_email = res.locals.accountData?.account_email || ''
     req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
  }
}

async function logoutOfAccount(req, res){
  req.flash('notice', 'You have been logged out.')
  res.clearCookie('jwt')
  req.session.destroy()
  res.redirect("/account/login")
}

//edited
async function editAccountView(req, res, next){
    const user= res.locals.accountData
    const nav = await utilities.getNav()
    res.render("account/edit-account",{
      title: "Edit Account",
      nav,
      errors: null,
      account_id: user.account_id,
      account_firstname: user.account_firstname,
      account_lastname: user.account_lastname,
      account_email: user.account_email,
      account_type: user.account_type,
    })
}

async function editAccountInfo(req,res,next){
    const { 
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_type
    } = req.body
    const updateResult = await accountModel.updateAccountInfo(
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email, 
      account_type
    )
    if (updateResult) {
       req.flash("notice", `Your account was successfully updated.`)
       utilities.createAccessToken(updateResult, res)
       res.redirect("/account")
    }
    else {
      req.flash('notice', `Something went wrong`)
      res.redirect("/account/updateUser")
    }
}

async function editPassword(req, res, next) {
    let hashedPassword
    const { account_id, 
            account_password } = req.body
    try{
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    }
    catch (error) {
    req.flash("notice", 'Sorry, there was an error changing the password.')
    return res.redirect("/account/updateUser")
    }
    const updatedResult = await accountModel.updateUserPassword(
      account_id,
      hashedPassword
    )
    if (updatedResult) {
      req.flash('notice', `Your password has been changed.`)
      return res.redirect("/account")
    }
    else{
      req.flash('notice', `Something went wrong changing your password.`)
      res.redirect("/account/updateUser")
    }
}

async function selectAccountView(req, res, next){
  try{
    const nav = await utilities.getNav()
    const userList = await accountModel.getAllAccounts()   
    const users = await utilities.createUserList(userList, res)

    res.render("account/accountView", 
    {
      title: "Which account would you like to change credentials?",
      nav,
      users,
      errors: null,
    })
  }
  catch(error){
    req.flash('notice', "selectAccountView error:", error)
    res.redirect('/')
  }
}

async function createCredentialEdit(req, res, next) {
  const account_id = req.query.id
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  const selectform = await utilities.createSelectForm(accountData, req, res)
  console.log(`Account_id: ${account_id} \n Account Data: ${accountData}\nselectForm: ${selectform}`)

  res.render("account/accountClassForm", {
    nav,
    title: "Edit User Classification",
    accountData,
    selectform,
    errors: null,
  })
}

async function editCredentials(req,res,next) {
  console.log('full req body', req.body)

  const {account_id, account_type}=req.body

  
  console.log('account_id:', account_id, '| Type:', typeof account_id)
  console.log('account_type:', account_type, '| Type:', typeof account_type)

  const updatedResult = await accountModel.changeCredential(account_id, account_type)
  if(updatedResult){
    req.flash('notice', 'User credentials have been changed.')
    return res.redirect('/account')
  }
  else{
    req.flash('notice', 'Issue with credential change.')
    res.redirect(`/account/editCredential?id=${account_id}`)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, logoutOfAccount, editAccountView, editAccountInfo, editPassword, selectAccountView, createCredentialEdit, editCredentials }