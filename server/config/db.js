const mongoose = require("mongoose");
const dns = require("dns");

// Fallback to reliable public DNS resolvers to prevent ECONNREFUSED on SRV lookup
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // If setServers fails in some environments, continue with system defaults
}

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables (MONGODB_URI or MONGO_URI)");
    }

    const conn = await mongoose.connect(uri, {
      dbName: "campus_connect",
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
