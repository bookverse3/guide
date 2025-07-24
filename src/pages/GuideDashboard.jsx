import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle, 
  Star, 
  Phone, 
  Mail, 
  MessageSquare,
  AlertCircle,
  Users,
  Award,
  TrendingUp,
  Bell,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const GuideDashboard = () => {
  const { requests, updateRequestStatus, getNotifications, markNotificationAsRead, clearNotifications } = useData();
  const { user } = useAuth();
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Get requests assigned to this guide
  const myAssignments = requests.filter(req => req.assignedGuide === user.id);

  // Load notifications
  useEffect(() => {
    const userNotifications = getNotifications(user.id);
    setNotifications(userNotifications);
  }, [user.id, getNotifications]);

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
      case 'assigned': return 'text-blue-600 bg-blue-100';
      case 'in-progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'assigned': return AlertCircle;
      case 'in-progress': return Users;
      case 'completed': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const handleStatusUpdate = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    setNotification({
      type: 'success',
      message: `Request status updated to ${newStatus}`
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNotificationClick = (notificationId, requestId) => {
    markNotificationAsRead(user.id, notificationId);
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    
    // Find and highlight the related request
    const request = myAssignments.find(req => req.id === requestId);
    if (request) {
      setSelectedRequest(request);
    }
    setShowNotifications(false);
  };

  const handleClearNotifications = () => {
    clearNotifications(user.id);
    setNotifications([]);
    setShowNotifications(false);
  };

  const getDestinationName = (destId) => {
    // This would normally come from destinations data
    const destinationNames = {
      1: 'Everest Base Camp',
      2: 'Pokhara',
      3: 'Chitwan National Park',
      4: 'Kathmandu Valley',
      5: 'Annapurna Circuit',
      6: 'Lumbini'
    };
    return destinationNames[destId] || `Destination ${destId}`;
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
          <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}! 🏔️</h1>
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Bell className="h-6 w-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearNotifications}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id, notification.requestId)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Manage your tour assignments and help tourists explore Nepal</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myAssignments.filter(req => req.status === 'assigned' || req.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myAssignments.filter(req => req.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{user.rating || '4.8'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{user.completedTrips || '95'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Profile Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Guide Profile</h2>
          <div className="flex items-start space-x-6">
            <img 
              src={user.profileImage || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'} 
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-blue-200"
            />
            <div className="flex-1">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Experience</p>
                  <p className="text-gray-900">{user.experience || '5 years'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-900">{user.location || 'Kathmandu'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Languages</p>
                  <p className="text-gray-900">{user.languages?.join(', ') || 'English, Nepali, Hindi'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Specialties</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(user.specialties || ['trekking', 'culture']).map(specialty => (
                      <span key={specialty} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {user.bio && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Bio</p>
                  <p className="text-gray-600 text-sm">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Tour Assignments</h2>
          
          {myAssignments.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
              <p className="text-gray-600">You'll see your tour assignments here once they're assigned by admin</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myAssignments.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const hasUnreadNotification = notifications.some(n => 
                  n.requestId === request.id && !n.read && n.type === 'assignment'
                );
                
                return (
                  <div 
                    key={request.id} 
                    className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                      hasUnreadNotification ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    } ${selectedRequest?.id === request.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    {hasUnreadNotification && (
                      <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-800">New Assignment!</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.touristName}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {request.tourType} Tour
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Assigned: {new Date(request.assignedAt || request.submittedAt).toLocaleDateString()}
                          </p>
                          {request.startDate && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Start Date: {new Date(request.startDate).toLocaleDateString()}
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
                        <Users className="h-4 w-4 mr-2" />
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

                    {/* Tourist Contact Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Tourist Contact Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <p className="text-sm text-blue-700 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {request.touristEmail}
                        </p>
                        {request.emergencyContact && (
                          <p className="text-sm text-blue-700 flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Emergency: {request.emergencyContact}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Selected Destinations */}
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Selected Destinations:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {request.selectedDestinations.map(destId => (
                          <span key={destId} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
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

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      {request.status === 'assigned' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Start Tour
                        </button>
                      )}
                      {request.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'completed')}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Tour
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Tourist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Contact {selectedRequest.touristName}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{selectedRequest.touristEmail}</p>
                  </div>
                </div>
                {selectedRequest.emergencyContact && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                      <p className="text-gray-900">{selectedRequest.emergencyContact}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedRequest.touristEmail}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Click outside to close notifications */}
        {showNotifications && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowNotifications(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;