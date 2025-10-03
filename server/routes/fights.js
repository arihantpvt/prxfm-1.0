const express = require('express');
const router = express.Router();
const Fight = require('../models/Fight');
const Resolution = require('../models/Resolution');
const Couple = require('../models/Couple');
const { auth } = require('../middleware/auth');

// @route   POST /api/fights
// @desc    Log a new fight
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, tags, intensity, mood, occurredAt, triggers, location, duration } = req.body;

    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to log fights'
      });
    }

    const fight = new Fight({
      coupleId: req.user.coupleId,
      authorId: req.user._id,
      title,
      description,
      tags: tags || [],
      intensity,
      mood,
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      triggers: triggers || [],
      location,
      duration: duration || 0
    });

    await fight.save();

    // Update couple's last fight date
    await Couple.findByIdAndUpdate(req.user.coupleId, {
      lastFightDate: fight.occurredAt
    });

    res.status(201).json({
      success: true,
      message: '🌸 Fight logged successfully',
      data: { fight }
    });
  } catch (error) {
    console.error('Log fight error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error logging fight'
    });
  }
});

// @route   GET /api/fights
// @desc    Get all fights for the couple
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view fights'
      });
    }

    const { page = 1, limit = 10, resolved, intensity, mood } = req.query;
    const query = { coupleId: req.user.coupleId };

    if (resolved !== undefined) {
      query.resolved = resolved === 'true';
    }
    if (intensity) {
      query.intensity = parseInt(intensity);
    }
    if (mood) {
      query.mood = mood;
    }

    const fights = await Fight.find(query)
      .populate('authorId', 'name avatar')
      .populate('resolutionId')
      .sort({ occurredAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Fight.countDocuments(query);

    res.json({
      success: true,
      data: {
        fights,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get fights error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching fights'
    });
  }
});

// @route   GET /api/fights/:id
// @desc    Get a specific fight
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const fight = await Fight.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId
    })
      .populate('authorId', 'name avatar')
      .populate('resolutionId');

    if (!fight) {
      return res.status(404).json({
        success: false,
        message: '💔 Fight not found'
      });
    }

    res.json({
      success: true,
      data: { fight }
    });
  } catch (error) {
    console.error('Get fight error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching fight'
    });
  }
});

// @route   PUT /api/fights/:id
// @desc    Update a fight
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, tags, intensity, mood, triggers, location, duration } = req.body;

    const fight = await Fight.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!fight) {
      return res.status(404).json({
        success: false,
        message: '💔 Fight not found or you are not authorized to edit it'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (intensity !== undefined) updateData.intensity = intensity;
    if (mood !== undefined) updateData.mood = mood;
    if (triggers !== undefined) updateData.triggers = triggers;
    if (location !== undefined) updateData.location = location;
    if (duration !== undefined) updateData.duration = duration;

    const updatedFight = await Fight.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('authorId', 'name avatar');

    res.json({
      success: true,
      message: '🌸 Fight updated successfully',
      data: { fight: updatedFight }
    });
  } catch (error) {
    console.error('Update fight error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error updating fight'
    });
  }
});

// @route   DELETE /api/fights/:id
// @desc    Delete a fight
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const fight = await Fight.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!fight) {
      return res.status(404).json({
        success: false,
        message: '💔 Fight not found or you are not authorized to delete it'
      });
    }

    // Delete associated resolution if exists
    if (fight.resolutionId) {
      await Resolution.findByIdAndDelete(fight.resolutionId);
    }

    await Fight.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '🌸 Fight deleted successfully'
    });
  } catch (error) {
    console.error('Delete fight error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error deleting fight'
    });
  }
});

module.exports = router;
