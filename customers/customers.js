// Load express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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
    } catch (error) {
        console.log('Data not connected!!!');
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
        res.send('Customer created')
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
    // res.send('A new book created with success!');
});

app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.json(customers)
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
        }
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
})

app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndRemove(req.params.id).then(() => {
        res.send('Customer deleted with success!')
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});


app.listen(5555, () => {
    console.log('Up to running! -- This is our Books service');
});