// src/components/CampaignDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCampaignById, makeDonation } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { deleteCampaignById } from '../services/apiService';
import DonationModal from './donation/DonationModal';
import SupportMessages from './donation/SupportMessages';
import UpdateMessageModal from './campaign/UpdateMessageModal';
import CampaignStatusUpdate from './CampaignStatusUpdate';
import RecentDonations from './donation/RecentDonations';
import ShareModal from './donation/ShareModal';

const calculateProgress = (current, goal) => {
    if (!goal || goal <= 0 || !current || current <= 0) {
        return 0;
    }
    return Math.min((current / goal) * 100, 100);
};


function CampaignDetailPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { id: campaignId } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [messageRefreshKey, setMessageRefreshKey] = useState(0);
    const [updateRefreshKey, setUpdateRefreshKey] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);

    const handleDonationSuccess = () => {
        setMessageRefreshKey(prev => prev + 1); // triggers SupportMessages to refresh
    };

    const handleUpdateMessageSuccess = () => {
        setUpdateRefreshKey(prev => prev + 1); // triggers CampaignStatusUpdate to refresh
    };

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
                    to="/campaigns"
                    className="text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium -z-20"
                >
                    &larr; Back to Campaigns
                </Link>
            </div>
        );
    }

    if (authLoading) {
        return <div>Checking authentication...</div>;
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
        <div className=" bg-white container mx-auto px-4 py-8 max-w-7xl">
            {/* Optional: Back Link */}
            <Link
                to="/campaigns"
                className="text-sm text-indigo-600 hover:text-indigo-800 mb-6 inline-block"
            >
                &larr; Back to All Campaigns
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {campaign.title || 'Untitled Campaign'}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-user-circle"></i>
                                <span>{campaign.user.full_name} is organizing this fundraiser</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-calendar"></i>
                                <span>{campaign.created_at.split('T')[0]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-tag"></i>
                                <span>Category: <strong>{campaign.category.name}</strong></span>
                            </div>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
                            {/* Trust Badge  */}
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                                <i className="fas fa-shield-alt"></i>
                                <span>Donation protected</span>
                            </div>
                            <div className='flex items-center gap-4'>
                                {user?.id === campaign.user?.id && (
                                    <div className="mb-6">
                                        <button
                                            onClick={handleDelete}
                                            className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full hover:bg-red-600"
                                        >
                                            Delete
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
                                            className="bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                )}
                                {user?.id === campaign.user?.id && (
                                    <div className="mb-6">
                                        <button
                                            onClick={() => setUpdateModalOpen(true)}
                                            className="bg-cyan-500 text-white text-xs font-bold py-1 px-2 rounded-full hover:bg-cyan-600"
                                        >
                                            Edit
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <img src={campaign.cover_image_url || 'https://via.placeholder.com/600x400'}
                            alt="Campaign Image"
                            className="w-full h-[30rem] object-cover" />
                    </div>
                    {/* story section */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
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
                                {progressPercent > 5 && (
                                    <span className="text-xs font-bold text-white text-shadow-sm">
                                        {Math.round(progressPercent)}%
                                    </span>
                                )}
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Story</h2>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                            <p>{campaign.story}</p>
                        </div>
                    </div>

                    {/* update section */}
                    <CampaignStatusUpdate campaignId={campaign.id} retriggerKey={updateRefreshKey} />
                    {/* <!-- Comments/Messages Section --> */}
                    <SupportMessages campaignId={campaign.id}
                        refreshTrigger={messageRefreshKey} />

                </div>

                {/* <!-- Sidebar --> */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">

                        {/* <!-- Progress Card --> */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

                            {/*  Amount Raised */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        NRs {campaign.current_amount.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        raised of NRs {campaign.funding_goal.toLocaleString()} goal
                                    </div>
                                </div>
                                <div className="relative w-28 h-28">
                                    <svg
                                        className="w-full h-full transform -rotate-90"
                                        viewBox="0 0 36 36"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle
                                            className="text-gray-200"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                            cx="18"
                                            cy="18"
                                            r="16"
                                        />
                                        <circle
                                            className="text-green-500"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            fill="none"
                                            cx="18"
                                            cy="18"
                                            r="16"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - progressPercent}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-gray-700">
                                            {Math.round(progressPercent)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Donation Stats --> */}
                            <div className="text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="fas fa-chart-line text-purple-500"></i>
                                    <span><strong className="text-purple-600">{campaign.total_donations} people</strong> have donated</span>
                                </div>
                            </div>

                            {/* <!-- Action Buttons --> */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
                                    <i className="fas fa-share-alt mr-2"></i>
                                    Share
                                </button>
                                <button
                                    onClick={() => setModalOpen(true)}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                                    <i className="fas fa-heart mr-2"></i>
                                    Donate now
                                </button>
                            </div>
                        </div>

                        {/* <!-- Recent Donations --> */}
                        <RecentDonations campaignId={campaign.id} refreshTrigger={messageRefreshKey} />


                        {/* <!-- Organizer Info --> */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Organizer</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img src={user?.user_profile?.profile_picture_url} className="w-12 h-12 bg-indigo-50 rounded-full flex-shrink-0 object-cover"
                                    alt="Organizer Profile">

                                </img>
                                <div>
                                    <div className="font-medium text-gray-900">{campaign.user.full_name}</div>
                                    <div className="text-sm text-gray-600">Organizer</div>
                                </div>
                            </div>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                                Contact
                            </button>
                        </div>

                    </div>
                </div>
            </div>


            {/* =========================================================================== */}
            <DonationModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                user={user}
                campaign={campaign}
                campaignId={campaign.id}
                setCampaign={setCampaign}
                makeDonation={makeDonation}
                onDonationSuccess={handleDonationSuccess}
            />


            <UpdateMessageModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                user={user}
                campaignId={campaign.id}
                onUpdateSuccess={handleUpdateMessageSuccess}
            />

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                campaignUrl={`http://localhost:3001/campaigns/${campaignId}`}
            />



        </div>
    );
}

export default CampaignDetailPage;