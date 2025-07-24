import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, Clock, Languages, Camera, Heart, Mountain, ArrowRight, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const RequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destinations, submitRequest } = useData();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    selectedDestinations: location.state?.selectedDestinations || [],
    preferredLanguage: 'English',
    tourType: 'trekking',
    duration: '3-5 days',
    groupSize: '1-2 people',
    specialInterests: [],
    startDate: '',
    budget: 'moderate',
    additionalRequirements: '',
    emergencyContact: '',
    fitnessLevel: 'moderate'
  });

  const totalSteps = 4;

  const tourTypes = [
    { id: 'trekking', name: 'Trekking', icon: Mountain },
    { id: 'culture', name: 'Cultural Tour', icon: Heart },
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'spiritual', name: 'Spiritual Journey', icon: Heart },
    { id: 'photography', name: 'Photography Tour', icon: Camera }
  ];

  const languages = ['English', 'Nepali', 'Hindi', 'German', 'French', 'Japanese', 'Chinese'];
  const durations = ['1-2 days', '3-5 days', '1 week', '2 weeks', '1 month', 'Custom'];
  const groupSizes = ['Solo', '2 people', '3-5 people', '6-10 people', '10+ people'];
  const budgetOptions = ['Budget', 'Moderate', 'Premium', 'Luxury'];
  const fitnessLevels = ['Beginner', 'Moderate', 'Advanced', 'Expert'];
  const specialInterests = [
    'Photography', 'Wildlife', 'Spiritual/Religious', 'Local Culture', 
    'Cuisine', 'History', 'Adventure Sports', 'Meditation'
  ];

  const handleDestinationToggle = (destinationId) => {
    setFormData(prev => ({
      ...prev,
      selectedDestinations: prev.selectedDestinations.includes(destinationId)
        ? prev.selectedDestinations.filter(id => id !== destinationId)
        : [...prev.selectedDestinations, destinationId]
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      specialInterests: prev.specialInterests.includes(interest)
        ? prev.specialInterests.filter(i => i !== interest)
        : [...prev.specialInterests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const requestData = {
      ...formData,
      touristId: user.id,
      touristName: user.name,
      touristEmail: user.email
    };
    
    const newRequest = submitRequest(requestData);
    navigate('/dashboard', { 
      state: { 
        message: 'Your guide request has been submitted successfully! We will match you with a suitable guide soon.',
        requestId: newRequest.id
      }
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedDestinations.length > 0;
      case 2:
        return formData.preferredLanguage && formData.tourType;
      case 3:
        return formData.duration && formData.groupSize && formData.startDate;
      case 4:
        return formData.emergencyContact;
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Destinations</h2>
        <p className="text-gray-600">Select the places you'd like to visit in Nepal</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {destinations.map(destination => (
          <div
            key={destination.id}
            onClick={() => handleDestinationToggle(destination.id)}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-200 ${
              formData.selectedDestinations.includes(destination.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="p-4 flex items-center space-x-4">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{destination.name}</h3>
                <p className="text-sm text-gray-600">{destination.description}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {destination.category}
                </span>
              </div>
              {formData.selectedDestinations.includes(destination.id) && (
                <CheckCircle className="h-6 w-6 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Preferences</h2>
        <p className="text-gray-600">Tell us about your preferred tour style and language</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tour Type</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tourTypes.map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, tourType: type.id }))}
                  className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.tourType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{type.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Language</label>
          <select
            value={formData.preferredLanguage}
            onChange={(e) => setFormData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Special Interests</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {specialInterests.map(interest => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`p-2 text-sm border rounded-md transition-all duration-200 ${
                  formData.specialInterests.includes(interest)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Details</h2>
        <p className="text-gray-600">Provide details about your trip timeline and group</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
          <select
            value={formData.groupSize}
            onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {groupSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            {budgetOptions.map(budget => (
              <option key={budget.toLowerCase()} value={budget.toLowerCase()}>{budget}</option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
          <div className="grid grid-cols-4 gap-2">
            {fitnessLevels.map(level => (
              <button
                key={level.toLowerCase()}
                onClick={() => setFormData(prev => ({ ...prev, fitnessLevel: level.toLowerCase() }))}
                className={`p-3 text-sm border rounded-md transition-all duration-200 ${
                  formData.fitnessLevel === level.toLowerCase()
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h2>
        <p className="text-gray-600">Add any additional requirements and emergency contact</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
          <input
            type="text"
            value={formData.emergencyContact}
            onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
            placeholder="Name and phone number of emergency contact"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
          <textarea
            value={formData.additionalRequirements}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
            placeholder="Any special dietary requirements, accessibility needs, or other preferences..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Summary</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Selected Destinations:</strong> {
              formData.selectedDestinations.length > 0 
                ? formData.selectedDestinations.map(id => 
                    destinations.find(d => d.id === id)?.name
                  ).join(', ')
                : 'None selected'
            }</p>
            <p><strong>Tour Type:</strong> {formData.tourType}</p>
            <p><strong>Duration:</strong> {formData.duration}</p>
            <p><strong>Group Size:</strong> {formData.groupSize}</p>
            <p><strong>Language:</strong> {formData.preferredLanguage}</p>
            <p><strong>Start Date:</strong> {formData.startDate}</p>
            <p><strong>Budget:</strong> {formData.budget}</p>
            <p><strong>Fitness Level:</strong> {formData.fitnessLevel}</p>
            {formData.specialInterests.length > 0 && (
              <p><strong>Special Interests:</strong> {formData.specialInterests.join(', ')}</p>
            )}
            {formData.additionalRequirements && (
              <p><strong>Additional Requirements:</strong> {formData.additionalRequirements}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step !== 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step !== 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Destinations</span>
            <span>Preferences</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;