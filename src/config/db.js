import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI is missing in environment variables");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || "expense_app",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err; // pass error back to server.js
  }
}
