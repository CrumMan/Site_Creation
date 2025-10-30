const express = require('express')
const path = require("path")
const app = express()

app.set ("view engine", "ejs")
app.set ("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname,"public")))

app.get("/", (req,res) =>{
    res.render("index")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is listening at http://localhost:${PORT}`))