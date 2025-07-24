import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mountain, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Nepal Guide Connect</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                >
                  Dashboard
                </Link>
                {user.role === 'tourist' && (
                  <Link 
                    to="/request" 
                    className={`${isActive('/request') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                  >
                    Request Guide
                  </Link>
                )}
                {user.role === 'guide' && (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Guide
                  </span>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                    <User className="h-5 w-5" />
                    <span className="max-w-32 truncate">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 hover:bg-blue-50`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md ${isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 hover:bg-blue-50`}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'tourist' && (
                  <Link 
                    to="/request" 
                    className={`block px-3 py-2 rounded-md ${isActive('/request') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 hover:bg-blue-50`}
                    onClick={() => setIsOpen(false)}
                  >
                    Request Guide
                  </Link>
                )}
                {user.role === 'guide' && (
                  <div className="px-3 py-2">
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Guide Account
                    </span>
                  </div>
                )}
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md ${isActive('/profile') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'} hover:text-blue-600 hover:bg-blue-50`}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;