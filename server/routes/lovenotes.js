const express = require('express');
const router = express.Router();
const LoveNote = require('../models/LoveNote');
const { auth } = require('../middleware/auth');

// @route   POST /api/lovenotes
// @desc    Create a new love note
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      content, 
      type, 
      mood, 
      isAnonymous, 
      isScheduled, 
      scheduledFor, 
      tags 
    } = req.body;

    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to create love notes'
      });
    }

    const loveNote = new LoveNote({
      coupleId: req.user.coupleId,
      authorId: req.user._id,
      content,
      type,
      mood,
      isAnonymous,
      isScheduled,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      tags: tags || []
    });

    await loveNote.save();

    res.status(201).json({
      success: true,
      message: '🌸 Love note created successfully',
      data: { loveNote }
    });
  } catch (error) {
    console.error('Create love note error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error creating love note'
    });
  }
});

// @route   GET /api/lovenotes
// @desc    Get all love notes for the couple
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view love notes'
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      type, 
      mood, 
      isDelivered, 
      isRead 
    } = req.query;
    
    const query = { coupleId: req.user.coupleId };

    if (type) {
      query.type = type;
    }
    if (mood) {
      query.mood = mood;
    }
    if (isDelivered !== undefined) {
      query.isDelivered = isDelivered === 'true';
    }
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const loveNotes = await LoveNote.find(query)
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LoveNote.countDocuments(query);

    res.json({
      success: true,
      data: {
        loveNotes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get love notes error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching love notes'
    });
  }
});

// @route   GET /api/lovenotes/random
// @desc    Get a random love note
// @access  Private
router.get('/random', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view love notes'
      });
    }

    const count = await LoveNote.countDocuments({ 
      coupleId: req.user.coupleId,
      isDelivered: true
    });
    
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: '💔 No love notes found'
      });
    }

    const random = Math.floor(Math.random() * count);
    const loveNote = await LoveNote.findOne({ 
      coupleId: req.user.coupleId,
      isDelivered: true
    })
      .populate('authorId', 'name avatar')
      .skip(random);

    res.json({
      success: true,
      data: { loveNote }
    });
  } catch (error) {
    console.error('Get random love note error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching random love note'
    });
  }
});

// @route   GET /api/lovenotes/:id
// @desc    Get a specific love note
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const loveNote = await LoveNote.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId
    }).populate('authorId', 'name avatar');

    if (!loveNote) {
      return res.status(404).json({
        success: false,
        message: '💔 Love note not found'
      });
    }

    res.json({
      success: true,
      data: { loveNote }
    });
  } catch (error) {
    console.error('Get love note error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching love note'
    });
  }
});

// @route   PUT /api/lovenotes/:id/read
// @desc    Mark a love note as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const loveNote = await LoveNote.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId
    });

    if (!loveNote) {
      return res.status(404).json({
        success: false,
        message: '💔 Love note not found'
      });
    }

    loveNote.isRead = true;
    loveNote.readAt = new Date();
    await loveNote.save();

    res.json({
      success: true,
      message: '🌸 Love note marked as read',
      data: { loveNote }
    });
  } catch (error) {
    console.error('Mark love note as read error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error marking love note as read'
    });
  }
});

// @route   POST /api/lovenotes/:id/reaction
// @desc    Add a reaction to a love note
// @access  Private
router.post('/:id/reaction', auth, async (req, res) => {
  try {
    const { emoji } = req.body;

    const loveNote = await LoveNote.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId
    });

    if (!loveNote) {
      return res.status(404).json({
        success: false,
        message: '💔 Love note not found'
      });
    }

    // Check if user already reacted
    const existingReaction = loveNote.reactions.find(
      reaction => reaction.userId.toString() === req.user._id.toString()
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      loveNote.reactions.push({
        userId: req.user._id,
        emoji
      });
    }

    await loveNote.save();

    res.json({
      success: true,
      message: '🌸 Reaction added successfully',
      data: { loveNote }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error adding reaction'
    });
  }
});

// @route   DELETE /api/lovenotes/:id
// @desc    Delete a love note
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const loveNote = await LoveNote.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!loveNote) {
      return res.status(404).json({
        success: false,
        message: '💔 Love note not found or you are not authorized to delete it'
      });
    }

    await LoveNote.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '🌸 Love note deleted successfully'
    });
  } catch (error) {
    console.error('Delete love note error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error deleting love note'
    });
  }
});

module.exports = router;
