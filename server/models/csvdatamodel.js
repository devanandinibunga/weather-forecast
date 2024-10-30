const mongoose = require("mongoose");

const CSVDataSchema = new mongoose.Schema({
  time: {
    type: Date,
    required: true,
  },
  temperature_2m: {
    type: Number,
    required: true,
  },
  wind_speed_10m: {
    type: Number,
  },
  relative_humidity_2m: {
    type: Number,
  },
  rain: {
    type: Number,
  },
});
module.exports = mongoose.model("CSVData", CSVDataSchema);
