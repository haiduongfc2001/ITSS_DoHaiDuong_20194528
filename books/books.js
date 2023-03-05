// Load express
const express = require('express');
const app = express();

// Load mongoose
const mongoose = require('mongoose');

// Connect
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/booksservice', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successful!!!');
    } catch (error) {
        console.log('Connect fail!!!');
    }
}

// Call connect function
connect();

// Create function
app.post('/', (req, res) => {
    // This our create function
});

app.get('/', (req, res) => {
    res.send('This is a books service');
})

app.listen(4545, () => {
    console.log('Up to running! -- This is our Books service');
});