const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autopopulate = require('mongoose-autopopulate');

const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      default: 'Default Kingdom',
    },
    townHall: {
      townName: {
        type: String,
        default: 'Default Town',
      },
      createTown: {
        type: Date,
        default: new Date().toLocaleString('en-Us', {
          hour12: false,
          timeZone: 'Asia/Bangkok',
        }),
      },
      energyCollect: Date,
    },
    resources: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      autopopulate: true,
    },
    buildings: {
      type: Schema.Types.ObjectId,
      ref: 'Building',
      autopopulate: true,
    },
    infantries: {
      type: Schema.Types.ObjectId,
      ref: 'Infantry',
      autopopulate: true,
    },
  },
  { timestamps: false },
);

playerSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

playerSchema.plugin(autopopulate);

module.exports = mongoose.model('Player', playerSchema);
