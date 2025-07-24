import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize demo accounts
  useEffect(() => {
    const initializeDemoAccounts = () => {
      const users = JSON.parse(localStorage.getItem('nepal_guide_users') || '[]');
      
      // Demo tourist account
      const demoTourist = {
        id: 'demo-tourist-1',
        name: 'Demo Tourist',
        email: 'tourist@demo.com',
        password: 'demo123',
        phone: '+977-9841234567',
        country: 'United States',
        role: 'tourist',
        createdAt: new Date().toISOString()
      };
      
      // Demo admin account
      const demoAdmin = {
        id: 'demo-admin-1',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: 'admin123',
        phone: '+977-9851234568',
        country: 'Nepal',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      // Demo guide account
      const demoGuide = {
        id: 'demo-guide-1',
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
        profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
        createdAt: new Date().toISOString()
      };
      
      // Add demo accounts if they don't exist
      if (!users.find(u => u.email === 'tourist@demo.com')) {
        users.push(demoTourist);
      }
      if (!users.find(u => u.email === 'admin@demo.com')) {
        users.push(demoAdmin);
      }
      if (!users.find(u => u.email === 'guide@demo.com')) {
        users.push(demoGuide);
      }
      
      localStorage.setItem('nepal_guide_users', JSON.stringify(users));
    };
    
    initializeDemoAccounts();
  }, []);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('nepal_guide_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication
    const users = JSON.parse(localStorage.getItem('nepal_guide_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userData = { ...user };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('nepal_guide_user', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (userData) => {
    const users = JSON.parse(localStorage.getItem('nepal_guide_users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'User already exists' };
    }
    
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: userData.role || 'tourist',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('nepal_guide_users', JSON.stringify(users));
    
    const userToStore = { ...newUser };
    delete userToStore.password;
    setUser(userToStore);
    localStorage.setItem('nepal_guide_user', JSON.stringify(userToStore));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nepal_guide_user');
  };

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('nepal_guide_user', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('nepal_guide_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      localStorage.setItem('nepal_guide_users', JSON.stringify(users));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};