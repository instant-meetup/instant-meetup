const mongoose = require('mongoose');

const locationModel = new mongoose.Schema({
    latitude: String,
    longitude: String
});

module.exports = mongoose.model('Message', userSchema);
