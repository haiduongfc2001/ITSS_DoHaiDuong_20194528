const express = require('express');
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Connect
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://haiduongfc2001:Haiduong26122001@customersservice.2fvnmvv.mongodb.net/?retryWrites=true&w=majority", () => {
    console.log("Database connected - Customers service");
});



app.listen("7777", () => {
    console.log("Up and running - Orders service")
})