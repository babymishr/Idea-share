const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MongoDB URI found in .env file');
      console.log('💡 App will work without database - data will not persist');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('⚠️  MongoDB connection error:', error.message);
    console.log('💡 App will continue without database');
  }
};

module.exports = connectDB;
