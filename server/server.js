require("dotenv").config({ path: __dirname + '/.env' });
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./database/mongoDB");
const { loadCharacters } = require("./module/characterCache");
const api = require("./routes/api");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.REACT_APP_API_BASE_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admin-version']
}));

// API Routes
app.use("/api", api);

// Serve static frontend (React build)
const buildPath = path.join(__dirname, "../build");
app.use(express.static(buildPath));

// React fallback (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized Access',
      error: err.message
    });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      message: 'Resource Not Found',
      error: err.message
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? 'Something went wrong!' : 'Something went wrong!'
  });
});

// Connect to MongoDB
connectDB();

// Load characters into cache
loadCharacters();

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
