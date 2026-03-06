const express = require('express');

const fs = require('fs');

const app = express();

app.use(express.json());

app.post('/log', (req, res) => {

  const logEntry = `${new Date().toISOString()}: ${JSON.stringify(req.body)}\n`;

  fs.appendFile('audit.log', logEntry, (err) => {

    if (err) return res.status(500).send('Error logging');

    res.send('Logged');

  });

});

app.listen(3002, () => console.log('Audit logs service listening on port 3002'));