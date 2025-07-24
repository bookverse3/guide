const express = require('express');
const {
  getGuides,
  getGuide,
  getGuideStats,
  updateAvailability,
  getAvailableGuides
} = require('../controllers/guideController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getGuides);
router.get('/:id', getGuide);

// Protected routes
router.use(protect);

// Guide/Admin routes
router.get('/:id/stats', restrictTo('guide', 'admin'), getGuideStats);
router.put('/:id/availability', restrictTo('guide', 'admin'), updateAvailability);

// Admin only routes
router.get('/available/:requestId', restrictTo('admin'), getAvailableGuides);

module.exports = router;