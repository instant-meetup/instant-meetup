const mongoose =  require('mongoose');

const messageSchema = new mongoose.Schema({
  username: {
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
  coming:
    [String],

  from: {
    type: Number
  },
  to: 
    [Number]
  
});

module.exports = mongoose.model('Message', messageSchema);
