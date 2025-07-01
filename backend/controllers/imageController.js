const { generateImage, modifyImage, deleteImage } = require('../services/geminiService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const logger = require('../config/logger');
const Image = require('../models/Image');

// @desc    Generate a new image
// @route   POST /api/image/generate
// @access  Public
const generateNewImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  logger.info(`Image generation requested with prompt: ${prompt.substring(0, 50)}...`);

  const imageUrl = await generateImage(prompt);

  logger.info('Image generated successfully', { imageUrl });

  res.status(201).json({
    success: true,
    message: 'Image generated successfully',
    data: { imageUrl }
  });
});

// @desc    Modify an existing image
// @route   POST /api/image/modify
// @access  Public
const modifyExistingImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    throw new AppError('Image file is required', 400);
  }

  logger.info(`Image modification requested with prompt: ${prompt.substring(0, 50)}...`);

  const imageUrl = await modifyImage(prompt, imageFile.buffer);

  logger.info('Image modified successfully', { imageUrl });

  res.status(201).json({
    success: true,
    message: 'Image modified successfully',
    data: { imageUrl }
  });
});

// @desc    Get all images
// @route   GET /api/image/all
// @access  Public
const getAllImages = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;

  const query = {};
  if (type && ['generated', 'modified'].includes(type)) {
    query.type = type;
  }

  const skip = (page - 1) * limit;

  const images = await Image.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await Image.countDocuments(query);

  logger.info(`Retrieved ${images.length} images from database`);

  res.json({
    success: true,
    data: images,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: parseInt(limit)
    }
  });
});

// @desc    Delete an image
// @route   DELETE /api/image/:id
// @access  Public
const deleteImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Image deletion requested for ID: ${id}`);

  const result = await deleteImage(id);

  logger.info('Image deleted successfully', { id });

  res.json({
    success: true,
    message: 'Image deleted successfully',
    data: result
  });
});

// @desc    Get image by ID
// @route   GET /api/image/:id
// @access  Public
const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = await Image.findById(id).select('-__v');

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  logger.info(`Retrieved image by ID: ${id}`);

  res.json({
    success: true,
    data: image
  });
});

module.exports = {
  generateNewImage,
  modifyExistingImage,
  getAllImages,
  deleteImageById,
  getImageById
};
