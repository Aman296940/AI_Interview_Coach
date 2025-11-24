// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    console.log('Attempting to connect to MongoDB...');
    // Remove sensitive info from log
    const uriForLog = process.env.MONGO_URI.replace(/:[^:@]+@/, ':****@');
    console.log('MongoDB URI:', uriForLog);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    console.error('Full error:', err);
    // Don't exit - let the server start and handle errors gracefully
    throw err;
  }
};

export default connectDB;
