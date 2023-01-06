// Load express
const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Load mongoose
const mongoose = require("mongoose");

// Connect
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://haiduongfc2001:Haiduong26122001@cluster0.p383bze.mongodb.net/?retryWrites=true&w=majority", () => {
    console.log("Connected to mongodb");
});

app.get("/", (req, res) => {
    res.send("This is the books services");
})

// Create functions
app.post("/book", (req, res) => {
    console.log(req.body);
    res.send("00:D")
})

app.listen(4545, () => {
    console.log("Up and running! -- This is our Books service");
})