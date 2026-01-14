// Import error handling utilities FIRST to catch startup errors
import { handleUnhandledRejection, handleUncaughtException } from './middleware/errorHandler.js';

// Handle unhandled promise rejections
process.on("unhandledRejection", handleUnhandledRejection);

// Handle uncaught exceptions
process.on("uncaughtException", handleUncaughtException);

import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    // Start the server only after DB connection
    app.listen(PORT, () => {
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();