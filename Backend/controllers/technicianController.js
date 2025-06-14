const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Private/Admin
const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' })
      .select('-password')
      .sort({ name: 1 });

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get technician profile
// @route   GET /api/technicians/:id
// @access  Private/Admin
const getTechnicianById = async (req, res) => {
  try {
    const technician = await User.findOne({ 
      _id: req.params.id, 
      role: 'technician' 
    }).select('-password');

    if (technician) {
      // Get technician's booking stats
      const totalBookings = await Booking.countDocuments({ technician: req.params.id });
      const completedBookings = await Booking.countDocuments({ 
        technician: req.params.id, 
        status: 'completed' 
      });
      const activeBookings = await Booking.countDocuments({ 
        technician: req.params.id, 
        status: { $in: ['confirmed', 'in-progress'] }
      });

      res.json({
        ...technician.toObject(),
        stats: {
          totalBookings,
          completedBookings,
          activeBookings
        }
      });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create technician profile
// @route   POST /api/technicians
// @access  Private/Admin
const createTechnician = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      certifications
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const technician = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'technician',
      profile: {
        specialization,
        experience,
        certifications: certifications || []
      }
    });

    if (technician) {
      res.status(201).json({
        _id: technician._id,
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        role: technician.role,
        profile: technician.profile
      });
    }
  } catch (error) {
    res.status(400).json({ message: 'Technician creation failed', error: error.message });
  }
};

// @desc    Update technician profile
// @route   PUT /api/technicians/:id
// @access  Private/Admin
const updateTechnician = async (req, res) => {
  try {
    const technician = await User.findOne({ 
      _id: req.params.id, 
      role: 'technician' 
    });

    if (technician) {
      technician.name = req.body.name || technician.name;
      technician.phone = req.body.phone || technician.phone;
      
      if (req.body.profile) {
        technician.profile = {
          ...technician.profile,
          ...req.body.profile
        };
      }

      const updatedTechnician = await technician.save();
      res.json({
        _id: updatedTechnician._id,
        name: updatedTechnician.name,
        email: updatedTechnician.email,
        phone: updatedTechnician.phone,
        role: updatedTechnician.role,
        profile: updatedTechnician.profile
      });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Delete technician
// @route   DELETE /api/technicians/:id
// @access  Private/Admin
const deleteTechnician = async (req, res) => {
  try {
    // Check if technician has active bookings
    const activeBookings = await Booking.countDocuments({
      technician: req.params.id,
      status: { $in: ['confirmed', 'in-progress'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete technician with active bookings' 
      });
    }

    const technician = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'technician' 
    });

    if (technician) {
      res.json({ message: 'Technician removed successfully' });
    } else {
      res.status(404).json({ message: 'Technician not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available technicians for a service
// @route   GET /api/technicians/available
// @access  Private/Admin
const getAvailableTechnicians = async (req, res) => {
  try {
    const { date, time } = req.query;

    // Get all technicians
    let technicians = await User.find({ role: 'technician' })
      .select('-password');

    // If date and time provided, filter by availability
    if (date && time) {
      const requestedDate = new Date(date);
      
      // Get technicians who don't have bookings at that time
      const busyTechnicians = await Booking.find({
        scheduledDate: {
          $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
        },
        scheduledTime: time,
        status: { $in: ['confirmed', 'in-progress'] }
      }).distinct('technician');

      technicians = technicians.filter(tech => 
        !busyTechnicians.includes(tech._id)
      );
    }

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign technician to booking
// @route   PUT /api/technicians/assign-booking
// @access  Private/Admin
const assignTechnicianToBooking = async (req, res) => {
  try {
    const { bookingId, technicianId } = req.body;

    const booking = await Booking.findById(bookingId);
    const technician = await User.findOne({ 
      _id: technicianId, 
      role: 'technician' 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }

    booking.technician = technicianId;
    booking.status = 'confirmed';
    await booking.save();

    const updatedBooking = await Booking.findById(bookingId)
      .populate('customer', 'name email phone')
      .populate('service', 'name category')
      .populate('technician', 'name phone');

    res.json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Assignment failed', error: error.message });
  }
};

module.exports = {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  getAvailableTechnicians,
  assignTechnicianToBooking
};