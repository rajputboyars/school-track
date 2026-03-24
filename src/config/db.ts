import { connectDB } from "../lib/db/connect";

export const initDB = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ DB connection failed", error);
    throw error;
  }
};