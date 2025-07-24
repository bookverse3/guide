const express = require('express');
const {
  createRequest,
  getRequests,
  getRequest,
  assignGuide,
  updateRequestStatus,
  addReview
} = require('../controllers/requestController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Tourist routes
router.post('/', restrictTo('tourist'), createRequest);
router.put('/:id/review', restrictTo('tourist'), addReview);

// Guide routes
router.put('/:id/status', restrictTo('guide', 'admin'), updateRequestStatus);

// Admin routes
router.put('/:id/assign', restrictTo('admin'), assignGuide);

// Common routes (role-based access handled in controller)
router.get('/', getRequests);
router.get('/:id', getRequest);

module.exports = router;