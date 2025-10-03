const mongoose = require('mongoose');

const FightSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Fight title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Fight description is required'],
    trim: true,
    maxlength: 1000
  },
  tags: [{
    type: String,
    trim: true
  }],
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  mood: {
    type: String,
    required: true,
    enum: ['😢', '😡', '😔', '😤', '😰', '😞', '😠', '😭', '😤', '😓']
  },
  occurredAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resolution'
  },
  triggers: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
FightSchema.index({ coupleId: 1, occurredAt: -1 });
FightSchema.index({ authorId: 1, occurredAt: -1 });

// Virtual for intensity description
FightSchema.virtual('intensityDescription').get(function() {
  const descriptions = {
    1: 'Minor disagreement',
    2: 'Small argument',
    3: 'Moderate conflict',
    4: 'Serious fight',
    5: 'Major crisis'
  };
  return descriptions[this.intensity] || 'Unknown';
});

// Virtual for mood description
FightSchema.virtual('moodDescription').get(function() {
  const descriptions = {
    '😢': 'Sad',
    '😡': 'Angry',
    '😔': 'Disappointed',
    '😤': 'Frustrated',
    '😰': 'Anxious',
    '😞': 'Upset',
    '😠': 'Mad',
    '😭': 'Crying',
    '😓': 'Stressed'
  };
  return descriptions[this.mood] || 'Unknown';
});

module.exports = mongoose.model('Fight', FightSchema);
