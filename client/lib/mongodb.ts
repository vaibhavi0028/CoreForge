import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached: any = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw error;
  }
}
