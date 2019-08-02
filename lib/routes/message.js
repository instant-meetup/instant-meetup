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
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.username}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;
 
        res.send({ body: messageBody });
        sendText(messageBody, from, to);
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

        numbers.forEach(number => {
          sendText(messageBody, from, number);
        });
        
      })
      .catch(next);
  });

