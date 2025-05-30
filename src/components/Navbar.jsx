// src/components/Navbar.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/white-logo.png'; // Adjust the path as necessary
function Navbar() {
    const auth = useAuth();
    if (auth?.isLoading) {
        return (
            <nav className="bg-gray-100 p-4 shadow-md animate-pulse">
                <div className="container mx-auto h-6 bg-gray-300 rounded w-3/4"></div>
            </nav>
        );
    }

    const { user, logout } = auth || {};
    const activeClassName = "text-white bg-indigo-700 px-3 py-1 rounded-md";
    const inactiveClassName = "text-indigo-100 hover:text-white hover:bg-indigo-500 px-3 py-1 rounded-md";

    return (
        <nav className="bg-indigo-600 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-white text-xl font-bold hover:text-indigo-200">
                            <img src={logo} alt="Sahayog Logo" className="h-48 w-auto" />
                        </Link>
                        <div className="hidden md:flex items-baseline space-x-3">
                            <NavLink
                                to="/"
                                // className={({ isActive }) => isActive ? activeClassName : inactiveClassName} // Apply active styles
                                // If you want exact match for home, use end prop:
                                className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} text-sm font-medium transition duration-150 ease-in-out`}
                                end // Add end prop for exact match on "/"
                            >
                                Campaigns
                            </NavLink>
                            {user && (
                                <NavLink
                                    to="/create-campaign"
                                    className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} text-sm font-medium transition duration-150 ease-in-out`}
                                >
                                    Create Campaign
                                </NavLink>
                            )}
                            {/* Add other primary navigation links here */}
                        </div>
                    </div>

                    {/* Right side: Auth links/User info */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-indigo-100">
                                    <Link to="/profile" className="text-sm text-white hover:text-gray-300">
                                        <img src={user.user_profile.profile_picture_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.full_name || 'User') + '&size=128&background=6366f1&color=ffffff'} className='w-10 h-10 bg-white rounded-full border-white' alt="" />
                                    </Link>
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow transition duration-150 ease-in-out"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => `${isActive ? activeClassName : inactiveClassName} text-sm font-medium transition duration-150 ease-in-out`}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1.5 px-3 rounded-md shadow transition duration-150 ease-in-out"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button (Example - Requires state to manage) */}
                    <div className="-mr-2 flex md:hidden">
                        <button type="button" className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            {/* Icon when menu is closed. Heroicon name: menu */}
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            {/* Icon when menu is open. Heroicon name: x */}
                            {/* <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg> */}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state (Example Structure) */}
            {/* <div className="md:hidden" id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : inactiveClassName + ' block'} end>Campaigns</NavLink>
                    {user && <NavLink to="/create-campaign" className={({ isActive }) => isActive ? activeClassName : inactiveClassName + ' block'}>Create Campaign</NavLink>}
                </div>
                <div className="pt-4 pb-3 border-t border-indigo-700">
                    {user ? (
                        <div className="px-2 space-y-1">
                             <span className="block text-base font-medium text-white px-3 py-1">Welcome, {user.full_name}!</span>
                             <button onClick={logout} className="block w-full text-left bg-red-500 hover:bg-red-600 text-white text-base font-medium py-2 px-3 rounded-md">Logout</button>
                        </div>
                    ) : (
                        <div className="px-2 space-y-1">
                            <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : inactiveClassName + ' block'}>Login</NavLink>
                            <NavLink to="/register" className={({ isActive }) => isActive ? activeClassName : inactiveClassName + ' block'}>Register</NavLink>
                        </div>
                    )}
                </div>
            </div> */}
        </nav>
    );
}

export default Navbar;