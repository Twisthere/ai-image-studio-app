const { body, param, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

// Validation rules for image generation
const validateImageGeneration = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Prompt must be between 1 and 1000 characters'),
  handleValidationErrors
];

// Validation rules for image modification
const validateImageModification = [
  body('prompt')
    .trim()
    .notEmpty()
    .withMessage('Prompt is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Prompt must be between 1 and 1000 characters'),
  handleValidationErrors
];

// Validation rules for image ID parameter
const validateImageId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid image ID format'),
  handleValidationErrors
];

module.exports = {
  validateImageGeneration,
  validateImageModification,
  validateImageId,
  handleValidationErrors
};
