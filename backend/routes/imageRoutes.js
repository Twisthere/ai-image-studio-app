const express = require("express");
const { generateImage, modifyImage } = require("../services/geminiService");
const upload = require("../middleware/uploadMiddleware");
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

    // Pass the buffer directly to the modifyImage function
    const imageUrl = await modifyImage(prompt, req.file.buffer);
    res.json({ message: "Image modified successfully", imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const Image = require("../models/Image");
    const images = await Image.find().sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;