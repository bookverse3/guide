import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialDestinations = [
  {
    id: 1,
    name: 'Everest Base Camp',
    description: 'Trek to the base of the world\'s highest mountain',
    image: 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg',
    category: 'trekking',
    difficulty: 'challenging'
  },
  {
    id: 2,
    name: 'Pokhara',
    description: 'Beautiful lakeside city with stunning mountain views',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg',
    category: 'culture',
    difficulty: 'easy'
  },
  {
    id: 3,
    name: 'Chitwan National Park',
    description: 'Wildlife safari and jungle adventures',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
    category: 'adventure',
    difficulty: 'moderate'
  },
  {
    id: 4,
    name: 'Kathmandu Valley',
    description: 'Historic temples and cultural heritage sites',
    image: 'https://images.pexels.com/photos/1829980/pexels-photo-1829980.jpeg',
    category: 'culture',
    difficulty: 'easy'
  },
  {
    id: 5,
    name: 'Annapurna Circuit',
    description: 'Classic trek through diverse landscapes',
    image: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg',
    category: 'trekking',
    difficulty: 'moderate'
  },
  {
    id: 6,
    name: 'Lumbini',
    description: 'Birthplace of Buddha - spiritual journey',
    image: 'https://images.pexels.com/photos/8847840/pexels-photo-8847840.jpeg',
    category: 'spiritual',
    difficulty: 'easy'
  }
];

