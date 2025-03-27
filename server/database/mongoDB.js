// db.js
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
}

module.exports = connectDB;
