// src/components/UserProfilePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserProfilePage() {
    const { user, isLoading, refreshUser, forceRefreshUser } = useAuth();
    const [profileLoading, setProfileLoading] = useState(false);

    // Force refresh user data when component mounts
    useEffect(() => {
        const loadProfile = async () => {
            if (user && refreshUser && !isLoading) {
                setProfileLoading(true);
                try {
                    await refreshUser();
                } catch (error) {
                    console.error('Failed to refresh user profile:', error);
                } finally {
                    setProfileLoading(false);
                }
            }
        };

        loadProfile();
    }, [user?.id, refreshUser, isLoading]); // Depend on user ID to refresh when user changes

    // Listen for profile updates (you can trigger this from edit profile page)
    useEffect(() => {
        const handleProfileUpdate = async () => {
            if (forceRefreshUser) {
                await forceRefreshUser();
            }
        };

        // Listen for custom event when profile is updated
        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => {
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, [forceRefreshUser]);

    if (isLoading || profileLoading) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8 text-center">
                        <p className="text-red-500">User not found. Please log in.</p>
                        <Link
                            to="/login"
                            className="mt-4 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { full_name, email, user_profile } = user;
    const profile = user_profile || {}; // Handle case where profile might be null/undefined

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-14 p-4 sm:p-6 lg:p-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                {/* Banner/Cover Image */}
                <div
                    className="bg-cover bg-center h-40 bg-gradient-to-r from-indigo-500 to-purple-600"
                    style={profile.profile_picture_url ?
                        { backgroundImage: `url(${profile.profile_picture_url})` } :
                        {}
                    }
                >
                    {/* Overlay for better text readability if using image */}
                    {profile.profile_picture_url && (
                        <div className="bg-gray-500 bg-opacity-30 h-full"></div>
                    )}
                </div>

                <div className="px-6 py-4">
                    <div className="flex items-end -mt-16">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-gray-200 bg-white object-cover shadow-lg"
                            src={profile.profile_picture_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(full_name || 'User') + '&size=128&background=6366f1&color=ffffff'}
                            alt={`${full_name || 'User'}'s profile`}
                            onError={(e) => {
                                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(full_name || 'User') + '&size=128&background=6366f1&color=ffffff';
                            }}
                        />
                        <div className="ml-6 pb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{full_name || 'Anonymous User'}</h1>
                            <p className="text-sm text-gray-600">{email}</p>
                            {profile.location && (
                                <p className="text-sm text-gray-500 mt-1">📍 {profile.location}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-end">
                            <Link
                                to="/profile/edit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-2 shadow p-5 rounded-lg">
                                    <dt className="text-lg font-medium text-gray-500 mb-2">Bio</dt>
                                    <dd className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                        {profile.bio ? (
                                            <div className="bg-gray-50 p-4 rounded-lg break-words overflow-auto max-h-64">
                                                {profile.bio}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 italic">
                                                No bio provided yet. Click "Edit Profile" to add one!
                                            </div>
                                        )}
                                    </dd>
                                </div>


                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.location || <span className="text-gray-500 italic">Not specified</span>}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.date_of_birth ?
                                            formatDate(profile.date_of_birth) :
                                            <span className="text-gray-500 italic">Not specified</span>
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Latidude</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.latitude ?
                                            profile.latitude : <span className="text-gray-500 italic">Not specified</span>
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Longitude</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.longitude ?
                                            profile.longitude : <span className="text-gray-500 italic">Not specified</span>
                                        }
                                    </dd>
                                </div>


                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.website_url ? (
                                            <a
                                                href={profile.website_url.startsWith('http') ? profile.website_url : `https://${profile.website_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                                            >
                                                {profile.website_url}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 italic">Not specified</span>
                                        )}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {user.created_at ?
                                            formatDate(user.created_at) :
                                            <span className="text-gray-500 italic">Unknown</span>
                                        }
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;