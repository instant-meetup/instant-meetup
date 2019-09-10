require('dotenv').config();
const client = require('twilio')(process.env.accountSid, process.env.authToken);

const sendText = (body, from, to) => {
  client.messages.create({
    body,
    from,
    to
  });
};

module.exports = { sendText };
