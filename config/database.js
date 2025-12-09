const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ideashare', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('📦 Database: ' + conn.connection.name);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.log('⚠️  Using in-memory storage instead');
    console.log('💡 To use MongoDB: Set up MongoDB Atlas or install MongoDB locally');
    return false;
  }
};

module.exports = connectDB;
