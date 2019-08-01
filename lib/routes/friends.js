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
    console.log('this is friend', friend);

    const isFriend = await Friend.find({
      friends: friend
    });
    console.log(isFriend);

    if(req.user._id == friend) {
      res.send('you cant be your own friend!');
      return;
    } else if(isFriend.length == 2) {
      res.send('you already friedns');
    } else
      Friend
        .create({ friends: [req.user._id, friend] })
        .then(friend => res.send(friend))
        .catch(next);
  })
	
// get all friend pairs
  .get('/', (req, res, next) => {

    Friend
      .find()
      .populate('friends', { fullname: true })
      .select({ friends: true })
      .select({ _id: false })
      .then(friends => res.send(friends))
      .catch(next);
  })
  
  // get all friends by id
  .get('/all/:id', (req, res, next) => {

    Promise.all([
      User.findById(req.params.id)
        .select({ fullname: true })
        .select({ _id: false }),
      Friend.find({ friends: req.params.id })
        .populate('friends', { fullname: true })
        .slice('friends', [1, 1])
        .select({ __v:false, _id: false })
    ])
      .then(([friend, friends]) => {
        res.send({ ...friend.toJSON(), friends });
      })
      .catch(next);
  })

// get single user by :id
  .get('/:id', (req, res, next) => {
    User
      .findById(req.params.id)
      .select({ __v: false, friends: false, _id: false })
      .then(friend => res.send(friend))
      .catch(next);
  })

    
  // delete a friend :id
  .delete('/:id', (req, res, next) => {
    Friend
      .findOneAndDelete(req.params.id)
      .then(friend => res.send(friend))
      .catch(next);
  });
