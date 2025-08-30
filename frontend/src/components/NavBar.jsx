import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import React, { useState } from 'react';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/sign-in');
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/sign-in');
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed w-full z-50 top-0 left-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img src="/images/logo.jpg" className="h-12 w-12 object-contain rounded-lg border border-gray-200 shadow-lg" alt="Logo" />
          <span className="text-lg font-bold tracking-tight text-gray-800 hidden sm:block">Hospital Readmissions</span>
          <span className="text-base font-bold tracking-tight text-gray-800 sm:hidden">Hospital Readmissions</span>
        </Link>
        
        {/* Hamburger */}
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {/* Home and About always visible */}
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            About
          </Link>
          <Link
            to="/collaboration"
            className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
          >
            Collaboration
          </Link>
          
          {/* Authenticated user extra menu */}
          {!loading && user && (
            <>
              <Link to="/dashboard" className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm">
                Dashboard
              </Link>
            </>
          )}
        </div>
        
        {/* Desktop Sign In/Logout */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {!loading && user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/sign-up')}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`${
          menuOpen ? 'block' : 'hidden'
        } md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-b border-gray-200 transition-all duration-300 ease-in-out`}
        id="navbar-menu"
      >
        <div className="px-4 py-4 space-y-3">
          {/* Mobile Menu Items */}
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/collaboration"
            className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Collaboration
          </Link>
          
          {/* Authenticated user mobile menu */}
          {!loading && user ? (
            <>
              <Link 
                to="/dashboard" 
                className="block px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSignIn}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => { navigate('/sign-up'); setMenuOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors duration-200 text-sm"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
