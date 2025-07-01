const multer = require('multer');
const { AppError } = require('./errorHandler');

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('Only image files are allowed', 400), false);
  }

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return cb(new AppError('File size too large. Maximum size is 5MB', 400), false);
  }

  cb(null, true);
};

// Configure multer with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter
});

// Error handling wrapper
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File too large. Maximum size is 5MB', 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new AppError('Too many files. Only 1 file allowed', 400));
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return next(new AppError('Unexpected file field', 400));
      }
      return next(new AppError('File upload error', 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = uploadMiddleware;
