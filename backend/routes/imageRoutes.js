const express = require("express");
const { generateImage, modifyImage } = require("../services/geminiService");
const upload = require("../middleware/uploadMiddleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const imageUrl = await generateImage(prompt);
    
    res.json({ message: "Image generated successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/modify", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !req.file) return res.status(400).json({ error: "Prompt and image are required" });

    // Create a temporary file from the buffer
    const tempFilePath = path.join(__dirname, "../uploads", "temp_" + Date.now() + ".jpg");
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Write the buffer to a file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    const imageUrl = await modifyImage(prompt, tempFilePath);
    
    // Delete the temporary file after processing
    fs.unlinkSync(tempFilePath);
    
    res.json({ message: "Image modified successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a route to get all images
router.get("/all", async (req, res) => {
  try {
    const Image = require("../models/Image");
    const images = await Image.find().sort({ createdAt: -1 });
    
    // Images are already stored with Cloudinary URLs
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;