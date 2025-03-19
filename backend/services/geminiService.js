const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const Image = require("../models/Image");
const { cloudinary } = require("../config/cloudinary");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage(prompt) {
  try {
    // Initialize the Gemini model with image generation capabilities
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
    });

    // Generate the image
    const response = await model.generateContent(prompt);
    let imageUrl = null;

    // Process the response to extract the generated image
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        // Get the base64 image data
        const imageData = part.inlineData.data;
        
        // Upload the base64 image to Cloudinary
        const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageData}`, {
          folder: "ai-image-studio/generated",
          resource_type: "image"
        });
        
        imageUrl = result.secure_url;
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Save to database
    const newImage = new Image({
      type: "generated",
      prompt,
      imagePath: imageUrl
    });
    await newImage.save();
    
    return imageUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to generate image: " + error.message);
  }
}

async function modifyImage(prompt, imagePath) {
  try {
    // Read the image from file
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    // Prepare the content parts
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg', // adjust based on your file type
          data: base64Image
        }
      }
    ];

    // Initialize the Gemini model with image generation capabilities
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
    });

    // Generate the modified image
    const response = await model.generateContent(contents);
    let imageUrl = null;

    // Process the response to extract the modified image
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        // Get the base64 image data
        const imageData = part.inlineData.data;
        
        // Upload the base64 image to Cloudinary
        const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageData}`, {
          folder: "ai-image-studio/modified",
          resource_type: "image"
        });
        
        imageUrl = result.secure_url;
      }
    }

    if (!imageUrl) {
      throw new Error("Failed to modify image");
    }

    // Save to database
    const newImage = new Image({
      type: "modified",
      prompt,
      imagePath: imageUrl
    });
    await newImage.save();
    
    return imageUrl;
  } catch (error) {
    console.error("Image modification error:", error);
    throw new Error("Failed to modify image: " + error.message);
  }
}

module.exports = { generateImage, modifyImage };