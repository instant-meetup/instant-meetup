const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./routes/auth'));
app.get('/working', (req, res) => {
    res.send('Working');
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
