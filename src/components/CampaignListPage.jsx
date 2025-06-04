// src/components/CampaignListPage.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchCampaigns } from '../services/apiService';
import { startCase } from 'lodash';
import clsx from 'clsx';
import { toast } from 'react-toastify';

// Memoized campaign card component to prevent unnecessary re-renders
const CampaignCard = React.memo(({ campaign, calculatePercentage }) => (
    <div
        className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-white/20 overflow-hidden animate-slide-up"
    >
        <div className="relative overflow-hidden">
            <img
                src={campaign.cover_image_url || 'https://placehold.co/400x240/98a9d6/ffffff?text=No+Image'}
                alt="Campaign Cover"
                className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                    e.target.src = 'https://placehold.co/400x240';
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 right-4">
                <span className={clsx(
                    campaign.status === 'active' ? 'bg-emerald-500' : 'bg-red-500',
                    'text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg'
                )}>
                    {startCase(campaign.status)}
                </span>
            </div>
            <div className="absolute top-4 left-4">
                <span className={clsx(

                    'bg-indigo-400/80 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg'
                )}>
                    {startCase(campaign.category.name)}
                </span>
            </div>
        </div>

        <div className="p-6">
            <Link to={`/campaigns/${campaign.id}`} className="block mb-3">
                <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                    {campaign.title}
                </h2>
            </Link>

            <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                {campaign.story}
            </p>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="text-sm">
                        <span className="font-semibold text-slate-700">Goal:</span>
                        <span className="text-emerald-600 font-bold ml-1">
                            NPR {campaign.funding_goal?.toLocaleString() ?? 'N/A'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold text-slate-700">Raised:</span>
                        <span className="text-indigo-600 font-bold ml-1">
                            NPR {campaign.current_amount?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${calculatePercentage(campaign.current_amount, campaign.funding_goal)}%` }}
                        ></div>
                    </div>
                    <div
                        className="absolute -top-1 transform -translate-x-1/2"
                        style={{ left: `${calculatePercentage(campaign.current_amount, campaign.funding_goal)}%` }}
                    >
                        <div className="bg-emerald-500 text-white text-[0.6rem] px-2 py-1 rounded-full font-medium shadow-lg">
                            {calculatePercentage(campaign.current_amount, campaign.funding_goal).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
));

function CampaignListPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoize the percentage calculation function to prevent recreation on each render
    const calculatePercentage = useCallback((current_amount, target_amount) => {
        if (!target_amount || target_amount === 0) return 0;
        return Math.min((current_amount / target_amount) * 100, 100);
    }, []);

    // Memoize campaigns to prevent unnecessary recalculations
    const memoizedCampaigns = useMemo(() => campaigns, [campaigns]);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                setLoading(true);
                setError(null);

                // Add timeout to handle slow API responses
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout')), 10000)
                );

                const response = await Promise.race([
                    fetchCampaigns(),
                    timeoutPromise
                ]);

                setCampaigns(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching campaigns:", err);
                const errorMessage = err.message === 'Request timeout'
                    ? 'Request timed out. Please check your connection and try again.'
                    : `Failed to load campaigns. ${err.message || 'Please try again later.'}`;
                setError(errorMessage);

                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        loadCampaigns();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="mb-12">
                    <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4 w-80"></div>
                    <div className="w-[27rem] h-1 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white/80 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                            <div className="h-60 bg-gray-200 animate-pulse"></div>
                            <div className="p-6">
                                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse mb-6 w-3/4"></div>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state without toast (already shown in useEffect)
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-6xl font-semibold text-red-600 mb-4">Error</div>
                <div className="text-lg text-gray-600 mb-8 text-center max-w-md">
                    {error}
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Main content
    return (
        <div className="container mx-auto px-12 py-12">
            {memoizedCampaigns.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <p className="text-xl text-gray-500 mb-4">No campaigns found</p>
                    <p className="text-gray-400">Check back later for new campaigns</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {memoizedCampaigns.map((campaign) => (

                        <Link to={`/campaigns/${campaign.id}`}>
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                calculatePercentage={calculatePercentage}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CampaignListPage;