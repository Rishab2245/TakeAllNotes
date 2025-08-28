const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    // Don't exit process, allow app to continue with fallback
    console.log('Continuing without database connection...');
  }
};

module.exports = connectDB;

