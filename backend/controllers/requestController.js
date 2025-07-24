const Request = require('../models/Request');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Notification = require('../models/Notification');

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (Tourist only)
const createRequest = async (req, res) => {
  try {
    const {
      selectedDestinations,
      preferredLanguage,
      tourType,
      duration,
      groupSize,
      specialInterests,
      startDate,
      budget,
      additionalRequirements,
      emergencyContact,
      fitnessLevel
    } = req.body;

    // Validate destinations
    const destinationIds = selectedDestinations.map(dest => 
      typeof dest === 'object' ? dest.destination : dest
    );
    
    const destinations = await Destination.find({
      _id: { $in: destinationIds },
      isActive: true
    });

    if (destinations.length !== destinationIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more selected destinations are invalid'
      });
    }

    // Format destinations for request
    const formattedDestinations = destinations.map(dest => ({
      destination: dest._id,
      name: dest.name
    }));

    // Create request
    const request = await Request.create({
      tourist: req.user._id,
      touristName: req.user.name,
      touristEmail: req.user.email,
      selectedDestinations: formattedDestinations,
      preferredLanguage,
      tourType,
      duration,
      groupSize,
      specialInterests: specialInterests || [],
      startDate,
      budget,
      additionalRequirements,
      emergencyContact,
      fitnessLevel
    });

    // Notify admins about new request
    const admins = await User.find({ role: 'admin', isActive: true });
    
    for (const admin of admins) {
      await Notification.createNotification({
        recipient: admin._id,
        type: 'system',
        title: 'New Guide Request',
        message: `${req.user.name} has submitted a new ${tourType} tour request`,
        relatedRequest: request._id,
        relatedUser: req.user._id,
        priority: 'medium'
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Request submitted successfully',
      data: {
        request
      }
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to create request'
    });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
  try {
    const {
      status,
      tourType,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query based on user role
    let query = {};

    if (req.user.role === 'tourist') {
      query.tourist = req.user._id;
    } else if (req.user.role === 'guide') {
      query.assignedGuide = req.user._id;
    }
    // Admin can see all requests

    // Add filters
    if (status) {
      query.status = status;
    }

    if (tourType) {
      query.tourType = tourType;
    }

    // Execute query with pagination
    const requests = await Request.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Request.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: requests.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        requests
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch requests'
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'tourist' && request.tourist.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    if (req.user.role === 'guide' && request.assignedGuide?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        request
      }
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch request'
    });
  }
};

// @desc    Assign guide to request
// @route   PUT /api/requests/:id/assign
// @access  Private (Admin only)
const assignGuide = async (req, res) => {
  try {
    const { guideId } = req.body;

    if (!guideId) {
      return res.status(400).json({
        status: 'error',
        message: 'Guide ID is required'
      });
    }

    // Validate guide
    const guide = await User.findOne({
      _id: guideId,
      role: 'guide',
      isActive: true,
      available: true
    });

    if (!guide) {
      return res.status(400).json({
        status: 'error',
        message: 'Guide not found or not available'
      });
    }

    // Update request
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        assignedGuide: guideId,
        status: 'assigned',
        assignedAt: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    // Mark guide as unavailable
    guide.available = false;
    await guide.save();

    // Notify guide about assignment
    await Notification.createNotification({
      recipient: guideId,
      type: 'assignment',
      title: 'New Tour Assignment!',
      message: `You have been assigned to ${request.touristName}'s ${request.tourType} tour`,
      relatedRequest: request._id,
      relatedUser: request.tourist,
      priority: 'high'
    });

    // Notify tourist about assignment
    await Notification.createNotification({
      recipient: request.tourist,
      type: 'assignment',
      title: 'Guide Assigned!',
      message: `${guide.name} has been assigned as your guide for the ${request.tourType} tour`,
      relatedRequest: request._id,
      relatedUser: guideId,
      priority: 'high'
    });

    res.status(200).json({
      status: 'success',
      message: 'Guide assigned successfully',
      data: {
        request
      }
    });
  } catch (error) {
    console.error('Assign guide error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to assign guide'
    });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Guide/Admin only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Status is required'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'guide' && request.assignedGuide?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Update status
    request.status = status;

    if (status === 'completed') {
      request.completedAt = new Date();
      
      // Mark guide as available again
      if (request.assignedGuide) {
        const guide = await User.findById(request.assignedGuide);
        if (guide) {
          guide.available = true;
          guide.completedTrips = (guide.completedTrips || 0) + 1;
          await guide.save();
        }
      }
    }

    await request.save();

    // Notify tourist about status change
    await Notification.createNotification({
      recipient: request.tourist,
      type: 'status_update',
      title: 'Tour Status Updated',
      message: `Your ${request.tourType} tour status has been updated to ${status}`,
      relatedRequest: request._id,
      priority: 'medium'
    });

    res.status(200).json({
      status: 'success',
      message: 'Request status updated successfully',
      data: {
        request
      }
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update request status'
    });
  }
};

// @desc    Add review to completed request
// @route   PUT /api/requests/:id/review
// @access  Private (Tourist only)
const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Request not found'
      });
    }

    // Check permissions
    if (request.tourist.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only review completed tours'
      });
    }

    // Update request with review
    request.rating = rating;
    request.review = review;
    await request.save();

    // Update guide's rating
    if (request.assignedGuide) {
      const guide = await User.findById(request.assignedGuide);
      if (guide) {
        // Calculate new average rating
        const allRatings = await Request.find({
          assignedGuide: guide._id,
          rating: { $exists: true }
        }).select('rating');

        const totalRating = allRatings.reduce((sum, req) => sum + req.rating, 0);
        const avgRating = totalRating / allRatings.length;

        guide.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
        await guide.save();
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Review added successfully',
      data: {
        request
      }
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to add review'
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequest,
  assignGuide,
  updateRequestStatus,
  addReview
};