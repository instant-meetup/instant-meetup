const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/message', require('./routes/message'));
app.use('/api/v1/friends', require('./routes/friends'));
app.use('/api/v1/user', require('./routes/user'));
app.use('/api/v1/location', require('./routes/location'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
