const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '💔 No token provided, access denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '💔 Invalid token, user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false, 
      message: '💔 Invalid token' 
    });
  }
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'hDoTNdTKx6vhPTKSc0HUTb52bSf1DJ773nNVNjOzPQloar5Kb2SQgZPa8aTGMH9mi5jLWaCmJor3j4B_s6TgIA',
    { expiresIn: '365d' }
  );
};

module.exports = { auth, generateToken };
