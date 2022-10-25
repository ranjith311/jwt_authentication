require("dotenv").config()
const express = require("express");
const app = express()
const cookieParser= require("cookie-parser")

app.use(express.json())

app.use(cookieParser());
app.use(express.static('public'))
app.set("view engine","ejs")



app.use("/api",require("./routes/auth"))


app.listen(3000,()=>console.log("Server is runnin at port 3000"))