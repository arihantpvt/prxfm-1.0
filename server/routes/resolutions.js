const express = require('express');
const router = express.Router();
const Resolution = require('../models/Resolution');
const Fight = require('../models/Fight');
const Couple = require('../models/Couple');
const { auth } = require('../middleware/auth');

// @route   POST /api/resolutions
// @desc    Create a resolution for a fight
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      fightId, 
      summary, 
      steps, 
      outcomeRating, 
      resolutionType, 
      lessonsLearned, 
      followUpActions, 
      moodAfter, 
      aiSuggestions 
    } = req.body;

    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to create resolutions'
      });
    }

    // Check if fight exists and belongs to the couple
    const fight = await Fight.findOne({
      _id: fightId,
      coupleId: req.user.coupleId
    });

    if (!fight) {
      return res.status(404).json({
        success: false,
        message: '💔 Fight not found'
      });
    }

    // Check if fight already has a resolution
    if (fight.resolutionId) {
      return res.status(400).json({
        success: false,
        message: '💔 This fight already has a resolution'
      });
    }

    const resolution = new Resolution({
      fightId,
      coupleId: req.user.coupleId,
      authorId: req.user._id,
      summary,
      steps,
      outcomeRating,
      resolutionType,
      lessonsLearned: lessonsLearned || [],
      followUpActions: followUpActions || [],
      moodAfter,
      aiSuggestions: aiSuggestions || []
    });

    await resolution.save();

    // Update fight with resolution
    fight.resolutionId = resolution._id;
    fight.resolved = true;
    await fight.save();

    // Update couple's resolution count
    await Couple.findByIdAndUpdate(req.user.coupleId, {
      $inc: { totalResolutions: 1 }
    });

    res.status(201).json({
      success: true,
      message: '🌸 Resolution created successfully',
      data: { resolution }
    });
  } catch (error) {
    console.error('Create resolution error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error creating resolution'
    });
  }
});

// @route   GET /api/resolutions/:fightId
// @desc    Get resolution for a specific fight
// @access  Private
router.get('/:fightId', auth, async (req, res) => {
  try {
    const resolution = await Resolution.findOne({
      fightId: req.params.fightId,
      coupleId: req.user.coupleId
    }).populate('authorId', 'name avatar');

    if (!resolution) {
      return res.status(404).json({
        success: false,
        message: '💔 Resolution not found'
      });
    }

    res.json({
      success: true,
      data: { resolution }
    });
  } catch (error) {
    console.error('Get resolution error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching resolution'
    });
  }
});

// @route   PUT /api/resolutions/:id
// @desc    Update a resolution
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      summary, 
      steps, 
      outcomeRating, 
      resolutionType, 
      lessonsLearned, 
      followUpActions, 
      moodAfter, 
      isSuccessful 
    } = req.body;

    const resolution = await Resolution.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!resolution) {
      return res.status(404).json({
        success: false,
        message: '💔 Resolution not found or you are not authorized to edit it'
      });
    }

    const updateData = {};
    if (summary !== undefined) updateData.summary = summary;
    if (steps !== undefined) updateData.steps = steps;
    if (outcomeRating !== undefined) updateData.outcomeRating = outcomeRating;
    if (resolutionType !== undefined) updateData.resolutionType = resolutionType;
    if (lessonsLearned !== undefined) updateData.lessonsLearned = lessonsLearned;
    if (followUpActions !== undefined) updateData.followUpActions = followUpActions;
    if (moodAfter !== undefined) updateData.moodAfter = moodAfter;
    if (isSuccessful !== undefined) updateData.isSuccessful = isSuccessful;

    const updatedResolution = await Resolution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('authorId', 'name avatar');

    res.json({
      success: true,
      message: '🌸 Resolution updated successfully',
      data: { resolution: updatedResolution }
    });
  } catch (error) {
    console.error('Update resolution error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error updating resolution'
    });
  }
});

// @route   GET /api/resolutions
// @desc    Get all resolutions for the couple
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view resolutions'
      });
    }

    const { page = 1, limit = 10, resolutionType, outcomeRating } = req.query;
    const query = { coupleId: req.user.coupleId };

    if (resolutionType) {
      query.resolutionType = resolutionType;
    }
    if (outcomeRating) {
      query.outcomeRating = parseInt(outcomeRating);
    }

    const resolutions = await Resolution.find(query)
      .populate('authorId', 'name avatar')
      .populate('fightId', 'title description intensity mood occurredAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resolution.countDocuments(query);

    res.json({
      success: true,
      data: {
        resolutions,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get resolutions error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching resolutions'
    });
  }
});

module.exports = router;