const initialGuides = [
  {
    id: 1,
    name: 'Pemba Sherpa',
    specialties: ['trekking', 'mountaineering'],
    languages: ['English', 'Nepali', 'Tibetan'],
    experience: '8 years',
    rating: 4.9,
    available: true,
    location: 'Everest Region',
    phone: '+977-9841234567',
    email: 'pemba.sherpa@guide.com',
    bio: 'Experienced mountain guide with extensive knowledge of Everest region. Certified mountaineering instructor.',
    completedTrips: 156,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    id: 2,
    name: 'Sita Gurung',
    specialties: ['culture', 'photography'],
    languages: ['English', 'Nepali', 'German'],
    experience: '5 years',
    rating: 4.8,
    available: true,
    location: 'Pokhara',
    phone: '+977-9851234568',
    email: 'sita.gurung@guide.com',
    bio: 'Cultural heritage specialist and photography guide. Expert in Nepali traditions and customs.',
    completedTrips: 89,
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  {
    id: 3,
    name: 'Raj Thapa',
    specialties: ['wildlife', 'adventure'],
    languages: ['English', 'Nepali', 'Hindi'],
    experience: '6 years',
    rating: 4.7,
    available: false,
    location: 'Chitwan',
    phone: '+977-9861234569',
    email: 'raj.thapa@guide.com',
    bio: 'Wildlife expert and adventure guide specializing in jungle safaris and nature photography.',
    completedTrips: 112,
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
  },
  {
    id: 4,
    name: 'Maya Tamang',
    specialties: ['spiritual', 'culture', 'meditation'],
    languages: ['English', 'Nepali', 'Tibetan', 'Hindi'],
    experience: '7 years',
    rating: 4.9,
    available: true,
    location: 'Kathmandu Valley',
    phone: '+977-9871234570',
    email: 'maya.tamang@guide.com',
    bio: 'Spiritual guide and meditation teacher with deep knowledge of Buddhist and Hindu traditions.',
    completedTrips: 134,
    profileImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
  },
  {
    id: 5,
    name: 'Karma Lama',
    specialties: ['trekking', 'adventure', 'photography'],
    languages: ['English', 'Nepali', 'Tibetan', 'Chinese'],
    experience: '9 years',
    rating: 4.8,
    available: true,
    location: 'Annapurna Region',
    phone: '+977-9881234571',
    email: 'karma.lama@guide.com',
    bio: 'High-altitude trekking specialist with expertise in Annapurna and Manaslu circuits.',
    completedTrips: 178,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  }
];

export const DataProvider = ({ children }) => {
  const [destinations] = useState(initialDestinations);
  const [guides, setGuides] = useState(() => {
    const stored = localStorage.getItem('nepal_guide_guides');
    return stored ? JSON.parse(stored) : initialGuides;
  });
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem('nepal_guide_requests');
    return stored ? JSON.parse(stored) : generateDemoRequests();
  });

  // Generate demo requests with some assigned to demo guide
  function generateDemoRequests() {
    const demoRequests = [
      {
        id: 'demo-request-1',
        touristId: 'demo-tourist-1',
        touristName: 'Demo Tourist',
        touristEmail: 'tourist@demo.com',
        selectedDestinations: [1, 2], // Everest Base Camp, Pokhara
        preferredLanguage: 'English',
        tourType: 'trekking',
        duration: '1 week',
        groupSize: '2 people',
        specialInterests: ['Photography', 'Culture'],
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
        budget: 'moderate',
        additionalRequirements: 'Vegetarian meals preferred',
        emergencyContact: 'John Doe +1-555-0123',
        fitnessLevel: 'moderate',
        status: 'assigned',
        assignedGuide: 'demo-guide-1',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        destinationNames: [
          { id: 1, name: 'Everest Base Camp' },
          { id: 2, name: 'Pokhara' }
        ]
      },
      {
        id: 'demo-request-2',
        touristId: 'demo-tourist-2',
        touristName: 'Sarah Johnson',
        touristEmail: 'sarah.johnson@email.com',
        selectedDestinations: [4, 6], // Kathmandu Valley, Lumbini
        preferredLanguage: 'English',
        tourType: 'culture',
        duration: '3-5 days',
        groupSize: 'Solo',
        specialInterests: ['Spiritual/Religious', 'History'],
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
        budget: 'premium',
        additionalRequirements: 'Interested in meditation sessions',
        emergencyContact: 'Mike Johnson +1-555-0456',
        fitnessLevel: 'beginner',
        status: 'assigned',
        assignedGuide: 'demo-guide-1',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        destinationNames: [
          { id: 4, name: 'Kathmandu Valley' },
          { id: 6, name: 'Lumbini' }
        ]
      },
      {
        id: 'demo-request-3',
        touristId: 'demo-tourist-3',
        touristName: 'Michael Chen',
        touristEmail: 'michael.chen@email.com',
        selectedDestinations: [3], // Chitwan National Park
        preferredLanguage: 'English',
        tourType: 'adventure',
        duration: '3-5 days',
        groupSize: '3-5 people',
        specialInterests: ['Wildlife', 'Photography'],
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 weeks from now
        budget: 'moderate',
        additionalRequirements: 'Group includes children (ages 8-12)',
        emergencyContact: 'Lisa Chen +1-555-0789',
        fitnessLevel: 'moderate',
        status: 'pending',
        assignedGuide: null,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        assignedAt: null,
        destinationNames: [
          { id: 3, name: 'Chitwan National Park' }
        ]
      }
    ];
    
    // Create notifications for the demo guide
    const notifications = JSON.parse(localStorage.getItem('nepal_guide_notifications') || '{}');
    if (!notifications['demo-guide-1']) {
      notifications['demo-guide-1'] = [
        {
          id: 'notif-1',
          type: 'assignment',
          title: 'New Tour Assignment!',
          message: `You have been assigned to Demo Tourist's trekking tour`,
          requestId: 'demo-request-1',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          id: 'notif-2',
          type: 'assignment',
          title: 'New Tour Assignment!',
          message: `You have been assigned to Sarah Johnson's culture tour`,
          requestId: 'demo-request-2',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: false
        }
      ];
      localStorage.setItem('nepal_guide_notifications', JSON.stringify(notifications));
    }
    
    return demoRequests;
  }
  useEffect(() => {
    localStorage.setItem('nepal_guide_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem('nepal_guide_requests', JSON.stringify(requests));
  }, [requests]);

  const submitRequest = (requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      assignedGuide: null,
      destinationNames: requestData.selectedDestinations.map(id => {
        const dest = destinations.find(d => d.id === id);
        return { id, name: dest ? dest.name : `Destination ${id}` };
      })
    };
    
    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const assignGuide = (requestId, guideId) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'assigned', assignedGuide: guideId, assignedAt: new Date().toISOString() }
        : req
    ));
    
    // Create notification for the assigned guide
    const request = requests.find(r => r.id === requestId);
    const guide = guides.find(g => g.id === guideId);
    
    if (request && guide) {
      // Store notification in localStorage for the guide
      const notifications = JSON.parse(localStorage.getItem('nepal_guide_notifications') || '{}');
      if (!notifications[guideId]) {
        notifications[guideId] = [];
      }
      
      const notification = {
        id: Date.now().toString(),
        type: 'assignment',
        title: 'New Tour Assignment!',
        message: `You have been assigned to ${request.touristName}'s ${request.tourType} tour`,
        requestId: requestId,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      notifications[guideId].push(notification);
      localStorage.setItem('nepal_guide_notifications', JSON.stringify(notifications));
      
      console.log(`✅ Guide Assignment: ${guide.name} has been assigned to ${request.touristName}'s ${request.tourType} tour`);
    }
  };

  const updateRequestStatus = (requestId, status) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status, updatedAt: new Date().toISOString() }
        : req
    ));
    
    if (status === 'completed') {
      // Mark guide as available again when trip is completed
      const request = requests.find(r => r.id === requestId);
      if (request?.assignedGuide) {
        setGuides(prev => prev.map(guide => 
          guide.id === request.assignedGuide 
            ? { ...guide, available: true, completedTrips: (guide.completedTrips || 0) + 1 }
            : guide
        ));
      }
    }
  };

  const updateGuide = (guideId, updates) => {
    setGuides(prev => prev.map(guide => 
      guide.id === guideId 
        ? { ...guide, ...updates }
        : guide
    ));
  };

  const getNotifications = (userId) => {
    const notifications = JSON.parse(localStorage.getItem('nepal_guide_notifications') || '{}');
    return notifications[userId] || [];
  };

  const markNotificationAsRead = (userId, notificationId) => {
    const notifications = JSON.parse(localStorage.getItem('nepal_guide_notifications') || '{}');
    if (notifications[userId]) {
      notifications[userId] = notifications[userId].map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      localStorage.setItem('nepal_guide_notifications', JSON.stringify(notifications));
    }
  };

  const clearNotifications = (userId) => {
    const notifications = JSON.parse(localStorage.getItem('nepal_guide_notifications') || '{}');
    if (notifications[userId]) {
      notifications[userId] = [];
      localStorage.setItem('nepal_guide_notifications', JSON.stringify(notifications));
    }
  };

  const value = {
    destinations,
    guides,
    requests,
    submitRequest,
    assignGuide,
    updateRequestStatus,
    updateGuide,
    getNotifications,
    markNotificationAsRead,
    clearNotifications
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};