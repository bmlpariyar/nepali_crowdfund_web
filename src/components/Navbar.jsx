// src/components/Navbar.js
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/sahayog_logo-red.png";
import { Menu, X } from "lucide-react";

function Navbar() {
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (auth?.isLoading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 animate-pulse">
        <div className="container mx-auto h-6 bg-gray-300/50 rounded w-3/4 m-4"></div>
      </nav>
    );
  }

  const { user, logout } = auth || {};

  const activeClass = "text-gray-600 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg";
  const inactiveClass = "text-gray-600/90 hover:text-white hover:bg-gray-600/10 px-4 py-2 rounded-full transition-all duration-300 ease-out hover:backdrop-blur-sm";

  const navLinks = (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `${isActive ? activeClass : inactiveClass} text-sm font-medium `
        }
      >
        Campaigns
      </NavLink>
      {user && (
        <NavLink
          to="/create/campaign/step1"
          className={({ isActive }) =>
            `${isActive ? activeClass : inactiveClass} text-sm font-medium `
          }
        >
          Create Campaign
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-gray-300/30 via-purple-300/80 to-rose-600/80 backdrop-blur-md border-b border-white/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src={logo}
                alt="Sahayog Logo"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-gray-600 font-bold text-xl tracking-wide hidden sm:block">
                Sahayog
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-2 ">
              {navLinks}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="focus:outline-none group"
                >
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <img
                      src={
                        user.user_profile?.profile_picture_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.full_name || "User"
                        )}&size=128&background=6366f1&color=ffffff`
                      }
                      className="w-8 h-8 object-cover rounded-full border-2 border-white/50 shadow-sm"
                      alt="User Avatar"
                    />
                    <span className="text-gray-600 text-sm font-medium">
                      {user.full_name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl py-2 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-600 hover:bg-gray-600/40 transition-all duration-200 text-sm font-medium"
                      onClick={() => setMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <div className="border-t border-white/20 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-500/40 transition-all duration-200 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${isActive ? activeClass : inactiveClass} text-sm font-medium`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-semibold py-2.5 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">Register</span>
                  {/* Light sweep effect */}
                  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-swipe-light"></div>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white/90 hover:text-white focus:outline-none p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-md border-t border-white/20 shadow-2xl">
          <div className="px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {React.Children.map(navLinks.props.children, (child, index) => (
                <div key={index} onClick={() => setMenuOpen(false)}>
                  {child}
                </div>
              ))}
            </div>

            <div className="border-t border-white/20 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-white">
                    <img
                      src={
                        user.user_profile?.profile_picture_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.full_name || "User"
                        )}&size=128&background=6366f1&color=ffffff`
                      }
                      className="w-10 h-10 object-cover rounded-full border-2 border-white/50"
                      alt="User Avatar"
                    />
                    <span className="font-medium">Hi, {user.full_name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-white/90 hover:text-white text-sm py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `block ${isActive ? activeClass : inactiveClass} text-sm`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;