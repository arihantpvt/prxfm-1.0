const express = require('express');
const router = express.Router();
const Fight = require('../models/Fight');
const Resolution = require('../models/Resolution');
const Memory = require('../models/Memory');
const LoveNote = require('../models/LoveNote');
const Couple = require('../models/Couple');
const { auth } = require('../middleware/auth');

// @route   GET /api/analytics
// @desc    Get comprehensive analytics for the couple
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view analytics'
      });
    }

    const coupleId = req.user.coupleId;
    const { period = '6months' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '1month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    }

    // Get couple info
    const couple = await Couple.findById(coupleId);

    // Fight analytics
    const totalFights = await Fight.countDocuments({ coupleId });
    const resolvedFights = await Fight.countDocuments({ coupleId, resolved: true });
    const fightsThisPeriod = await Fight.countDocuments({ 
      coupleId, 
      occurredAt: { $gte: startDate } 
    });

    // Fight intensity distribution
    const intensityStats = await Fight.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$intensity', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Mood distribution
    const moodStats = await Fight.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly fight trends
    const monthlyFights = await Fight.aggregate([
      { $match: { coupleId: coupleId, occurredAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$occurredAt' },
            month: { $month: '$occurredAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Resolution analytics
    const totalResolutions = await Resolution.countDocuments({ coupleId });
    const resolutionStats = await Resolution.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$outcomeRating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const resolutionTypeStats = await Resolution.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$resolutionType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Memory analytics
    const totalMemories = await Memory.countDocuments({ coupleId });
    const memoryTypeStats = await Memory.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const favoriteMemories = await Memory.countDocuments({ 
      coupleId, 
      isFavorite: true 
    });

    // Love note analytics
    const totalLoveNotes = await LoveNote.countDocuments({ coupleId });
    const loveNoteTypeStats = await LoveNote.aggregate([
      { $match: { coupleId: coupleId } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Streak calculations
    const lastFight = await Fight.findOne({ coupleId })
      .sort({ occurredAt: -1 });
    
    const daysSinceLastFight = lastFight 
      ? Math.floor((now - lastFight.occurredAt) / (1000 * 60 * 60 * 24))
      : 0;

    // Success rate calculation
    const successRate = totalFights > 0 ? Math.round((resolvedFights / totalFights) * 100) : 0;

    // Most common fight triggers
    const triggerStats = await Fight.aggregate([
      { $match: { coupleId: coupleId } },
      { $unwind: '$triggers' },
      { $group: { _id: '$triggers', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // AI suggestions for improvement
    const aiSuggestions = generateAISuggestions({
      totalFights,
      successRate,
      intensityStats,
      moodStats,
      triggerStats,
      daysSinceLastFight
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalFights,
          resolvedFights,
          fightsThisPeriod,
          totalResolutions,
          totalMemories,
          totalLoveNotes,
          successRate,
          daysSinceLastFight,
          relationshipDuration: couple.relationshipDuration,
          loveStreak: couple.loveStreak
        },
        fights: {
          intensityStats,
          moodStats,
          monthlyFights,
          triggerStats
        },
        resolutions: {
          resolutionStats,
          resolutionTypeStats
        },
        memories: {
          memoryTypeStats,
          favoriteMemories
        },
        loveNotes: {
          loveNoteTypeStats
        },
        aiSuggestions
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching analytics'
    });
  }
});

// Helper function to generate AI suggestions
function generateAISuggestions(data) {
  const suggestions = [];

  if (data.successRate < 70) {
    suggestions.push({
      type: 'resolution',
      title: 'Improve Conflict Resolution',
      message: 'Your resolution success rate is below 70%. Try focusing on communication and understanding each other\'s perspectives.',
      emoji: '💬'
    });
  }

  if (data.daysSinceLastFight < 7) {
    suggestions.push({
      type: 'frequency',
      title: 'Recent Conflicts',
      message: 'You\'ve had conflicts recently. Consider taking time to reconnect and strengthen your bond.',
      emoji: '🤗'
    });
  }

  if (data.intensityStats.some(stat => stat._id >= 4)) {
    suggestions.push({
      type: 'intensity',
      title: 'High Intensity Conflicts',
      message: 'You\'ve had some intense conflicts. Consider implementing cooling-off periods and active listening techniques.',
      emoji: '🧘'
    });
  }

  if (data.triggerStats.length > 0) {
    const topTrigger = data.triggerStats[0];
    suggestions.push({
      type: 'triggers',
      title: 'Common Trigger',
      message: `"${topTrigger._id}" seems to be a common trigger. Consider discussing this topic proactively to prevent conflicts.`,
      emoji: '🎯'
    });
  }

  if (data.daysSinceLastFight > 30) {
    suggestions.push({
      type: 'positive',
      title: 'Great Streak!',
      message: 'Amazing! You\'ve gone over a month without conflicts. Keep up the great communication!',
      emoji: '🌟'
    });
  }

  return suggestions;
}

module.exports = router;