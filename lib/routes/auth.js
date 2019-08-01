const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');
const Friend = require('../models/Friend');

module.exports = Router()

  .post('/signup', (req, res, next) => {
    const { 
      fullname,  
      email,
      phone,
      password,
      location
    } = req.body;

    User 
      .create({ fullname, email, phone, password, location })
      .then(user => {
      
        Friend
          .create({ fullname: user._id });


        const token = user.authToken();

        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const { 
      fullname, 
      password
    } = req.body;

    User
      .findOne({ fullname })
      .then(user => {
        const isValidPassword = user.compare(password);
        if(isValidPassword) {
          const token = user.authToken();
          res.cookie('session', token);
          res.send(user);
        } else {
          const err = new Error('invalid name/password');
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
