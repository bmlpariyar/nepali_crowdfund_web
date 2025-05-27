// src/components/ProfileSetupStep1Page.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/apiService';

function ProfileSetupStep1Page() {
    const { user, isLoading: authLoading /*, updateUserProfileLocally */ } = useAuth(); // Get user from context
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Pre-fill form if profile data already exists (e.g., user revisiting this step)
    useEffect(() => {
        if (user && user.user_profile) {
            setBio(user.user_profile.bio || '');
            setLocation(user.user_profile.location || '');
            setDateOfBirth(user.user_profile.date_of_birth || '');
        }
    }, [user]); // Re-run if user object changes in context

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const profileData = { bio, location, date_of_birth };

        try {
            const response = await updateMyProfile(profileData);
            // Optional: update user in context locally
            // if (updateUserProfileLocally) {
            //   updateUserProfileLocally(response.data); // Assuming API returns updated profile
            // }
            // For now, navigate to next step or home.
            // You could have a ProfileSetupStep2Page or navigate home.
            navigate('/'); // Or navigate('/setup-profile/step2');
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

    const handleSkip = () => {
        navigate('/'); // Navigate to home page or dashboard
    };

    if (authLoading) {
        return <div className="text-center py-10">Loading user data...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-md rounded-lg">
                <div>
                    <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
                        Tell us about yourself (Step 1)
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        This information will be part of your public profile.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea id="bio" name="bio" rows="4"
                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="A short bio about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input id="location" name="location" type="text"
                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., Kathmandu, Nepal" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input id="dob" name="dob" type="date"
                            className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={date_of_birth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                        <button type="button" onClick={handleSkip} disabled={loading}
                            className="group w-1/2 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Skip for now
                        </button>
                        <button type="submit" disabled={loading}
                            className="group w-1/2 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfileSetupStep1Page;