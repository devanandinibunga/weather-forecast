const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  location: String,
  date: Date,
  temperature: Number,
  precipitation: Number,
});
module.exports = mongoose.model("weatherSchema", weatherSchema);
