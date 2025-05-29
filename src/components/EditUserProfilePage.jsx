// src/components/EditUserProfilePage.js
import React, { useState, useEffect, useRef } from 'react'; // Add useRef
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateMyProfile } from '../services/apiService';

function EditUserProfilePage() {
    const { user, isLoading: authLoading, updateUserProfileLocally } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // For the file input

    // Separate state for the file object and the preview URL
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(''); // For displaying current/new image

    // Form field states
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    // const [profilePictureUrl, setProfilePictureUrl] = useState(''); // Replaced by file state
    const [dateOfBirth, setDateOfBirth] = useState('');


    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.user_profile) {
            const profile = user.user_profile;
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setWebsiteUrl(profile.website_url || '');
            setDateOfBirth(profile.date_of_birth || '');
            setProfileImagePreview(profile.profile_image_url || ''); // Use the URL from backend for initial preview
        }
    }, [user]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImageFile(file); // Store the file object
            setProfileImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        // Construct data to be sent
        const profileDataForApi = {
            bio,
            location,
            website_url: websiteUrl,
            date_of_birth: dateOfBirth,
            ...(profileImageFile && { profile_image: profileImageFile }),
        };
        try {
            const response = await updateMyProfile(profileDataForApi); // This now sends FormData
            updateUserProfileLocally(response.data.user_profile);
            setSuccess('Profile updated successfully!');
            setProfileImageFile(null); // Clear the file input state after successful upload
            // The preview will be updated by the effect listening to user context change
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            console.error("Profile update error:", err.response || err);
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

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {error && <div className="p-3 bg-red-100 text-red-700 border border-red-400 rounded"><p>{error}</p></div>}
                    {success && <div className="p-3 bg-green-100 text-green-700 border border-green-400 rounded"><p>{success}</p></div>}

                    {/* Profile Image Preview and Upload */}
                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={profileImagePreview || 'https://placehold.co/400'}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
                            ref={fileInputRef}
                        />
                        {/* To clear the file input visually if needed (though clearing profileImageFile state is key)
            <button type="button" onClick={() => { setProfileImageFile(null); setProfileImagePreview(user?.user_profile?.profile_image_url || ''); if(fileInputRef.current) fileInputRef.current.value = null; }}
              className="text-xs text-red-500 hover:text-red-700">
              Clear selection
            </button>
            */}
                    </div>


                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                        <textarea id="bio" name="bio" rows="4"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>

                    {/* ... other form fields (location, websiteUrl, dateOfBirth) remain the same as before ... */}
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