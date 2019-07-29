const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()

  .post('/signup', (req, res, next) => {
    const { 
      userName,  
      email,
      phone,
      password
    } = req.body;

    User 
      .create({ userName, email, phone, password })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token);
        res.send(user);
      })
      .catch(next);
  })
//   .post('/signin', (req, res, next) => {
//     const { 
//       email, 
//       password 
//     } = req.body;

//     User
//       .findOne({ email })
//       .then(user => {
//         const isValidPassword = user.compare(password);
//         if(isValidPassword) {
//           const token = user.authToken();
//           res.cookie('session', token);
//           res.send(user);
//         } else {
//           const err = new Error('invalid email/password');
//           err.status = 401;
//           next(err);
//         }
//       });
//   })
  
//   .get('/verify', ensureAuth, (req, res) => {
//     res.send(req.user);
//   })
