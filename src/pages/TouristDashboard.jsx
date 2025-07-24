import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, Clock, CheckCircle, User, MapPin, Calendar, AlertCircle, Phone, Mail, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const TouristDashboard = () => {
  const { requests, guides, destinations } = useData();
  const { user } = useAuth();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  const userRequests = requests.filter(req => req.touristId === user.id);

  useEffect(() => {
    if (location.state?.message) {
      setNotification({
        type: 'success',
        message: location.state.message
      });
      setTimeout(() => setNotification(null), 5000);
    }
  }, [location.state]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'assigned': return CheckCircle;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getAssignedGuide = (guideId) => {
    return guides.find(guide => guide.id === guideId);
  };

  const getDestinationName = (destId) => {
    const destination = destinations.find(d => d.id === destId);
    return destination ? destination.name : `Destination ${destId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <CheckCircle className="h-5 w-5 mt-0.5 mr-3" />
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 🏔️</h1>
          <p className="text-gray-600 mt-2">Manage your guide requests and plan your next adventure in Nepal</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Guides</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'assigned').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userRequests.filter(req => req.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <Link 
            to="/request"
            className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-white"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">New Request</p>
              <p className="text-lg font-bold">Plan Adventure</p>
            </div>
          </Link>
        </div>

        {/* My Requests */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Guide Requests</h2>
            <Link 
              to="/request"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Link>
          </div>
          
          {userRequests.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-600 mb-6">Start your Nepal adventure by requesting a guide</p>
              <Link 
                to="/request"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Request Guide
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const assignedGuide = request.assignedGuide ? getAssignedGuide(request.assignedGuide) : null;
                
                return (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {request.tourType} Tour
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Submitted on {new Date(request.submittedAt).toLocaleDateString()}
                          </p>
                          {request.startDate && (
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              Preferred start: {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {request.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {request.groupSize}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {request.selectedDestinations.length} destinations
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        Budget: {request.budget}
                      </div>
                    </div>

                    {/* Selected Destinations */}
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Selected Destinations:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {request.selectedDestinations.map(destId => (
                          <span key={destId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {getDestinationName(destId)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {request.specialInterests && request.specialInterests.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Special Interests:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {request.specialInterests.map((interest, index) => (
                            <span key={interest} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.additionalRequirements && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Additional Requirements:</span>
                        <p className="text-sm text-gray-600 mt-1">{request.additionalRequirements}</p>
                      </div>
                    )}
                    
                    {assignedGuide && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Your Assigned Guide
                        </h4>
                        <div className="flex items-start space-x-4">
                          <img 
                            src={assignedGuide.profileImage} 
                            alt={assignedGuide.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-green-800 text-lg">{assignedGuide.name}</p>
                            <p className="text-sm text-green-600 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {assignedGuide.experience} experience • {assignedGuide.location}
                            </p>
                            <p className="text-sm text-green-600">
                              Languages: {assignedGuide.languages.join(', ')}
                            </p>
                            <p className="text-sm text-green-600 flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {assignedGuide.rating}/5.0 • {assignedGuide.completedTrips} completed trips
                            </p>
                            
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-green-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {assignedGuide.phone}
                              </p>
                              <p className="text-sm text-green-600 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {assignedGuide.email}
                              </p>
                            </div>

                            <div className="mt-2">
                              <span className="text-sm font-medium text-green-700">Specialties:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {assignedGuide.specialties.map(specialty => (
                                  <span key={specialty} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {assignedGuide.bio && (
                              <p className="text-sm text-green-700 mt-2 italic">"{assignedGuide.bio}"</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === 'pending' && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <Clock className="h-4 w-4 inline mr-1" />
                          Your request is being reviewed. We'll assign a suitable guide soon!
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More Destinations</h3>
            <p className="text-gray-600 mb-4">Discover amazing places in Nepal for your next adventure</p>
            <Link 
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View Destinations
              <MapPin className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">Contact our support team for assistance with your bookings</p>
            <Link 
              to="/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Update Profile
              <User className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;