const mongoose =  require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcryptor = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value);
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    messages: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    toJSON: {
        transform: function(doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
    }
}
});

userSchema.virtual('password').set(function(clearPassword) {
    this.passwordHash = bcryptor.hashSync(clearPassword);
  });
  
  userSchema.methods.compare = function(clearPassword) {
    return bcryptor.compareSync(clearPassword, this.passwordHash);
  };
  
  userSchema.methods.authToken = function() {
    const token = jwt.sign(this.toJSON(), process.env.APP_SECRET, { expiresIn: '25h' });
    return token;
  };
  
  userSchema.statics.findByToken  = function(token) {
    const payload = jwt.verify(token, process.env.APP_SECRET);
  
    return this
      .findOne({ email: payload.email });
  };

  module.exports = mongoose.model('User', userSchema);

  