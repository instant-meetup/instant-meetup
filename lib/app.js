const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, '/public')));

// ejs files
app.get('/', (req, res) => {
  res.render('pages/map');
});

app.get('/search', (req, res) => {
  res.render('pages/search');
});

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/message', require('./routes/message'));
app.use('/api/v1/friends', require('./routes/friends'));
app.use('/api/v1/user', require('./routes/user'));
app.use('/api/v1/location', require('./routes/location'));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
