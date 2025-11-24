// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    // Clean and validate connection string
    let mongoUri = process.env.MONGO_URI;
    
    // Log raw value for debugging (first 50 chars only)
    console.log('Raw MONGO_URI length:', mongoUri.length);
    console.log('Raw MONGO_URI (first 50 chars):', mongoUri.substring(0, 50));
    
    // Remove all leading/trailing whitespace (including newlines, tabs, etc.)
    mongoUri = mongoUri.trim();
    
    // Remove any quotes that might wrap the value
    mongoUri = mongoUri.replace(/^["']+|["']+$/g, '');
    
    // Remove any remaining whitespace
    mongoUri = mongoUri.trim();
    
    // Validate scheme
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      console.error('Invalid URI format. First 30 chars:', JSON.stringify(mongoUri.substring(0, 30)));
      throw new Error(`Invalid MongoDB URI scheme. Must start with 'mongodb://' or 'mongodb+srv://'. Got: ${JSON.stringify(mongoUri.substring(0, 30))}`);
    }
    
    console.log('Attempting to connect to MongoDB...');
    // Remove sensitive info from log
    const uriForLog = mongoUri.replace(/:[^:@]+@/, ':****@');
    console.log('MongoDB URI (sanitized):', uriForLog);
    
    // Connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(mongoUri, options);
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
