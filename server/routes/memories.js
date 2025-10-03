const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const { auth } = require('../middleware/auth');

// @route   POST /api/memories
// @desc    Create a new memory
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { 
      type, 
      content, 
      title, 
      description, 
      tags, 
      mood, 
      isPrivate, 
      location, 
      memoryDate, 
      fileSize, 
      fileType, 
      duration 
    } = req.body;

    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to create memories'
      });
    }

    const memory = new Memory({
      coupleId: req.user.coupleId,
      authorId: req.user._id,
      type,
      content,
      title,
      description,
      tags: tags || [],
      mood,
      isPrivate,
      location,
      memoryDate: memoryDate ? new Date(memoryDate) : new Date(),
      fileSize,
      fileType,
      duration
    });

    await memory.save();

    res.status(201).json({
      success: true,
      message: '🌸 Memory created successfully',
      data: { memory }
    });
  } catch (error) {
    console.error('Create memory error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error creating memory'
    });
  }
});

// @route   GET /api/memories
// @desc    Get all memories for the couple
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view memories'
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      type, 
      mood, 
      isFavorite, 
      isPrivate, 
      startDate, 
      endDate 
    } = req.query;
    
    const query = { coupleId: req.user.coupleId };

    if (type) {
      query.type = type;
    }
    if (mood) {
      query.mood = mood;
    }
    if (isFavorite !== undefined) {
      query.isFavorite = isFavorite === 'true';
    }
    if (isPrivate !== undefined) {
      query.isPrivate = isPrivate === 'true';
    }
    if (startDate || endDate) {
      query.memoryDate = {};
      if (startDate) query.memoryDate.$gte = new Date(startDate);
      if (endDate) query.memoryDate.$lte = new Date(endDate);
    }

    const memories = await Memory.find(query)
      .populate('authorId', 'name avatar')
      .sort({ memoryDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Memory.countDocuments(query);

    res.json({
      success: true,
      data: {
        memories,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get memories error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching memories'
    });
  }
});

// @route   GET /api/memories/random
// @desc    Get a random memory
// @access  Private
router.get('/random', auth, async (req, res) => {
  try {
    if (!req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You must be in a couple to view memories'
      });
    }

    const count = await Memory.countDocuments({ coupleId: req.user.coupleId });
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: '💔 No memories found'
      });
    }

    const random = Math.floor(Math.random() * count);
    const memory = await Memory.findOne({ coupleId: req.user.coupleId })
      .populate('authorId', 'name avatar')
      .skip(random);

    res.json({
      success: true,
      data: { memory }
    });
  } catch (error) {
    console.error('Get random memory error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching random memory'
    });
  }
});

// @route   GET /api/memories/:id
// @desc    Get a specific memory
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId
    }).populate('authorId', 'name avatar');

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: '💔 Memory not found'
      });
    }

    res.json({
      success: true,
      data: { memory }
    });
  } catch (error) {
    console.error('Get memory error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error fetching memory'
    });
  }
});

// @route   PUT /api/memories/:id
// @desc    Update a memory
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      tags, 
      mood, 
      isPrivate, 
      isFavorite, 
      location 
    } = req.body;

    const memory = await Memory.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: '💔 Memory not found or you are not authorized to edit it'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (mood !== undefined) updateData.mood = mood;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (location !== undefined) updateData.location = location;

    const updatedMemory = await Memory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('authorId', 'name avatar');

    res.json({
      success: true,
      message: '🌸 Memory updated successfully',
      data: { memory: updatedMemory }
    });
  } catch (error) {
    console.error('Update memory error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error updating memory'
    });
  }
});

// @route   DELETE /api/memories/:id
// @desc    Delete a memory
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      coupleId: req.user.coupleId,
      authorId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: '💔 Memory not found or you are not authorized to delete it'
      });
    }

    await Memory.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: '🌸 Memory deleted successfully'
    });
  } catch (error) {
    console.error('Delete memory error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error deleting memory'
    });
  }
});

module.exports = router;
