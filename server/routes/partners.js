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
  const query = 'select * from partners';

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

const isValid = taxPayerRegistration => {
  const cnpj = taxPayerRegistration.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  let t = cnpj.length - 2,
      d = cnpj.substring(t),
      d1 = parseInt(d.charAt(0)),
      d2 = parseInt(d.charAt(1)),
      calc = x => {
          let n = cnpj.substring(0, x),
              y = x - 7,
              s = 0,
              r = 0;
          for (let i = x; i >= 1; i--) {
              s += n.charAt(x - i) * y--;
              if (y < 2) {
                y = 9;
              }
          }
          r = 11 - s % 11;
          return r > 9 ? 0 : r;
      };
  return calc(t) === d1 && calc(t + 1) === d2;
};

router.post('/', (req, res) => {
  const { registeredName, tradingName, taxPayerRegistration, phoneNumber, email, comments, productService } = req.body;

  if (!isValid(taxPayerRegistration)) {
    res.status(400).json({
      status: 400,
      message: 'InvalidTaxPayerRegistration'
    });
    return;
  }

  const query = 'INSERT INTO partners(registeredName, tradingName, taxPayerRegistration, phoneNumber, email, comments, productService) VALUES (?, ?, ?, ?, ?, ?, ?)';
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
