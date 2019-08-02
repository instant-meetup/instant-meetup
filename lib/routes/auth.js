const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()

  .post('/signup', (req, res, next) => {
    const { 
      username,  
      email,
      phone,
      password,
      location
    } = req.body;

    User 
      .create({ username, email, phone, password, location })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { 
      username, 
      password
    } = req.body;

    User
      .findOne({ username })
      .then(user => {
        const isValidPassword = user.compare(password);
        if(isValidPassword) {
          const token = user.authToken();
          res.cookie('session', token);
          res.send(user);
        } else {
          const err = new Error('invalid username/password');
          err.status = 401;
          next(err);
        }
      });
      
  })
  
  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  })

  .get('/signout', (req, res) => {
    res.clearCookie('session');
    res.send({ message: 'See you next time!' });
  });
