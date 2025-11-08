const express = require('express')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const Util = require("./utilities"); // assuming your getNav is here
const inventoryRoute = require("./routes/inventoryRoute");


//expressejs
app.set ("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

//routes
app.use(static)

// Inventory routes
app.use("/inv", inventoryRoute);

//index route
app.use("/", async (req, res) => {
  try {
    const navHTML = await Util.getNav(req, res); // calls getNav()
    res.render("index", { title: "Home", nav: navHTML });
  } catch (err) {
    console.error("Error generating navigation:", err);
    res.render("index", { title: "Home", nav: "<ul></ul>" });
  }
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await Util.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})



const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`server is listening at http://localhost:${PORT}`))
