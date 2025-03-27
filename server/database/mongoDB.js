// db.js
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Atlas 연결 성공!");
  } catch (err) {
    console.error("❌ MongoDB 연결 실패:", err.message);
  }
}

module.exports = connectDB;
