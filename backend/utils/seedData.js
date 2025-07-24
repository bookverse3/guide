const mongoose = require('mongoose');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Request = require('../models/Request');
require('dotenv').config();

const destinations = [
  {
    name: 'Everest Base Camp',
    description: 'Trek to the base of the world\'s highest mountain',
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    category: 'trekking',
    difficulty: 'challenging',
    location: 'Solukhumbu District',
    altitude: 5364,
    bestSeason: ['autumn', 'spring'],
    duration: { min: 12, max: 16 },
    highlights: ['Mount Everest views', 'Sherpa culture', 'Sagarmatha National Park'],
    requirements: ['Good physical fitness', 'Trekking experience', 'Proper gear']
  },
  {
    name: 'Pokhara',
    description: 'Beautiful lakeside city with stunning mountain views',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
    category: 'culture',
    difficulty: 'easy',
    location: 'Kaski District',
    altitude: 822,
    bestSeason: ['autumn', 'winter', 'spring'],
    duration: { min: 2, max: 5 },
    highlights: ['Phewa Lake', 'Annapurna views', 'Adventure activities'],
    requirements: ['Basic fitness level']
  },
  {
    name: 'Chitwan National Park',
    description: 'Wildlife safari and jungle adventures',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
    category: 'adventure',
    difficulty: 'moderate',
    location: 'Chitwan District',
    altitude: 150,
    bestSeason: ['autumn', 'winter', 'spring'],
    duration: { min: 2, max: 4 },
    highlights: ['Royal Bengal Tiger', 'One-horned Rhinoceros', 'Elephant safari'],
    requirements: ['Basic fitness', 'Comfortable with wildlife']
  },
  {
    name: 'Kathmandu Valley',
    description: 'Historic temples and cultural heritage sites',
    image: 'https://images.pexels.com/photos/1829980/pexels-photo-1829980.jpeg',
    category: 'culture',
    difficulty: 'easy',
    location: 'Kathmandu District',
    altitude: 1400,
    bestSeason: ['autumn', 'winter', 'spring'],
    duration: { min: 2, max: 7 },
    highlights: ['UNESCO World Heritage Sites', 'Ancient temples', 'Local markets'],
    requirements: ['Interest in culture and history']
  },
  {
    name: 'Annapurna Circuit',
    description: 'Classic trek through diverse landscapes',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg',
    category: 'trekking',
    difficulty: 'moderate',
    location: 'Annapurna Region',
    altitude: 5416,
    bestSeason: ['autumn', 'spring'],
    duration: { min: 15, max: 21 },
    highlights: ['Thorong La Pass', 'Diverse landscapes', 'Local culture'],
    requirements: ['Good fitness', 'Trekking experience']
  },
  {
    name: 'Lumbini',
    description: 'Birthplace of Buddha - spiritual journey',
    image: 'https://images.pexels.com/photos/8847840/pexels-photo-8847840.jpeg',
    category: 'spiritual',
    difficulty: 'easy',
    location: 'Rupandehi District',
    altitude: 150,
    bestSeason: ['autumn', 'winter', 'spring'],
    duration: { min: 1, max: 3 },
    highlights: ['Maya Devi Temple', 'Buddhist monasteries', 'Peace Pagoda'],
    requirements: ['Interest in spirituality and Buddhism']
  }
];

const users = [
  {
    name: 'Demo Tourist',
    email: 'tourist@demo.com',
    password: 'demo123',
    phone: '+977-9841234567',
    country: 'United States',
    role: 'tourist'
  },
  {
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    phone: '+977-9851234568',
    country: 'Nepal',
    role: 'admin'
  },
  {
    name: 'Pemba Sherpa',
    email: 'pemba@guide.com',
    password: 'guide123',
    phone: '+977-9841234567',
    country: 'Nepal',
    role: 'guide',
    specialties: ['trekking', 'mountaineering'],
    languages: ['English', 'Nepali', 'Tibetan'],
    experience: '8 years',
    rating: 4.9,
    available: true,
    location: 'Everest Region',
    bio: 'Experienced mountain guide with extensive knowledge of Everest region.',
    completedTrips: 156,
    verificationStatus: 'verified',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    name: 'Sita Gurung',
    email: 'sita@guide.com',
    password: 'guide123',
    phone: '+977-9851234568',
    country: 'Nepal',
    role: 'guide',
    specialties: ['culture', 'photography'],
    languages: ['English', 'Nepali', 'German'],
    experience: '5 years',
    rating: 4.8,
    available: true,
    location: 'Pokhara',
    bio: 'Cultural heritage specialist and photography guide.',
    completedTrips: 89,
    verificationStatus: 'verified',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  {
    name: 'Demo Guide',
    email: 'guide@demo.com',
    password: 'demo123',
    phone: '+977-9841234567',
    country: 'Nepal',
    role: 'guide',
    specialties: ['trekking', 'culture'],
    languages: ['English', 'Nepali', 'Hindi'],
    experience: '5 years',
    rating: 4.8,
    available: true,
    location: 'Kathmandu',
    bio: 'Experienced guide specializing in cultural tours and trekking adventures.',
    completedTrips: 95,
    verificationStatus: 'verified',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Request.deleteMany({});
    console.log('Cleared existing data');

    // Create destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log(`Created ${createdDestinations.length} destinations`);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Find specific users for creating requests
    const demoTourist = createdUsers.find(u => u.email === 'tourist@demo.com');
    const demoGuide = createdUsers.find(u => u.email === 'guide@demo.com');
    const everestDestination = createdDestinations.find(d => d.name === 'Everest Base Camp');
    const pokharaDestination = createdDestinations.find(d => d.name === 'Pokhara');

    // Create sample requests
    const sampleRequests = [
      {
        tourist: demoTourist._id,
        touristName: demoTourist.name,
        touristEmail: demoTourist.email,
        selectedDestinations: [
          { destination: everestDestination._id, name: everestDestination.name },
          { destination: pokharaDestination._id, name: pokharaDestination.name }
        ],
        preferredLanguage: 'English',
        tourType: 'trekking',
        duration: '1 week',
        groupSize: '2 people',
        specialInterests: ['Photography', 'Culture'],
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        budget: 'moderate',
        additionalRequirements: 'Vegetarian meals preferred',
        emergencyContact: 'John Doe +1-555-0123',
        fitnessLevel: 'moderate',
        status: 'assigned',
        assignedGuide: demoGuide._id,
        assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    const createdRequests = await Request.insertMany(sampleRequests);
    console.log(`Created ${createdRequests.length} sample requests`);

    console.log('✅ Database seeded successfully!');
    console.log('\nDemo Accounts:');
    console.log('Tourist: tourist@demo.com / demo123');
    console.log('Admin: admin@demo.com / admin123');
    console.log('Guide: guide@demo.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;