const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()

  .get('/', ensureAuth, (req, res, next) => {
    User
      .find()
      .then(users => res.send(users))
      .catch(next);
  })

  .get('/:id', ensureAuth, (req, res, next) => {
    User
      .findById(req.params.id)
      .then(user => res.send(user))
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    User
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(user => res.send(user))
      .catch(next);
  });


