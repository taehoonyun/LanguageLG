// db.js
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

const options = {
  serverSelectionTimeoutMS: 15000, // 타임아웃 시간 증가
  socketTimeoutMS: 45000, // 소켓 타임아웃 설정
  family: 4, // IPv4 사용
  retryWrites: true,
  w: "majority",
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 5,
};

async function connectDB() {
  try {
    await mongoose.connect(uri, options);
    console.log("✅ MongoDB Atlas Connected Successfully!");

    const db = mongoose.connection.db;


    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Attempting to reconnect...");
      setTimeout(connectDB, 5000); 
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    setTimeout(connectDB, 5000);
  }
}

module.exports = connectDB;
