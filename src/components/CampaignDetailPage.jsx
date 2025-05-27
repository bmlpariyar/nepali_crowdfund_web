// src/components/CampaignDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCampaignById, makeDonation } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { deleteCampaignById } from '../services/apiService';

const calculateProgress = (current, goal) => {
    if (!goal || goal <= 0 || !current || current <= 0) {
        return 0;
    }
    return Math.min((current / goal) * 100, 100);
};


function CampaignDetailPage() {
    const { user } = useAuth();
    const { id: campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [donationError, setDonationError] = useState(null);
    const [donationSuccess, setDonationSuccess] = useState(null);
    const [isDonating, setIsDonating] = useState(false);


    useEffect(() => {
        if (!campaignId) {
            setError("No campaign ID specified.");
            setLoading(false); // Stop loading if ID is missing
            return;
        }

        const loadCampaign = async () => {
            setLoading(true);
            setError(null);
            setCampaign(null); // Reset campaign data on new fetch
            try {
                const response = await fetchCampaignById(campaignId);
                if (response.data) {
                    const formattedData = {
                        ...response.data,
                        current_amount: parseFloat(response.data.current_amount) || 0,
                        funding_goal: parseFloat(response.data.funding_goal) || 0
                    };
                    setCampaign(formattedData);
                } else {
                    // Handle cases where API returns success but no data
                    setError(`Campaign data for ID '${campaignId}' is empty or invalid.`);
                }
            } catch (err) {
                console.error(`Error fetching campaign ${campaignId}:`, err);
                if (err.response && err.response.status === 404) {
                    setError(`Campaign '${campaignId}' not found.`);
                } else {
                    setError(`Failed to load campaign details. ${err.message || 'API might be down.'}`);
                }
            } finally {
                setLoading(false);
            }
        };

        loadCampaign();
    }, [campaignId]);

    const handleDonationSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            setDonationError("Please log in to make a donation.");
            return;
        }
        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            setDonationError("Please enter a valid donation amount.");
            return;
        }

        setIsDonating(true);
        setDonationError(null);
        setDonationSuccess(null);

        try {
            const donationData = { amount: parseFloat(donationAmount) };
            const response = await makeDonation(campaignId, donationData);
            setDonationSuccess(`Thank you for your donation of NPR ${response.data.donation.amount}!`);

            // Update campaign details properly after successful donation
            if (campaign) {
                let newAmount;
                const donatedValue = parseFloat(response.data.donation?.amount); // Get donated amount first

                if (typeof response.data.campaign_current_amount === 'number') {
                    newAmount = response.data.campaign_current_amount;
                } else if (typeof response.data.campaign_current_amount === 'string') {
                    newAmount = parseFloat(response.data.campaign_current_amount);
                } else if (response.data.campaign?.current_amount) {
                    newAmount = parseFloat(response.data.campaign.current_amount);
                } else if (!isNaN(donatedValue)) {
                    // --- MODIFIED ---
                    // Calculate manually: Use current amount (or 0) + donated amount
                    const current = parseFloat(campaign.current_amount) || 0;
                    newAmount = current + donatedValue;
                    // --- END MODIFIED ---
                }


                // Make sure we have a valid number before updating state
                // Use isFinite to avoid Infinity/NaN and check if it's a number
                if (typeof newAmount === 'number' && isFinite(newAmount)) {
                    setCampaign(prevCampaign => ({
                        ...prevCampaign,
                        current_amount: newAmount
                    }));
                } else {
                    // Log the response if calculation fails, helps debugging
                    console.error("Failed to calculate new amount. Response:", response.data);
                }
            }

            setDonationAmount(''); // Clear input field
        } catch (err) {
            console.error("Donation failed:", err.response);
            if (err.response && err.response.data && err.response.data.errors) {
                setDonationError(err.response.data.errors.join(', '));
            } else if (err.response && err.response.data && err.response.data.error) {
                setDonationError(err.response.data.error);
            } else {
                setDonationError("Donation failed. Please try again.");
            }
        } finally {
            setIsDonating(false);
        }
    };


    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteCampaignById(campaignId); // Call delete API
            window.location.href = "/campaigns"; // Redirect to campaigns list
        } catch (err) {
            console.error(`Error deleting campaign ${campaignId}:`, err);
            setDeleteError(`Failed to delete campaign. ${err.message || 'Please try again later.'}`);
        }
    }

    const handleUpdate = () => {
        window.location.href = `/update-campaign/${campaignId}`;
    }


    // --- Loading State ---
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-lg font-medium text-gray-600">Loading campaign details...</div>
                {/* Optional: Add a spinner here */}
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
                <Link
                    to="/campaigns" // Link back to the list page
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    &larr; Back to Campaigns
                </Link>
            </div>
        );
    }

    // --- Campaign Not Found / Empty Data State ---
    // This handles cases where loading finished, no specific error string was set, but campaign is still null/undefined
    if (!campaign) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
                <p className="text-gray-500 text-lg mb-6">Campaign data is not available.</p>
                <Link
                    to="/campaigns"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    &larr; Back to Campaigns
                </Link>
            </div>
        );
    }

    // Calculate progress percentage based on current campaign state
    const progressPercent = calculateProgress(
        typeof campaign.current_amount === 'number' ? campaign.current_amount : parseFloat(campaign.current_amount) || 0,
        typeof campaign.funding_goal === 'number' ? campaign.funding_goal : parseFloat(campaign.funding_goal) || 1
    );
    const deadlineDate = campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'N/A';

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Optional: Back Link */}
            <Link
                to="/campaigns"
                className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-block"
            >
                &larr; Back to All Campaigns
            </Link>

            {/* --- Header Section --- */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                {campaign.title || 'Untitled Campaign'}
            </h2>
            <p className="text-sm text-gray-600 mb-6 space-x-2">
                <span>
                    Category: <strong className="font-medium text-gray-800">{campaign.category?.name ?? 'N/A'}</strong>
                </span>
                <span>|</span>
                <span>
                    By: <strong className="font-medium text-gray-800">{campaign.user?.full_name ?? 'Unknown'}</strong>
                </span>
                <span>|</span>
                <span>
                    Deadline: <strong className="font-medium text-gray-800">{deadlineDate}</strong>
                </span>
                <span>|</span>
                <span>
                    Status: <strong className="font-medium text-gray-800">{campaign.status}</strong>
                </span>
            </p>
            {user?.id === campaign.user?.id && (
                <div className="mb-6">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-600"
                    >
                        Delete Campaign
                    </button>
                    {deleteError && (
                        <p className="text-red-500 text-sm mt-2">{deleteError}</p>
                    )}
                </div>
            )}

            {user?.id === campaign.user?.id && (
                <div className="mb-6">
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600"
                    >
                        Update Campaign
                    </button>
                </div>
            )}


            <div className="border-t border-gray-200 my-6"></div>

            {/* --- Progress Section --- */}
            <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-700">
                    <span>Raised</span>
                    <span>Goal</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                    <strong className="text-2xl font-semibold text-green-600">
                        NPR {campaign.current_amount?.toLocaleString() ?? '0'}
                    </strong>
                    <span className="text-lg text-gray-700">
                        NPR {campaign.funding_goal?.toLocaleString() ?? 'N/A'}
                    </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                    <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full flex items-center justify-center"
                        style={{ width: `${progressPercent}%` }}
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {/* Optional: Show percentage inside bar if it's wide enough */}
                        {progressPercent > 10 && (
                            <span className="text-xs font-bold text-white text-shadow-sm">
                                {Math.round(progressPercent)}%
                            </span>
                        )}
                    </div>
                </div>
                {/* Optional: Display number of donors if available */}
                {/* <p className="text-sm text-gray-500 mt-2">{campaign.donor_count ?? 0} donors</p> */}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* --- Story Section --- */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Story
            </h3>
            {/* Apply prose for better typography if @tailwindcss/typography is installed */}
            {/* Or use manual styling like below */}
            <div className="bg-white p-5 rounded-md border border-gray-200 whitespace-pre-wrap text-gray-700 leading-relaxed prose prose-lg max-w-none">
                {campaign.story || 'No story provided.'}
            </div>

            {/* --- Donation Section --- */}
            <div className="border-t border-gray-200 my-8"></div>
            <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <h4 className="text-xl font-semibold text-gray-700 mb-4 text-center">
                    Donate to this Campaign
                </h4>

                {donationSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
                        {donationSuccess}
                    </div>
                )}

                {donationError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                        {donationError}
                    </div>
                )}

                {user ? (
                    <form onSubmit={handleDonationSubmit} className="flex flex-col sm:flex-row sm:items-center gap-4 justify-center">
                        <input
                            type="number"
                            placeholder="Enter amount (NPR)"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            min="1"
                            step="1"
                            required
                            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
                        />
                        <button
                            type="submit"
                            disabled={isDonating}
                            className={`bg-indigo-600 text-white font-bold px-6 py-2 rounded hover:bg-indigo-700 ${isDonating ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {isDonating ? 'Processing...' : 'Donate'}
                        </button>
                    </form>
                ) : (
                    <p className="text-center text-gray-600">
                        Please{' '}
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                            log in
                        </Link>{' '}
                        to donate.
                    </p>
                )}
            </div>


        </div>
    );
}

export default CampaignDetailPage;