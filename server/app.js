const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const customers = require('./routes/customers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/customers', customers);

app.use('/api/**', (_, res) => {
  res.status(404).send({ message: 'Not found', status: '404' });
});

app.use('/**', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
