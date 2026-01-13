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
    console.log('Attempting to connect to database...');
    await connectDB();
    console.log('Database connected successfully!');

    // Start the server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();