const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buildingSchema = new Schema(
  {
    buildingType: {
      type: [
        {
          type: String,
          enum: ['Farm', 'Market', 'Barrack'],
        },
      ],
      required: true,
    },
    createFarm: {
      type: Date,
    },
    createMarket: {
      type: Date,
    },
    farmCollect: { type: Date },
    marketCollect: { type: Date },
  },
  { timestamps: false },
);

module.exports = mongoose.model('Building', buildingSchema);
