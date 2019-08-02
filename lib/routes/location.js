const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()

  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .select({ _id: false, phone: false, __v: false, email: false, username: false, passwordHash: false, messages: false, friends: false })
      .then(location => res.send(location))
      .catch(next);
  })
	
  .patch('/:id', ensureAuth, (req, res, next) => {
    const { location } = req.body;
		
    User
      .findByIdAndUpdate({ _id: req.params.id, user: req.user._id }, { location }, { new: true })
      .then(user => {
        if(!location) {
          const err = new Error('not updating the location');
          err.status = 401;
          next(err);
        } else {
          res.send(user);
        }
      })
      .catch(next);
  });
	

