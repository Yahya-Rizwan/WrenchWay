const express = require('express');
const {
  getTechnicians,
  getTechnicianById,
  createTechnician,
  updateTechnician,
  deleteTechnician,
  getAvailableTechnicians,
  assignTechnicianToBooking
} = require('../controllers/technicianController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All technician routes require admin access
router.use(protect);
router.use(admin);

router.route('/')
  .get(getTechnicians)
  .post(createTechnician);

router.get('/available', getAvailableTechnicians);
router.put('/assign-booking', assignTechnicianToBooking);

router.route('/:id')
  .get(getTechnicianById)
  .put(updateTechnician)
  .delete(deleteTechnician);

module.exports = router;