import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri || uri.includes('<username>')) {
      console.warn('⚠️ MongoDB URI is missing or invalid in .env. Server will run without DB connectivity.');
      return;
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    // Do not exit process, let the server stay alive for frontend requests
  }
};

export default connectDB;
