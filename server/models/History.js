// models/History.js
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: String,
  friendId: String,
  summary: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
