const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getTechnicianBookings
} = require('../controllers/bookingController');
const { protect, admin, adminOrTechnician } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);

// Technician routes
router.get('/technician/assigned', getTechnicianBookings);

// Admin routes
router.get('/', admin, getAllBookings);

// Shared routes (customer owns booking OR admin/technician)
router.route('/:id')
  .get(getBookingById)
  .delete(cancelBooking);

// Admin/Technician routes
router.put('/:id/status', adminOrTechnician, updateBookingStatus);

module.exports = router;