// src/components/EditUserProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/apiService';

function EditUserProfilePage() {
    const { user, isLoading: authLoading, updateUserProfileLocally } = useAuth();
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pre-fill form with existing profile data
    useEffect(() => {
        if (user && user.user_profile) {
            const profile = user.user_profile;
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setWebsiteUrl(profile.website_url || '');
            setProfilePictureUrl(profile.profile_picture_url || '');
            setDateOfBirth(profile.date_of_birth || '');
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const profileData = {
            bio,
            location,
            website_url: websiteUrl,
            profile_picture_url: profilePictureUrl,
            date_of_birth: dateOfBirth,
        };

        try {
            const response = await updateMyProfile(profileData);
            updateUserProfileLocally(response.data); // Update context with new profile data
            setSuccess('Profile updated successfully!');
            // Optionally navigate back to profile view after a short delay
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            console.error("Profile update error:", err.response);
            if (err.response && err.response.data && err.response.data.errors) {
                setError(err.response.data.errors.join(', '));
            } else {
                setError('Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="text-center py-10">Loading user data...</div>;
    }
    if (!user) {
        return <div className="text-center py-10 text-red-500">Please log in to edit your profile.</div>;
    }


    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Your Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded"><p>{error}</p></div>}
                    {success && <div className="p-3 bg-green-100 text-green-700 border border-green-400 rounded"><p>{success}</p></div>}

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea id="bio" name="bio" rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input id="location" name="location" type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., Kathmandu, Nepal" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">Website URL</label>
                        <input id="websiteUrl" name="websiteUrl" type="url"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://your-website.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="profilePictureUrl" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                        <input id="profilePictureUrl" name="profilePictureUrl" type="url"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="https://link-to-your-image.com/profile.jpg" value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input id="dateOfBirth" name="dateOfBirth" type="date"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={() => navigate('/profile')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUserProfilePage;