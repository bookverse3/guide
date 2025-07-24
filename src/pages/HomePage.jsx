import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mountain, MapPin, Users, Star, ArrowRight, Heart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { destinations } = useData();
  const { user } = useAuth();
  const [selectedDestinations, setSelectedDestinations] = useState([]);

  const toggleDestination = (destinationId) => {
    setSelectedDestinations(prev => 
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'challenging': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900">
        <div 
          className="absolute inset-0 bg-black bg-opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Mountain className="h-16 w-16 mx-auto mb-6 text-yellow-400" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover the Magic of Nepal
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Connect with expert local guides for unforgettable adventures through the roof of the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link 
                to="/request" 
                className="bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                Plan Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Adventure
                </Link>
                <Link 
                  to="/login" 
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Discover Nepal's Wonders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nepal offers extraordinary diversity - from the world's highest peaks including Mount Everest to ancient temples 
              steeped in history, from thrilling jungle safaris in Chitwan to profound spiritual journeys in sacred sites. 
              Our platform connects you with certified, experienced local guides who possess deep knowledge of Nepal's 
              hidden gems, cultural traditions, and natural wonders, ensuring you experience the authentic beauty and 
              rich heritage of this magnificent Himalayan nation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Mountain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Certified Expert Guides</h3>
              <p className="text-gray-600">Connect with verified, experienced local guides who know every mountain trail, ancient temple, and hidden cultural gem throughout Nepal</p>
            </div>
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Comprehensive Destinations</h3>
              <p className="text-gray-600">From iconic Everest Base Camp treks to UNESCO World Heritage cultural sites, wildlife safaris, and spiritual retreats - explore Nepal's complete spectrum</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Fully Personalized Adventures</h3>
              <p className="text-gray-600">Custom-tailored experiences based on your specific interests, fitness level, group size, budget, and personal preferences for an unforgettable journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Top Destinations</h2>
            <p className="text-xl text-gray-600 mb-8">Choose your dream destinations for an unforgettable journey</p>
            {selectedDestinations.length > 0 && (
              <div className="mb-6">
                <p className="text-lg text-blue-600 mb-4">
                  {selectedDestinations.length} destination{selectedDestinations.length > 1 ? 's' : ''} selected
                </p>
                {user ? (
                  <Link 
                    to="/request" 
                    state={{ selectedDestinations }}
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Request Form
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <Link 
                    to="/register"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Register to Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div 
                key={destination.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedDestinations.includes(destination.id) ? 'ring-4 ring-blue-500' : ''
                }`}
                onClick={() => toggleDestination(destination.id)}
              >
                <div className="relative">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Heart 
                      className={`h-6 w-6 ${
                        selectedDestinations.includes(destination.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-white'
                      }`}
                    />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(destination.difficulty)}`}>
                      {destination.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {destination.category}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready for Your Nepal Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who have discovered the beauty of Nepal with our expert guides
          </p>
          {user ? (
            <Link 
              to="/request" 
              className="inline-flex items-center bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Request Your Guide Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="inline-flex items-center bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;