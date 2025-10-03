const mongoose = require('mongoose');

const LoveNoteSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Love note content is required'],
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['love', 'apology', 'surprise', 'quote', 'promise', 'memory', 'gratitude'],
    default: 'love'
  },
  mood: {
    type: String,
    enum: ['😊', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟', '🎉', '💖', '😌', '😇'],
    default: '💕'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  scheduledFor: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      enum: ['❤️', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟', '🎉', '💖']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
LoveNoteSchema.index({ coupleId: 1, createdAt: -1 });
LoveNoteSchema.index({ authorId: 1, createdAt: -1 });
LoveNoteSchema.index({ isDelivered: 1, scheduledFor: 1 });
LoveNoteSchema.index({ type: 1, coupleId: 1 });

// Virtual for type description
LoveNoteSchema.virtual('typeDescription').get(function() {
  const descriptions = {
    'love': 'Love Note',
    'apology': 'Apology',
    'surprise': 'Surprise',
    'quote': 'Quote',
    'promise': 'Promise',
    'memory': 'Memory',
    'gratitude': 'Gratitude'
  };
  return descriptions[this.type] || 'Unknown';
});

// Virtual for time since creation
LoveNoteSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

module.exports = mongoose.model('LoveNote', LoveNoteSchema);
