const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ryahya00:2b9bNBI1Y6cSe8RB@cluster0.ufdcrmh.mongodb.net/WrenchWay?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Basic route to check server
app.get('/', (req, res) => {
  res.send('🚀 API is running...');
});

app.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
});