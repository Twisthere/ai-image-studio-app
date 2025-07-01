const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["generated", "modified"],
    required: true,
    index: true
  },
  prompt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  imagePath: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https:\/\/res\.cloudinary\.com\//.test(v);
      },
      message: 'Image path must be a valid Cloudinary URL'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient querying
ImageSchema.index({ type: 1, createdAt: -1 });

// Virtual for formatted date
ImageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Static method to get images by type with pagination
ImageSchema.statics.getByType = function(type, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ type })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');
};

// Instance method to get public data
ImageSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  return {
    id: obj._id,
    type: obj.type,
    prompt: obj.prompt,
    imagePath: obj.imagePath,
    createdAt: obj.createdAt,
    formattedDate: obj.formattedDate
  };
};

module.exports = mongoose.model("Image", ImageSchema);
