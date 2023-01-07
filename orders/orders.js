const express = require('express');
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Connect
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://haiduongfc2001:Haiduong26122001@ordersservice.gszv7sn.mongodb.net/?retryWrites=true&w=majority", () => {
    console.log("Database connected - Orders service");
});

// Model is loaded
require("./Order")
const Order = mongoose.model("Order");

// Will create a new Order
app.post("/order", (req, res) => {
    var newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send("Order create with success!")
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
})

app.get('/orders', (req, res) => {
    Order.find().then((books) => {
        res.json(books)
    }).catch((err) => {
        if (err) {
            throw err;
        }
    })
})

app.listen("7777", () => {
    console.log("Up and running - Orders service")
})