const mongoose = require('mongoose');

const ResolutionSchema = new mongoose.Schema({
  fightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fight',
    required: true
  },
  coupleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Couple',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    type: String,
    required: [true, 'Resolution summary is required'],
    trim: true,
    maxlength: 500
  },
  steps: {
    type: String,
    required: [true, 'Resolution steps are required'],
    trim: true,
    maxlength: 1000
  },
  outcomeRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  resolutionType: {
    type: String,
    enum: ['apology', 'compromise', 'understanding', 'forgiveness', 'communication', 'other'],
    default: 'communication'
  },
  lessonsLearned: [{
    type: String,
    trim: true
  }],
  followUpActions: [{
    action: {
      type: String,
      trim: true
    },
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  moodAfter: {
    type: String,
    enum: ['😊', '😌', '😇', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟'],
    default: '😊'
  },
  aiSuggestions: [{
    type: String,
    trim: true
  }],
  isSuccessful: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
ResolutionSchema.index({ coupleId: 1, createdAt: -1 });
ResolutionSchema.index({ fightId: 1 });

// Virtual for outcome description
ResolutionSchema.virtual('outcomeDescription').get(function() {
  const descriptions = {
    1: 'Very poor',
    2: 'Poor',
    3: 'Fair',
    4: 'Good',
    5: 'Excellent'
  };
  return descriptions[this.outcomeRating] || 'Unknown';
});

// Virtual for resolution type description
ResolutionSchema.virtual('resolutionTypeDescription').get(function() {
  const descriptions = {
    'apology': 'Apology & Forgiveness',
    'compromise': 'Mutual Compromise',
    'understanding': 'Better Understanding',
    'forgiveness': 'Forgiveness',
    'communication': 'Improved Communication',
    'other': 'Other Method'
  };
  return descriptions[this.resolutionType] || 'Unknown';
});

module.exports = mongoose.model('Resolution', ResolutionSchema);
