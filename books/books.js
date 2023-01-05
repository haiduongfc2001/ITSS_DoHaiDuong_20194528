// Load express
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("This is the books services");
})

app.listen(4545, () => {
    console.log("Up and running! -- This is our Books service");
})