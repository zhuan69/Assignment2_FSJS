const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const infantrySchema = new Schema({
  soldierAttackPoint: {
    type: [
      {
        type: Number,
        default: 0,
      },
    ],
  },
  totalInfantry: {
    type: Number,
    default: 2,
  },
  totalPower: {
    type: Number,
    default: 0,
  },
});

infantrySchema.pre('save', function (next) {
  const attack = Math.floor(Math.random() * (45 - 30 + 1) + 30);
  const attack2 = Math.floor(Math.random() * (45 - 30 + 1) + 30);
  this.soldierAttackPoint.push(attack, attack2);
  this.totalPower = attack + attack2;
  next();
});

module.exports = mongoose.model('Infantry', infantrySchema);
