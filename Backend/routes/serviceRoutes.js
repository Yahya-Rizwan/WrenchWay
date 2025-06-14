const express = require('express');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesByCategory
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

// Admin routes
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;