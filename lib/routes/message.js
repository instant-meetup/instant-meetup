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
        
        res.send({ body: messageBody });
        
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
  });

