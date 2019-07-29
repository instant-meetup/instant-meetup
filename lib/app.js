const express = require('express');
const app = express();

app.use(express.json());

// app.use('/api/v1/RESOURCE', require('./routes/resource'));
app.get('/working', (req, res) => {
    res.send('Working');
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
