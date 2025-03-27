require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const connectDB = require("./database/mongoDB");
const { loadCharacters } = require("./module/characterCache");
const api = require("./routes/api");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Async IIFE for clean server bootstrapping
(async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Load character data into in-memory cache
    await loadCharacters();

    // 3. Initialize Socket.io with CORS config
    const io = socketIo(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // 4. Apply middlewares
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 5. Serve static frontend files
    app.use(express.static(path.join(__dirname, "build")));

    // 6. Register API routes
    app.use("/api", api);

    // 7. Optional: Socket.io event handlers (modular)
    // require("./module/socket")(io);

    // 8. Optional: Serve React index.html for all other routes
    // app.get("*", (req, res) => {
    //   res.sendFile(path.join(__dirname, "client/build", "index.html"));
    // });

    // 9. Start the server
    server.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1); // Exit process with failure code
  }
})();
