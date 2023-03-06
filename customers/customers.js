// Load express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Add logging middleware
const winston = require('winston');
const { format } = winston;
const logger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'customersservice.log' })
    ]
});

// Load mongoose
const mongoose = require('mongoose');

// Connect
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/customersservice', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected - Customers Service');
        logger.info('Database connected - Customers Service');
    } catch (error) {
        console.log('Data not connected!!!');
        logger.error('Data not connected!!!');
    }
}

// Call connect function
connect();

// Load your model
require('./Customer');
const Customer = mongoose.model('Customer')

app.post('/customer', (req, res) => {
    var newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
    }

    var customer = new Customer(newCustomer)

    customer.save().then(() => {
        res.send('Customer created');
        logger.info('Customer created!', { name: customer.name, age: customer.age, address: customer.address });
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
});

app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers);
        logger.info('Received request for customers service');
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
})

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if (customer) {
            res.json(customer)
        } else {
            res.send('Invalid Customer ID!');
            logger.info('Invalid Customer ID!');
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
})

app.delete('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then((customer) => {
        if (customer) {
            const deletedCustomer = {
                name: customer.name,
                age: customer.age,
                address: customer.address,
            };
            Customer.findByIdAndRemove(req.params.id).then(() => {
                res.send('Customer deleted with success!');
                logger.info('Customer deleted with success!', { customer: deletedCustomer });
            }).catch((err) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            res.sendStatus(404);
            logger.error('Can not find customer', { customer: deletedCustomer });
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});



app.listen(5555, () => {
    console.log('Up to running! -- This is our Customers service');
    logger.info('Customers service started listening on port 5555');
});