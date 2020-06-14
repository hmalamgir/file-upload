const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  avatar: {
    type: Buffer
  }
});

module.exports = mongoose.model('Image', imageSchema);
