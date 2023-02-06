const products = require('./data.json') || {};

const express = require('express');
const app = express();

const { v4: uuid } = require('uuid');

app.use(express.json());

app.get('/', (req, res, next) => {
  console.log('GET /');
  res.send(products);
});

app.get('/:id', (req, res, next) => {
  console.log('GET /:id');
  const product = products[req.params['id']];
  if (product) {
    console.log(`Product with id ${req.params['id']} found.`);
    res.status(200).send(product);
  } else {
    console.log(`Product with id ${req.params['id']} NOT FOUND.`);
    res.status(404).send('Product not found.');
  }
});

app.post('/', (req, res, next) => {
  if (!req.body['title'] || !String(req.body['title'].length)) {
    res.status(400).send('Title (title) is required');
  } else {
    const product = {
      id: uuid(),
      title: String(req.body['title'])
    };
    products[product.id] = product;
    console.log(`Created Product with id ${product.id}.`);
    res.status(201).send(product);
  }
});

exports.Products = app;
