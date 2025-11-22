const express = require('express')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const bodyParser = require("body-parser")

const static = require("./routes/static")
const Util = require("./utilities"); // assuming your getNav is here

const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute");
const indexRoute = require("./routes/index")

const session = require("express-session")
const pool = require('./database/')



//Middleware
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
//body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//expressejs
app.set ("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

//routes
app.use(static)

app.use("/", indexRoute)

// Inventory routes
app.use("/inv", inventoryRoute);

//Account Route
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

// Error Handler to display in local
app.use(async (err, req, res, next) => {
  let nav = await Util.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})




const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`server is listening at http://localhost:${PORT}`))
