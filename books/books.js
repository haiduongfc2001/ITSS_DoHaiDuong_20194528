// Load express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const Syslog = require('winston-syslog').Syslog;

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
        new winston.transports.File({ filename: 'booksservice.log' })
    ]
});

// Load mongoose
const mongoose = require('mongoose');

require('./Book');
const Book = mongoose.model('Book')

// Connect
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/booksservice', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected - Books Service');
        logger.info('Database connected - Books Service');
    } catch (error) {
        console.log('Data not connected!!!');
        logger.error('Data not connected!!!');
    }
}

// Call connect function
connect();

app.get('/', (req, res) => {
    res.send('This is a books service');
    logger.info('Received request for books service');
})

// Create function
app.post('/book', (req, res) => {
    var newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher,
    }
    // Create a new Book
    var book = new Book(newBook);

    book.save().then(() => {
        console.log('New book created!');
        // logger.info('New book created!');
        logger.info('New book created!', { title: book.title, author: book.author, numberPages: book.numberPages, publisher: book.publisher });
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
    res.send('A new book created with success!');
    logger.info('A new book created with success!');
});

app.get('/books', (req, res) => {
    Book.find().then((books) => {
        res.json(books);
        logger.info('Sent response for /books');
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});

app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
        if (book) {
            //Book data
            res.json(book);
            logger.info('Sent response for /books');
        } else {
            res.sendStatus(404);
            logger.error('Can not find book!');
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});

app.delete('/book/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id).then((book) => {
        if (book) {
            const deletedBook = {
                title: book.title,
                author: book.author,
                numberPages: book.numberPages,
                publisher: book.publisher,
            };
            Book.findByIdAndRemove(req.params.id).then(() => {
                res.send('Book deleted with success!');
                logger.info('Book deleted with success!', { book: deletedBook });
            }).catch((err) => {
                if (err) {
                    throw err;
                }
            });
        } else {
            res.sendStatus(404);
            logger.error('Can not find book!', { book: deletedBook });
        }
    }).catch((err) => {
        if (err) {
            throw err;
        }
    });
});



app.listen(4545, () => {
    console.log('Up to running! -- This is our Books service');
    logger.info('Books service started listening on port 4545');
});