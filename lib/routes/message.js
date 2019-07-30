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
      location,
      to
    } = req.body;

    Message
      .create({
        fullname: req.user._id,
        from,
        body,
        location,
        to,
      })
      .then(message => {
        const {
          body,
          from,
          to
        } = message;
        res.send(message);

        client.messages
          .create({
            body,
            from,
            to
          });
      })
      .catch(next);

  });
