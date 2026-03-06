const express = require('express');

const mysql = require('mysql');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'database',
    user: 'root',
    password: 'rootpassword',
    database: 'securepay'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) return res.status(500).send('Error registering user');
            res.send('User registered');
        });
    } catch (err) {
        res.status(500).send('Error');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Invalid credentials');
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Invalid credentials');
        const token = jwt.sign({ id: user.id }, 'secret');
        res.json({ token });
    });
});

app.listen(3000, () => console.log('Auth service listening on port 3000'));