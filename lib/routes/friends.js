require('dotenv').config();
const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');

const Friend = require('../models/Friend');

module.exports = Router()

  .post('/', ensureAuth, (req, res, next) => {
    const {
      friend
    } = req.body;
    console.log('this is friend', friend);

    if(req.user._id == friend) {
      res.send('you cant be your own friend!');
      return;
    } 
    Friend
      .create({ friends: [req.user._id, friend] })
      .then(friend => res.send(friend))
      .catch(next);
  });
