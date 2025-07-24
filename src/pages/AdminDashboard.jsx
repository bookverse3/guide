import React, { useState } from 'react';
import { Users, UserCheck, Clock, CheckCircle, Search, Filter, Eye, UserPlus, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { requests, guides, assignGuide, updateRequestStatus, updateGuide } = useData();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.tourType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'assigned': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleAssignGuide = (requestId, guideId) => {
    assignGuide(requestId, guideId);
    const request = requests.find(r => r.id === requestId);
    const guide = guides.find(g => g.id === guideId);
    
    // Show success message to admin
    if (request && guide) {
      setMessage({ 
        type: 'success', 
        text: `Successfully assigned ${guide.name} to ${request.touristName}'s ${request.tourType} tour. The guide has been notified.` 
      });
    }
    setTimeout(() => setMessage(null), 5000);
    
    setSelectedRequest(null);
    setShowGuideModal(false);
  };
  
  const [message, setMessage] = useState(null);

  const getAvailableGuides = (request) => {
    return guides.filter(guide => {
      const matchesLanguage = guide.languages.includes(request.preferredLanguage);
      const matchesSpecialty = guide.specialties.some(specialty => 
        specialty === request.tourType || 
        request.specialInterests.some(interest => 
          interest.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      return guide.available && (matchesLanguage || matchesSpecialty);
    });
  };

  const renderRequestsTab = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">No guide requests match your current filters</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{request.touristName}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {request.touristEmail}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Tour Type:</span>
                  <p className="text-gray-600 capitalize">{request.tourType}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Duration:</span>
                  <p className="text-gray-600">{request.duration}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Group Size:</span>
                  <p className="text-gray-600">{request.groupSize}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Language:</span>
                  <p className="text-gray-600">{request.preferredLanguage}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className="font-medium text-gray-700 text-sm">Selected Destinations:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {request.selectedDestinations.map(destId => {
                    const destination = request.destinationNames?.find(d => d.id === destId);
                    return (
                      <span key={destId} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {destination?.name || `Destination ${destId}`}
                      </span>
                    );
                  })}
                </div>
              </div>
              
              {request.status === 'pending' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowGuideModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Guide
                  </button>
                </div>
              )}
              
              {request.assignedGuide && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-green-800 mb-2">Assigned Guide</h4>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={guides.find(g => g.id === request.assignedGuide)?.profileImage} 
                      alt="Guide"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-green-700 font-medium">{guides.find(g => g.id === request.assignedGuide)?.name}</p>
                      <p className="text-green-600 text-sm">{guides.find(g => g.id === request.assignedGuide)?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderGuidesTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map(guide => (
          <div key={guide.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={guide.profileImage} 
                  alt={guide.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {guide.location}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                guide.available ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {guide.available ? 'Available' : 'Busy'}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Experience:</span>
                <span className="ml-1 text-gray-600">{guide.experience}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Rating:</span>
                <span className="ml-1 text-gray-600">{guide.rating}/5.0</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Completed Trips:</span>
                <span className="ml-1 text-gray-600">{guide.completedTrips}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Contact:</span>
                <div className="text-gray-600 text-xs mt-1">
                  <p className="flex items-center"><Phone className="h-3 w-3 mr-1" />{guide.phone}</p>
                  <p className="flex items-center"><Mail className="h-3 w-3 mr-1" />{guide.email}</p>
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Languages:</span>
                <p className="text-gray-600">{guide.languages.join(', ')}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="font-medium text-gray-700 text-sm">Specialties:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {guide.specialties.map(specialty => (
                  <span key={specialty} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {guide.bio && (
              <div className="mb-4">
                <span className="font-medium text-gray-700 text-sm">Bio:</span>
                <p className="text-gray-600 text-sm mt-1">{guide.bio}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => updateGuide(guide.id, { available: !guide.available })}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  guide.available 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Mark {guide.available ? 'Unavailable' : 'Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Success Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 
              'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex">
                <CheckCircle className="h-5 w-5 mt-0.5 mr-3" />
                <p>{message.text}</p>
              </div>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage guide requests and assignments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'assigned').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Guides</p>
                <p className="text-2xl font-bold text-gray-900">
                  {guides.filter(g => g.available).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Guides</p>
                <p className="text-2xl font-bold text-gray-900">{guides.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Guide Requests
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'guides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Guides
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'requests' && renderRequestsTab()}
            {activeTab === 'guides' && renderGuidesTab()}
          </div>
        </div>

        {/* Guide Assignment Modal */}
        {showGuideModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Assign Guide for {selectedRequest.touristName}
              </h3>
              
              <div className="space-y-4 mb-6">
                {getAvailableGuides(selectedRequest).map(guide => (
                  <div key={guide.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={guide.profileImage} 
                          alt={guide.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{guide.name}</h4>
                          <p className="text-sm text-gray-600">{guide.location} • {guide.experience}</p>
                          <p className="text-sm text-gray-600">Languages: {guide.languages.join(', ')}</p>
                          <p className="text-sm text-gray-500">Rating: {guide.rating}/5.0 • {guide.completedTrips} trips</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {guide.specialties.map(specialty => (
                              <span key={specialty} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAssignGuide(selectedRequest.id, guide.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                    {guide.bio && (
                      <p className="text-sm text-gray-600 mt-3 pl-15">{guide.bio}</p>
                    )}
                  </div>
                ))}
                
                {getAvailableGuides(selectedRequest).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available guides match the requirements for this request.</p>
                    <p className="text-sm text-gray-400 mt-2">Consider assigning a guide with similar skills or contact the tourist to modify requirements.</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;