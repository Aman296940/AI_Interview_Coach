// server/server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import { refresh } from './controllers/authController.js';

const app = express();

// Connect to MongoDB
console.log("Attempting to connect to MongoDB with URI:", process.env.MONGO_URI);
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.post('/api/auth/refresh-token', refresh);

app.get('/', (req, res) => {
  res.json({ message: 'AI Interview Coach API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});
