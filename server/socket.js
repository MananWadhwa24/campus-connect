const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");

// Map of userId (string) -> Set of socketIds
const onlineUsers = new Map();

let ioInstance = null;

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  ioInstance = io;

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace("Bearer ", "");

      if (token) {
        try {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_super_secret_key"
          );
          const user = await User.findById(decoded.id).select("name email role");
          if (user) {
            socket.user = user;
            socket.userId = user._id.toString();
          }
        } catch (jwtErr) {
          // Token invalid or expired, continue as guest
          console.warn("Socket JWT verification failed:", jwtErr.message);
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on("connection", async (socket) => {
    const isAuth = !!socket.user;
    const userId = socket.userId;

    if (isAuth && userId) {
      // Add socket to user's set of active connections
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);

      // Broadcast unique online user count
      io.emit("users:count", { count: onlineUsers.size });
      socket.broadcast.emit("user:online", {
        userId,
        name: socket.user.name,
      });
    } else {
      // Send current count to guest connection
      socket.emit("users:count", { count: onlineUsers.size });
    }

    // Client requests message history
    socket.on("message:history", async () => {
      try {
        const history = await Message.find()
          .sort({ createdAt: -1 })
          .limit(50);
        socket.emit("message:history", history.reverse());
      } catch (err) {
        socket.emit("error", { message: "Failed to load chat history" });
      }
    });

    // Client sends a new message
    socket.on("message:send", async (data) => {
      try {
        if (!socket.user) {
          return socket.emit("error", {
            message: "Authentication required to send chat messages",
          });
        }

        const text = typeof data === "string" ? data : data?.text;
        if (!text || !text.trim()) {
          return socket.emit("error", { message: "Message cannot be empty" });
        }

        // Persist message to MongoDB
        const newMessage = await Message.create({
          sender: socket.user._id,
          senderName: socket.user.name,
          text: text.trim(),
        });

        // Broadcast to all connected clients
        io.emit("message:new", newMessage);
      } catch (err) {
        console.error("Socket message:send error:", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("typing:start", () => {
      if (socket.user) {
        socket.broadcast.emit("typing:start", {
          userId: socket.userId,
          name: socket.user.name,
        });
      }
    });

    socket.on("typing:stop", () => {
      if (socket.user) {
        socket.broadcast.emit("typing:stop", {
          userId: socket.userId,
          name: socket.user.name,
        });
      }
    });

    // Handle Disconnection
    socket.on("disconnect", () => {
      if (isAuth && userId && onlineUsers.has(userId)) {
        const userSockets = onlineUsers.get(userId);
        userSockets.delete(socket.id);

        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit("user:offline", { userId });
        }

        io.emit("users:count", { count: onlineUsers.size });
      }
    });
  });

  return io;
};

const getOnlineCount = () => onlineUsers.size;

module.exports = {
  initSocket,
  getOnlineCount,
};
