const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  stamina: {
    type: Number,
    default: 20,
    max: 50,
  },
  food: {
    type: Number,
    default: 0,
  },
  coin: {
    type: Number,
    default: 0,
  },
  healthTown: {
    type: Number,
    default: 500,
  },
});

module.exports = mongoose.model('Resource', resourceSchema);
