const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  services: [{
    type: String,
    required: true,
    trim: true
  }],
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
workshopSchema.index({ "location.latitude": 1, "location.longitude": 1 });

module.exports = mongoose.model('Workshop', workshopSchema);