import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import error handling middleware
import { globalErrorHandler, handleUnhandledRoutes } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Built-in middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Cookie parser middleware
app.use(cookieParser());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
  });
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Cartify AI Backend API!",
  });
});


// Import and use user routes
import userRoutes from './routes/users.js';
app.use('/api/users', userRoutes);

// Import and use auth routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);

// Import and use product routes
import productRoutes from './routes/productRoutes.js';
app.use('/api/products', productRoutes);

// Import and use cart routes
import cartRoutes from './routes/cartRoutes.js';
app.use('/api/cart', cartRoutes);

// Import and use admin routes
import adminRoutes from './routes/adminRoutes.js';
app.use('/api/admin', adminRoutes);

// Import and use order routes
import orderRoutes from './routes/orderRoutes.js';
app.use('/api/orders', orderRoutes);

// Import and use chat routes
import chatRoutes from './routes/chatRoutes.js';
app.use('/api/chat', chatRoutes);

// Import and use upload routes
import uploadRoutes from './routes/uploadRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
app.use('/api/cloud', uploadRoutes);
app.use('/api/support', supportRoutes);

// Handle unhandled routes (404)
app.all('*', handleUnhandledRoutes);

// Global error handling middleware
app.use(globalErrorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

export default app;