const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const db = mysql.createConnection({
  host: "db-40677.nuvem-us-04.absamcloud.com",
  port: 27187,
  user: "crypto",
  password: "hr2agm0iwc7f",
  database: 'crypto'
});

router.get('/', (req, res) => {
  const query = 'select * from customers';

  db.query(query, (err, data) => {
    if (err) {
      res.status(400).json({
        status: 400,
        message: err.message
      });
      return;
    }

    res.status(200).send(data);
  });
});

router.post('/', (req, res) => {
  const { registeredName, tradingName, taxPayerRegistration, phoneNumber, email, comments, productService } = req.body;
  const query = 'INSERT INTO customers(registeredName, tradingName, taxPayerRegistration, phoneNumber, email, comments, productService) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [registeredName, tradingName, taxPayerRegistration, phoneNumber, email, comments, productService];

  db.query(query, values, (err) => {
    if (err) {
      res.status(400).json({
        status: 400,
        message: err.message
      });
      return;
    }

    res.json({
      status: 200,
      message: 'Success'
    });
  });
});

module.exports = router;
