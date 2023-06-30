const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  lastLocation: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },
 
}, {timestamps:true});

module.exports = mongoose.model('Item', ItemSchema);