const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const { response } = require('express');

const morgan = require('morgan');
app.use(morgan('combined'));


app.use(bodyParser.json());

// Add logging middleware
const winston = require('winston');
const { format } = winston;
const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'orders-service.log' })
    ]
});

// Connect
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ordersservice', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected - Orders Service');
        logger.info('Database connected - Orders Service');
    } catch (error) {
        console.log('Data not connected!!!');
        logger.error('Data not connected!!!');
    }
}

// Call connect function
connect();

// Model is loaded
require('./Order');
const Order = mongoose.model('Order')


// Will create a new Order
app.post('/order', (req, res) => {
    var newOrder = {
        CustomerID: new mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: new mongoose.Types.ObjectId(req.body.BookID),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate,
    }

    var order = new Order(newOrder)

    order.save().then(() => {
        res.send('Order created with success!');
        logger.info('Order created!', {
            CustomerID: order.CustomerID, BookID: order.BookID,
            initialDate: order.address, deliveryDate: order.deliveryDate
        });
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
});

app.get('/orders', (req, res) => {
    Order.find().then((books) => {
        res.json(books)
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if (order) {
            axios.get('http://localhost:5555/customer/' + order.CustomerID).then((response) => {
                var orderObject = { customerName: response.data.name, bookTitle: '' }

                axios.get('http://localhost:4545/book/' + order.BookID).then((response) => {
                    orderObject.bookTitle = response.data.title
                    res.json(orderObject)
                })
            });
        } else {
            res.send('Invalid Order');
            logger.error('Invalid Order');
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});

// axios.get('http://localhost:4545/books').then((response) => {
//     console.log(response.data);
// });

// axios.get('http://localhost:5555/customers').then((response) => {
//     console.log(response.data);
// });


app.listen(7777, () => {
    console.log('Up to running! -- This is our Orders service');
    logger.info('Orders service started listening on port 7777');
});