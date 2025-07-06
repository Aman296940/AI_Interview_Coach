// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
