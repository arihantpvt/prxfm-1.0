const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://arihant:arigau22@prxfm.li92ib6.mongodb.net/?retryWrites=true&w=majority&appName=prxfm');

    console.log(`🌸 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('💔 Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
