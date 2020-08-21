const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rallySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
  }
});

module.exports = mongoose.model('Rally', rallySchema);
