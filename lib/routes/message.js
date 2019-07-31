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
        fullname: req.user._id,
        from,
        body,
        to,
      })
      .then(message => {
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.fullname}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;
        
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
        fullname: req.user._id,
        from,
        body,
        to,
      })
      .then(message => {
        const newLocation = req.user.location.split(' ').join('');
        const messageBody = `Hi I'm ${req.user.fullname}. Let's meet at ${message.body} https://www.google.com/maps/place/${newLocation}/?entry=im`;

        const numbers = message.to;
        console.log('array?', numbers);

        numbers.forEach(number => {
          res.send({ body: messageBody });
          client.messages
            .create({
              body: messageBody,
              from: message.from,
              to: number
            });
          
        });
        


        
        // function Numbers(argument) {
        //   const arr = [];
        //   argument.forEach(number => {
        //     arr.push(number);
        //   });
        //   return arr;
        // }
        // const phoneList = req.user.to;
        // Numbers(phoneList);
        
        // client.messages
        //   .create({
        //     body: messageBody,
        //     from,
        //     to
        //   });
      })
      .catch(next);
  });

