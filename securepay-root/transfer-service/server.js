const express = require('express');

const mysql = require('mysql');

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'rootpassword',
  database: 'securepay'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.userId = decoded.id;
    next();
  });
};

app.post('/transfer', authenticate, (req, res) => {
  const { to, amount } = req.body;
  // Basic validation
  if (!to || !amount || amount <= 0) return res.status(400).send('Invalid transfer data');
  db.query('INSERT INTO transfers (from_user, to_user, amount) VALUES (?, ?, ?)', [req.userId, to, amount], (err) => {
    if (err) return res.status(500).send('Error processing transfer');
    // Log transfer
    fetch(process.env.AUDIT_LOG_URL, { method: 'POST', body: JSON.stringify({ event: 'transfer', from: req.userId, to, amount }), headers: { 'Content-Type': 'application/json' } });
    res.send('Transfer successful');
  });
});

app.listen(3001, () => console.log('Transfer service listening on port 3001'));