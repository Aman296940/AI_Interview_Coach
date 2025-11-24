// server/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import { refresh } from './controllers/authController.js';

const app = express();

// Middleware - CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

// Add Vercel URL pattern matching (for preview deployments)
const isVercelUrl = (origin) => {
  if (!origin) return false;
  return origin.includes('.vercel.app') || origin.includes('vercel.app');
};

// CORS Configuration - Must be before other middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(`CORS: Allowing origin from allowed list: ${origin}`);
      return callback(null, true);
    }
    
    // Allow Vercel URLs (for production and preview deployments)
    if (isVercelUrl(origin)) {
      console.log(`CORS: Allowing Vercel origin: ${origin}`);
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      console.log(`CORS: Allowing origin in development: ${origin}`);
      return callback(null, true);
    }
    
    // Log blocked origin for debugging
    console.warn(`CORS: Blocked origin: ${origin}`);
    console.warn(`CORS: Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
// Note: refresh-token route is already defined in authRoutes

app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Coach API is running!' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler - Must be after all routes
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server and connect to database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // Start server anyway - it can handle DB connection errors gracefully
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (Database connection failed)`);
      console.error('Warning: Database is not connected. Some features may not work.');
    });
  }
};

startServer();
