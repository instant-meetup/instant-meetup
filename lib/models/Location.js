const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: String,
  longitude: String
});

module.exports = mongoose.model('Location', locationSchema);
