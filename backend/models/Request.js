const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  region: String,
  category: String,
  subcategory: String,
  service: String,
  contact: String,
  message: String,
  attachment: String,
  aiResult: {
    intent: String,
    sentiment: String,
  },
  status: String,
  executor: String,
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
