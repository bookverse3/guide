const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tourist ID is required']
  },
  touristName: {
    type: String,
    required: [true, 'Tourist name is required']
  },
  touristEmail: {
    type: String,
    required: [true, 'Tourist email is required']
  },
  selectedDestinations: [{
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }],
  preferredLanguage: {
    type: String,
    required: [true, 'Preferred language is required'],
    default: 'English'
  },
  tourType: {
    type: String,
    required: [true, 'Tour type is required'],
    enum: ['trekking', 'culture', 'adventure', 'spiritual', 'photography']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  groupSize: {
    type: String,
    required: [true, 'Group size is required']
  },
  specialInterests: [{
    type: String
  }],
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date
  },
  budget: {
    type: String,
    required: [true, 'Budget is required'],
    enum: ['budget', 'moderate', 'premium', 'luxury']
  },
  additionalRequirements: {
    type: String,
    maxlength: [1000, 'Additional requirements cannot exceed 1000 characters']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required']
  },
  fitnessLevel: {
    type: String,
    required: [true, 'Fitness level is required'],
    enum: ['beginner', 'moderate', 'advanced', 'expert']
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  totalCost: {
    type: Number,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
requestSchema.index({ tourist: 1 });
requestSchema.index({ assignedGuide: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ startDate: 1 });
requestSchema.index({ createdAt: -1 });

// Populate destinations and guide info
requestSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'selectedDestinations.destination',
    select: 'name description image category difficulty'
  }).populate({
    path: 'assignedGuide',
    select: 'name email phone profileImage specialties languages experience rating location'
  }).populate({
    path: 'tourist',
    select: 'name email phone country'
  });
  next();
});

// Calculate end date based on duration
requestSchema.pre('save', function(next) {
  if (this.startDate && this.duration && !this.endDate) {
    const durationMap = {
      '1-2 days': 2,
      '3-5 days': 5,
      '1 week': 7,
      '2 weeks': 14,
      '1 month': 30,
      'custom': 7 // default for custom
    };
    
    const days = durationMap[this.duration] || 7;
    this.endDate = new Date(this.startDate.getTime() + (days * 24 * 60 * 60 * 1000));
  }
  next();
});

module.exports = mongoose.model('Request', requestSchema);