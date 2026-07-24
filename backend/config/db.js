const mongoose = require('mongoose');

/**
 * Connect to MongoDB with retry logic.
 * Reads MONGODB_URI from environment variables.
 * Retries up to 5 times with a 3-second delay between attempts.
 * If MongoDB is unavailable, the server keeps running and reports database status.
 */
const connectDB = async () => {
  const maxRetries = 5;
  const retryDelayMs = 3000;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_management';

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('error', (err) => {
        console.error(`❌ MongoDB connection error: ${err.message}`);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
      });

      return true;
    } catch (error) {
      console.warn(`⚠️ MongoDB connection attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) {
        console.error('⚠️ MongoDB is unavailable. The server will continue running without the database.');
        return false;
      }
      await new Promise((res) => setTimeout(res, retryDelayMs));
    }
  }

  return false;
};

module.exports = connectDB;
