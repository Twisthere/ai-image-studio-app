const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: { type: String, enum: ["generated", "modified"], required: true },
  prompt: { type: String, required: true },
  imagePath: { type: String, required: true }, // This will now store Cloudinary URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Image", ImageSchema);