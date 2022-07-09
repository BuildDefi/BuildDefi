const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const partners = require('./routes/partners');

const app = express();

app.listen(3000, '127.0.0.1', function(){
  console.log(`Listening to http://127.0.0.1:3000`);
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/partners', partners);

app.use('/api/**', (_, res) => {
  res.status(404).send({ message: 'Not found', status: '404' });
});

app.use('/**', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

module.exports = app;
