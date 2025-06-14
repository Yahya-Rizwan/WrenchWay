const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      service,
      scheduledDate,
      scheduledTime,
      customerAddress,
      customerPhone,
      notes,
      urgency
    } = req.body;

    // Check if service exists
    const serviceExists = await Service.findById(service);
    if (!serviceExists) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = new Booking({
      customer: req.user.id,
      service,
      scheduledDate,
      scheduledTime,
      customerAddress,
      customerPhone,
      notes,
      urgency: urgency || 'normal',
      totalAmount: serviceExists.basePrice,
      status: 'pending'
    });

    const createdBooking = await booking.save();
    const populatedBooking = await Booking.findById(createdBooking._id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category basePrice estimatedDuration');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Booking creation failed', error: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('service', 'name category basePrice')
      .populate('technician', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookings (Admin/Technician)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.status
      ? { status: req.query.status }
      : {};

    const count = await Booking.countDocuments({ ...keyword });
    const bookings = await Booking.find({ ...keyword })
      .populate('customer', 'name email phone')
      .populate('service', 'name category basePrice')
      .populate('technician', 'name phone')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      bookings,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('service', 'name category basePrice estimatedDuration')
      .populate('technician', 'name phone email');

    if (booking) {
      // Check if user owns this booking or is admin/technician
      if (booking.customer._id.toString() !== req.user.id && 
          req.user.role !== 'admin' && 
          req.user.role !== 'technician') {
        return res.status(403).json({ message: 'Access denied' });
      }
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin/Technician
const updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status || booking.status;
      if (notes) booking.notes = notes;
      
      // If assigning technician
      if (req.body.technician) {
        booking.technician = req.body.technician;
      }

      // If marking as completed
      if (status === 'completed') {
        booking.completedAt = Date.now();
      }

      const updatedBooking = await booking.save();
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('customer', 'name email phone')
        .populate('service', 'name category basePrice')
        .populate('technician', 'name phone');

      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Check if user owns this booking or is admin
      if (booking.customer.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Only allow cancellation if booking is pending or confirmed
      if (booking.status === 'in-progress' || booking.status === 'completed') {
        return res.status(400).json({ message: 'Cannot cancel booking in current status' });
      }

      booking.status = 'cancelled';
      booking.cancelledAt = Date.now();
      await booking.save();

      res.json({ message: 'Booking cancelled successfully' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get technician's assigned bookings
// @route   GET /api/bookings/technician/assigned
// @access  Private/Technician
const getTechnicianBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ technician: req.user.id })
      .populate('customer', 'name email phone')
      .populate('service', 'name category basePrice')
      .sort({ scheduledDate: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getTechnicianBookings
};