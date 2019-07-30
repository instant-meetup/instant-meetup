const mongoose =  require('mongoose');

const messageSchema = new mongoose.Schema({
  fullname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  phone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  body: {
    type: String,
    required: true
  },
  from: {
    type: Number
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  to: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema);
