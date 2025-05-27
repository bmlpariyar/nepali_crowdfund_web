// src/components/UserProfilePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserProfilePage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="text-center py-10">Loading profile...</div>;
    }

    if (!user) {
        // This should ideally be caught by ProtectedRoute, but as a fallback
        return <div className="text-center py-10 text-red-500">User not found. Please log in.</div>;
    }

    const { full_name, email, user_profile } = user;
    const profile = user_profile || {}; // Handle case where profile might be null/undefined briefly

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="bg-cover bg-center h-40" style={
                    { backgroundImage: `url(${profile.profile_picture_url || 'https://placehold.co/1500x500'})` }}>
                    {/* Placeholder for a banner or use profile_picture_url if it's a banner */}
                </div>
                <div className="px-6 py-4">
                    <div className="flex items-end -mt-16">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-white object-cover"
                            src={profile.profile_picture_url || 'https://placehold.co/400'}
                            alt={`${full_name}'s profile`}
                        />
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold text-gray-900">{full_name}</h1>
                            <p className="text-sm text-gray-600">{email}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-end">
                            <Link
                                to="/profile/edit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Bio</dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{profile.bio || 'No bio provided.'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{profile.location || 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{formatDate(profile.date_of_birth)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Website</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {profile.website_url ? (
                                            <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                                                {profile.website_url}
                                            </a>
                                        ) : 'N/A'}
                                    </dd>
                                </div>
                                {/* Add more fields from User or UserProfile as needed */}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;