const orders = require('./data.json') || {};

const express = require('express');
const app = express();

const { v4: uuid } = require('uuid');

app.use(express.json());

app.get('/', (req, res, next) => {
  console.log('GET /');
  res.send(orders);
});

app.get('/:id', (req, res, next) => {
  console.log('GET /:id');
  const order = orders[req.params['id']];
  if (order) {
    console.log(`Order with id ${req.params['id']} found.`);
    res.status(200).send(order);
  } else {
    console.log(`Order with id ${req.params['id']} NOT FOUND.`);
    res.status(404).send('Order not found.');
  }
});

app.post('/', (req, res, next) => {
  if (!req.body['userId'] || !String(req.body['userId'].length)) {
    res.status(400).send('User ID (userId) is required');
  } else if (!req.body['productId'] || !String(req.body['productId'].length)) {
    res.status(400).send('Product ID (productId) is required');
  } else {
    const order = {
      id: uuid(),
      userId: String(req.body['userId']),
      productId: String(req.body['productId'])
    };
    orders[order.id] = order;
    console.log(`Created Order with id ${order.id}.`);
    res.status(201).send(order);
  }
});

exports.Orders = app;
