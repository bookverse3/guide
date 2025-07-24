const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['trekking', 'culture', 'adventure', 'spiritual', 'wildlife', 'photography']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['easy', 'moderate', 'challenging', 'expert']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  altitude: {
    type: Number,
    default: 0
  },
  bestSeason: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  }],
  duration: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 30
    }
  },
  highlights: [{
    type: String
  }],
  requirements: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
destinationSchema.index({ name: 'text', description: 'text' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ difficulty: 1 });
destinationSchema.index({ isActive: 1 });

module.exports = mongoose.model('Destination', destinationSchema);