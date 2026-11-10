require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const lostFoundRoutes = require("./routes/lostFoundRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/lost-found", lostFoundRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
