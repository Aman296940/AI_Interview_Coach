import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    let mongoUri = process.env.MONGO_URI.trim();
    mongoUri = mongoUri.replace(/^["']+|["']+$/g, '').trim();
    
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI scheme');
    }
    
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(mongoUri, options);
    console.log('MongoDB Connected');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    return true;
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    throw err;
  }
};

export default connectDB;
