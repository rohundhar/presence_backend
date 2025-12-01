import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/screentime_app';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};