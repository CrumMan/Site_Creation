const express = require('express')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

//expressejs
app.set ("view engine", "ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")

//routes
app.use(static)
//index route
app.use("/", (req,res) =>{
    res.render("index", {title: "Home"})
})

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`server is listening at http://localhost:${PORT}`))