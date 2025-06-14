const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ryahya00:2b9bNBI1Y6cSe8RB@cluster0.ufdcrmh.mongodb.net/WrenchWay?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;