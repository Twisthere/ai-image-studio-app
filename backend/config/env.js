require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./logger");

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
      // bufferCommands: false // Removed for debugging
    };

    logger.info('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoURI, options);
    logger.info('MongoDB connection established.');

    logger.info("MongoDB connected successfully", {
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port
    });

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
