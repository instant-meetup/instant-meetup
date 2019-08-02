require('dotenv').config();
const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');

const Message = require('../models/Message');

const client = require('twilio')(process.env.accountSid, process.env.authToken);

module.exports = Router() 

  .post('/send', ensureAuth, (req, res, next) => {

    const {
      from,
      body,
      coming,
      to
    } = req.body;

    Message
      .create({
        fullname: req.user._id,
        from,
        body,
        coming,
        to,
      })
      .then(message => {
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.fullname}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;
        
        res.send({ message, body: messageBody });
        
        client.messages
          .create({
            body: messageBody,
            from: message.from,
            to: message.to
          });
      })
      .catch(next);
  })

  .post('/sendall', ensureAuth, (req, res, next) => {
    const {
      from,
      body,
      coming,
      to
    } = req.body;
 
    Message
      .create({
        fullname: req.user._id,
        from,
        body,
        coming,
        to,
      })
      .then(message => {
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.fullname}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;

        const numbers = message.to;

        res.send({ body: messageBody });
        numbers.forEach(item => {
          client.messages
            .create({
              body: messageBody,
              from: message.from,
              to: item
            });      
        });
        
      })
      .catch(next);
  })

  .post('/reply', ensureAuth, async(req, res, next) => {
    const isComing = await Message.find({
      coming: req.user._id
    })
    console.log(isComing);
    
    if(isComing.length >= 1) {
      return res.send('you are already coming');
    } 
    Message
    .findByIdAndUpdate({ '_id': req.body.id },{ '$push': {'coming': req.user._id }})
    .then(updatedMessage => res.send(updatedMessage))
    .catch(next);
  })
  
  .get('/:id', ensureAuth, (req, res, next) => {
      Message
        .findById(req.params.id)
        .then(message => res.send(message))
        .catch(next);
  })

