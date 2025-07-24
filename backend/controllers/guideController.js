const User = require('../models/User');
const Request = require('../models/Request');

// @desc    Get all guides
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res) => {
  try {
    const {
      available,
      specialties,
      languages,
      location,
      sort = '-rating',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { 
      role: 'guide', 
      isActive: true,
      verificationStatus: 'verified'
    };

    if (available !== undefined) {
      query.available = available === 'true';
    }

    if (specialties) {
      query.specialties = { $in: specialties.split(',') };
    }

    if (languages) {
      query.languages = { $in: languages.split(',') };
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Execute query with pagination
    const guides = await User.find(query)
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: guides.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        guides
      }
    });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guides'
    });
  }
};

// @desc    Get single guide
// @route   GET /api/guides/:id
// @access  Public
const getGuide = async (req, res) => {
  try {
    const guide = await User.findOne({
      _id: req.params.id,
      role: 'guide',
      isActive: true
    }).select('-password');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }

    // Get guide's completed requests for reviews
    const completedRequests = await Request.find({
      assignedGuide: guide._id,
      status: 'completed',
      rating: { $exists: true }
    }).populate('tourist', 'name').select('rating review createdAt tourist');

    res.status(200).json({
      status: 'success',
      data: {
        guide,
        reviews: completedRequests
      }
    });
  } catch (error) {
    console.error('Get guide error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guide'
    });
  }
};

// @desc    Get guide statistics
// @route   GET /api/guides/:id/stats
// @access  Private (Guide/Admin only)
const getGuideStats = async (req, res) => {
  try {
    const guideId = req.params.id;

    // Check permissions
    if (req.user.role === 'guide' && req.user._id.toString() !== guideId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const guide = await User.findOne({
      _id: guideId,
      role: 'guide'
    }).select('-password');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }

    // Get request statistics
    const stats = await Request.aggregate([
      { $match: { assignedGuide: guide._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = {
      assigned: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    // Get monthly earnings (if you implement payment system)
    const monthlyStats = await Request.aggregate([
      {
        $match: {
          assignedGuide: guide._id,
          status: 'completed',
          completedAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$completedAt' },
            month: { $month: '$completedAt' }
          },
          count: { $sum: 1 },
          totalEarnings: { $sum: '$totalCost' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        guide,
        stats: statusCounts,
        monthlyStats,
        totalTrips: guide.completedTrips,
        rating: guide.rating
      }
    });
  } catch (error) {
    console.error('Get guide stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch guide statistics'
    });
  }
};

// @desc    Update guide availability
// @route   PUT /api/guides/:id/availability
// @access  Private (Guide/Admin only)
const updateAvailability = async (req, res) => {
  try {
    const { available } = req.body;
    const guideId = req.params.id;

    // Check permissions
    if (req.user.role === 'guide' && req.user._id.toString() !== guideId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const guide = await User.findOneAndUpdate(
      { _id: guideId, role: 'guide' },
      { available },
      { new: true }
    ).select('-password');

    if (!guide) {
      return res.status(404).json({
        status: 'error',
        message: 'Guide not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Availability updated successfully',
      data: {
        guide
      }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update availability'
    });
  }
};

// @desc    Get available guides for request
// @route   GET /api/guides/available/:requestId
// @access  Private (Admin only)
const getAvailableGuides = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    // Find guides that match request criteria
    const matchingGuides = await User.find({
      role: 'guide',
      isActive: true,
      available: true,
      verificationStatus: 'verified',
      $or: [
        { languages: { $in: [request.preferredLanguage] } },
        { specialties: { $in: [request.tourType] } },
        { specialties: { $in: request.specialInterests || [] } }
      ]
    }).select('-password').sort('-rating');

    res.status(200).json({
      status: 'success',
      results: matchingGuides.length,
      data: {
        guides: matchingGuides,
        request: {
          id: request._id,
          tourType: request.tourType,
          preferredLanguage: request.preferredLanguage,
          specialInterests: request.specialInterests
        }
      }
    });
  } catch (error) {
    console.error('Get available guides error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch available guides'
    });
  }
};

module.exports = {
  getGuides,
  getGuide,
  getGuideStats,
  updateAvailability,
  getAvailableGuides
};