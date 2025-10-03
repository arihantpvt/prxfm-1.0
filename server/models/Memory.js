const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['text', 'photo', 'voice', 'video'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Memory content is required']
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  mood: {
    type: String,
    enum: ['😊', '🥰', '😍', '🤗', '😘', '💕', '✨', '🌟', '🎉', '💖', '😌', '😇'],
    default: '😊'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  memoryDate: {
    type: Date,
    default: Date.now
  },
  fileSize: {
    type: Number // in bytes
  },
  fileType: {
    type: String
  },
  duration: {
    type: Number // in seconds for audio/video
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better query performance
MemorySchema.index({ coupleId: 1, memoryDate: -1 });
MemorySchema.index({ authorId: 1, memoryDate: -1 });
MemorySchema.index({ type: 1, coupleId: 1 });
MemorySchema.index({ isFavorite: 1, coupleId: 1 });

// Virtual for file size in human readable format
MemorySchema.virtual('fileSizeFormatted').get(function() {
  if (!this.fileSize) return 'N/A';
  
  const bytes = this.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for duration in human readable format
MemorySchema.virtual('durationFormatted').get(function() {
  if (!this.duration) return 'N/A';
  
  const seconds = this.duration;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
});

module.exports = mongoose.model('Memory', MemorySchema);
