const express = require("express");
const rateLimit = require('express-rate-limit');
const {
  generateNewImage,
  modifyExistingImage,
  getAllImages,
  deleteImageById,
  getImageById
} = require("../controllers/imageController");
const {
  validateImageGeneration,
  validateImageModification,
  validateImageId
} = require("../middleware/validation");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

// Rate limiting for image generation and modification
const imageGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    error: 'Too many image generation requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const imageModificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  message: {
    success: false,
    error: 'Too many image modification requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
router.post("/generate",
  imageGenerationLimiter,
  validateImageGeneration,
  generateNewImage
);

router.post("/modify",
  imageModificationLimiter,
  uploadMiddleware,
  validateImageModification,
  modifyExistingImage
);

router.get("/all", getAllImages);

router.get("/:id",
  validateImageId,
  getImageById
);

router.delete("/:id",
  validateImageId,
  deleteImageById
);

module.exports = router;
