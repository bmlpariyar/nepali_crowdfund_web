// src/components/CampaignListPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaigns } from '../services/apiService'; // Import the service function

function CampaignListPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);




    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchCampaigns();
                // Ensure response.data is an array, provide fallback if needed
                setCampaigns(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                // Provide a more specific error message if possible from err object
                setError(`Failed to load campaigns. ${err.message || 'Please try again later.'}`);
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
    }, []); // Empty dependency array means this runs once on mount

    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-medium text-gray-600">Loading campaigns...</div>
                {/* Optional: Add a spinner here */}
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }

    // --- Main Content ---
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-green-600 mb-8 text-center md:text-left">
                Active Campaigns
            </h1>

            {/* --- No Campaigns Found State --- */}
            {campaigns.length === 0 ? (
                <p className="text-center text-gray-500 text-lg mt-10">
                    No campaigns found at the moment.
                </p>
            ) : (
                // --- Campaign Grid ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col"
                        >
                            {/* Optional: Add Image Placeholder/Actual Image */}
                            {/* <img src={campaign.imageUrl || 'https://via.placeholder.com/400x200'} alt={campaign.title} className="w-full h-48 object-cover"/> */}

                            <div className="p-5 flex flex-col flex-grow"> {/* Added flex-grow */}
                                {/* Link wraps the title */}
                                <Link to={`/campaigns/${campaign.id}`} className="block mb-3">
                                    <h2 className="text-xl font-semibold text-indigo-700 hover:text-indigo-900 transition-colors duration-200">
                                        {(campaign.title?.split(' ').slice(0, 10).join(' ') || 'Untitled Campaign') + (campaign.title?.split(' ').length > 10 ? '...' : '')}
                                    </h2>
                                </Link>

                                {/* Optional: Short Description */}
                                <p className="text-gray-600 text-sm mb-4 flex-grow">
                                    {(campaign.story?.split(' ').slice(0, 20).join(' ') || 'No description available.') + (campaign.story?.split(' ').length > 20 ? '...' : '')}
                                </p>

                                <div className="mt-auto space-y-2 pt-4 border-t border-gray-100"> {/* Pushes details to bottom */}
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-800">Goal:</span> NPR {campaign.funding_goal?.toLocaleString() ?? 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-800">Raised:</span> NPR {campaign.current_amount?.toLocaleString() ?? '0'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-800">Status: {campaign.status}</span>
                                    </p>
                                    {/* Optional: Progress Bar */}
                                    {campaign.funding_goal > 0 && (
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full"
                                                style={{ width: `${Math.min((campaign.current_amount / campaign.funding_goal) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CampaignListPage;