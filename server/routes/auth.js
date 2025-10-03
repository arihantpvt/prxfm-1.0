const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Couple = require('../models/Couple');
const { generateToken, auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, coupleCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '💔 User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // If coupleCode is provided, join existing couple
    if (coupleCode) {
      const couple = await Couple.findOne({ _id: coupleCode });
      if (couple && couple.users.length < 2) {
        couple.users.push(user._id);
        user.coupleId = couple._id;
        await couple.save();
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: '🌸 User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          coupleId: user.coupleId
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '💔 Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: '💔 Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: '🌸 Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          coupleId: user.coupleId,
          preferences: user.preferences
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('coupleId', 'loveStartDate loveStreak totalResolutions');

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error'
    });
  }
});

// @route   POST /api/auth/create-couple
// @desc    Create a new couple
// @access  Private
router.post('/create-couple', auth, async (req, res) => {
  try {
    const { loveStartDate } = req.body;

    // Check if user is already in a couple
    if (req.user.coupleId) {
      return res.status(400).json({
        success: false,
        message: '💔 You are already in a couple'
      });
    }

    // Create new couple
    const couple = new Couple({
      users: [req.user._id],
      loveStartDate: new Date(loveStartDate)
    });

    await couple.save();

    // Update user's coupleId
    req.user.coupleId = couple._id;
    await req.user.save();

    res.status(201).json({
      success: true,
      message: '🌸 Couple created successfully',
      data: {
        coupleId: couple._id,
        coupleCode: couple._id // For partner to join
      }
    });
  } catch (error) {
    console.error('Create couple error:', error);
    res.status(500).json({
      success: false,
      message: '💔 Server error creating couple'
    });
  }
});

module.exports = router;
