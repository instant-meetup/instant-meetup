const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Message = require('../models/Message');
const { sendText } = require('../utils/send-text');

module.exports = Router() 

  .post('/send', ensureAuth, (req, res, next) => {
    const {
      from,
      body,
      to
    } = req.body;

    Message
      .create({
        username: req.user._id,
        from,
        body,
        to,
      })
      .then(message => {
        if(req.user.location) {
          const newLocation = req.user.location.split(' ').join('');
          const messageBody = `Hi I'm ${req.user.username}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;
   
          res.send({ id: message._id, body: messageBody });
          sendText(messageBody, from, to);
        } else {
          const messageBody = `Hi I'm ${req.user.username}. Let's meet at ${message.body}`; 

          res.send({ id: message._id, body: messageBody });
          sendText(messageBody, from, to);
        }

      })
      .catch(next);
  })

  .post('/sendall', ensureAuth, (req, res, next) => {
    const {
      from,
      body,
      to
    } = req.body;
 
    Message
      .create({
        username: req.user._id,
        from,
        body,
        to,
      })
      .then(message => {
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.username}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;
        const numbers = message.to;

        res.send({ id: message._id, body: messageBody });

        numbers.forEach(number => {
          sendText(messageBody, from, number);
        });
        
      })
      .catch(next);
  })

  .post('/reply', ensureAuth, async(req, res, next) => {
    const isComing = await Message.find({
      coming: req.user._id
    });

    if(isComing.length >= 1) {
      return res.send('you are already coming');
    }

    Message
      .findByIdAndUpdate({ '_id': req.body._id }, { '$push': { 'coming': req.user._id } }, { new: true })
      .then(updatedMessage => res.send(updatedMessage))
      .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
    Message
      .findById(req.params.id)
      .then(message => res.send(message))
      .catch(next);
  });

