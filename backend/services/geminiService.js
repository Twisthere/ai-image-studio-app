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

// Helper function to upload buffer directly to Cloudinary
async function uploadToCloudinary(imageBuffer) {
  const base64Image = imageBuffer.toString('base64');
  const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
    folder: "ai-image-studio/modified",
    resource_type: "image"
  });
  return result.secure_url;
}

// Example implementation for modifyImage in geminiService.js
async function modifyImage(prompt, imageBuffer) {
  try {
    // Initialize the Gemini model for image editing
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ['Text', 'Image']
      },
    });

    // Convert buffer to base64 for Gemini API
    const base64Image = imageBuffer.toString('base64');
    
    // Create the content parts array with the image and prompt
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/png"
      }
    };
    
    // Prepare the prompt for image modification
    const fullPrompt = `Modify this image according to the following instructions: ${prompt}`;
    
    // Generate the modified image
    const response = await model.generateContent([imagePart, fullPrompt]);
    let modifiedImageUrl = null;
    
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
        
        modifiedImageUrl = result.secure_url;
      }
    }

    if (!modifiedImageUrl) {
      throw new Error("Failed to modify image");
    }

    // Save to database
    const newImage = new Image({
      type: "modified",
      prompt,
      imagePath: modifiedImageUrl
    });
    await newImage.save();
    
    return modifiedImageUrl;
  } catch (error) {
    console.error("Image modification error:", error);
    throw new Error("Failed to modify image: " + error.message);
  }
}

// Function to delete an image from both database and Cloudinary
async function deleteImage(imageId) {
  try {
    // Find the image in the database
    const image = await Image.findById(imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    // Extract the Cloudinary public ID from the URL
    // Cloudinary URLs are typically like: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public-id.jpg
    const urlParts = image.imagePath.split('/');
    // Get the filename including the folder path after the /upload/ part
    const publicIdWithExtension = urlParts.slice(urlParts.indexOf('upload') + 1).join('/');
    // Remove file extension to get the public ID
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete the image from the database
    await Image.findByIdAndDelete(imageId);

    return { success: true, id: imageId };
  } catch (error) {
    console.error("Image deletion error:", error);
    throw new Error("Failed to delete image: " + error.message);
  }
}

module.exports = { generateImage, modifyImage, deleteImage };