require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { initSocket, getOnlineCount } = require("./socket");

// Route imports
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Real-time Socket.IO
initSocket(httpServer);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow mobile devices, curl, Postman, and LAN addresses
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDFs and assets statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check & Root Routes
app.get("/", (req, res) => {
  res.send("🎓 Campus Connect API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Campus Connect API is healthy and operational!",
    timestamp: new Date().toISOString(),
  });
});

// Live Online Stats Endpoint
app.get("/api/stats/online", (req, res) => {
  res.json({
    success: true,
    onlineCount: getOnlineCount(),
  });
});

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/chat", chatRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server on 0.0.0.0 (all network interfaces)
async function startServer() {
  try {
    await connectDB();
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server + Socket.IO is running on:`);
      console.log(`   - Local:   http://localhost:${PORT}`);
      console.log(`   - Network: http://192.168.1.8:${PORT} (or your local IP)`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
