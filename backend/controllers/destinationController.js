const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const destinations = await Destination.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Destination.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: destinations.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        destinations
      }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch destinations'
    });
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        status: 'error',
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        destination
      }
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch destination'
    });
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private (Admin only)
const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Destination created successfully',
      data: {
        destination
      }
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create destination'
    });
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private (Admin only)
const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!destination) {
      return res.status(404).json({
        status: 'error',
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Destination updated successfully',
      data: {
        destination
      }
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update destination'
    });
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private (Admin only)
const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        status: 'error',
        message: 'Destination not found'
      });
    }

    // Soft delete - mark as inactive
    destination.isActive = false;
    await destination.save();

    res.status(200).json({
      status: 'success',
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete destination'
    });
  }
};

// @desc    Get destination categories
// @route   GET /api/destinations/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Destination.distinct('category', { isActive: true });

    res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
};

module.exports = {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  getCategories
};