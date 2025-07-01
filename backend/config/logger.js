const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTIONS_WORKER_RUNTIME;

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'ai-image-studio-backend' },
  transports: []
});

// Add file transports only if not in serverless environment and logs directory exists or can be created
if (!isServerless) {
  const logsDir = path.join(__dirname, '..', 'logs');

  try {
    // Try to create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Add file transports
    logger.add(new winston.transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' }));
    logger.add(new winston.transports.File({ filename: path.join(logsDir, 'combined.log') }));
  } catch (error) {
    // If we can't create the logs directory, fall back to console only
    console.warn('Could not create logs directory, falling back to console logging:', error.message);
  }
}

// Always add console transport for all environments
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}));

module.exports = logger;
