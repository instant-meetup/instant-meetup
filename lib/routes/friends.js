require('dotenv').config();
const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

const Friend = require('../models/Friend');

module.exports = Router()

  .post('/', ensureAuth, async(req, res, next) => {
    const {
      friend
    } = req.body;

    const isFriend = await Friend.findOne({
      friends: { $all:[friend, req.user._id] }
    });

    isFriend ? res.send(isFriend) : Friend
      .create({ friends: [req.user._id, friend] })
      .then(friend => res.send(friend))
      .catch(next);    
  })
	
  .get('/', (req, res, next) => {

    Friend
      .find()
      .then(friendPairs => res.send(friendPairs))
      .catch(next);
  })
  
  .get('/all/:id', ensureAuth, (req, res, next) => {

    Promise.all([
      User.findById(req.params.id)
        .select({ username: true })
        .select({ _id: false }),
      Friend.find({ friends: req.params.id })
        .populate('friends', { username: true })
        .slice('friends', [1, 1])
        .select({ __v:false, _id: false })
    ])
      .then(([friend, friends]) => {
        res.send({ ...friend.toJSON(), friends });
      })
      .catch(next);
  })

  .get('/info/:id', ensureAuth, (req, res, next) => {
    User
      .findById(req.params.id)
      .select({ __v: false, friends: false, _id: false })
      .then(friend => res.send(friend))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Friend
      .findOneAndDelete(req.params.id)
      .then(friend => res.send(friend))
      .catch(next);
  });
