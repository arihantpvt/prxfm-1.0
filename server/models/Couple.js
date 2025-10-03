const mongoose = require('mongoose');

const CoupleSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  loveStartDate: {
    type: Date,
    required: [true, 'Love start date is required']
  },
  promises: [{
    text: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    kept: {
      type: Boolean,
      default: false
    },
    keptAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  loveStreak: {
    type: Number,
    default: 0
  },
  lastFightDate: Date,
  totalResolutions: {
    type: Number,
    default: 0
  },
  settings: {
    loveJarEnabled: {
      type: Boolean,
      default: true
    },
    moodTracking: {
      type: Boolean,
      default: true
    },
    analyticsEnabled: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Virtual for relationship duration
CoupleSchema.virtual('relationshipDuration').get(function() {
  const now = new Date();
  const start = this.loveStartDate;
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for success rate
CoupleSchema.virtual('successRate').get(function() {
  if (this.totalResolutions === 0) return 0;
  return Math.round((this.totalResolutions / (this.totalResolutions + 1)) * 100);
});

module.exports = mongoose.model('Couple', CoupleSchema);
