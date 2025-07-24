const express = require('express');
const {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getCategories
} = require('../controllers/destinationController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getDestinations);
router.get('/:id', getDestination);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createDestination);
router.put('/:id', updateDestination);
router.delete('/:id', deleteDestination);

module.exports = router;