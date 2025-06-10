import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Target, ArrowRight, Heart, Share2 } from 'lucide-react';
import { fetchFeaturedCampaigns } from '../../services/apiService';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

const ArticleSection = () => {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                setLoading(true);
                const campaigns = await fetchFeaturedCampaigns();
                setFeaturedCampaigns(campaigns.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCampaigns();
    }, []);

    const getProgressPercentage = (raised, goal) => {
        return Math.min((raised / goal) * 100, 100);
    };

    const handleCampaignClick = (id) => {
        navigate(`/campaigns/${id}`);
    }


    const getStatusColor = (status) => {
        const colors = {
            'Completed': 'bg-blue-100 text-blue-700',
            'Ongoing': 'bg-yellow-100 text-yellow-700',
            'Funded': 'bg-green-100 text-green-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    };





    if (loading) {
        return (
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                            Featured Success Stories
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Discover how communities are coming together to create lasting change and impact lives across the region.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white/80 rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                                <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (featuredCampaigns.length === 0) {
        return (
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
                        Featured Success Stories
                    </h2>
                    <p className="text-lg text-slate-600">No success stories found at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                        Featured Success Stories
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Discover how communities are coming together to create lasting change and impact lives across the region.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


                    {featuredCampaigns.length > 0 && featuredCampaigns.map((campaign) => (
                        <div
                            onClick={() => handleCampaignClick(campaign.id)}
                            key={campaign.id}
                            className="group bg-white/80 backdrop-blur-sm cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-white/20 overflow-hidden animate-slide-up"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={campaign.cover_image || 'https://placehold.co/400x240/98a9d6/ffffff?text=No+Image'}
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
                                        getStatusColor(campaign.status),
                                        ' px-3 py-1 rounded-full text-sm font-medium shadow-lg'
                                    )}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className={clsx(

                                        'bg-indigo-400/80 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg'
                                    )}>
                                        {campaign.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="block mb-3">
                                    <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                                        {campaign.title}
                                    </h2>
                                </div>

                                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                    {campaign.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm">
                                            <span className="font-semibold text-slate-700">Goal:</span>
                                            <span className="text-emerald-600 font-bold ml-1">
                                                NPR {campaign.goal?.toLocaleString() ?? 'N/A'}
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-semibold text-slate-700">Raised:</span>
                                            <span className="text-indigo-600 font-bold ml-1">
                                                NPR {campaign.raised?.toLocaleString() ?? '0'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative">
                                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                                            ></div>
                                        </div>
                                        <div
                                            className="absolute -top-1 transform -translate-x-1/2"
                                            style={{ left: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                                        >
                                            <div className="bg-emerald-500 text-white text-[0.6rem] px-2 py-1 rounded-full font-medium shadow-lg">
                                                {getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4 mt-5">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>{campaign.backers} backers</span>
                                            </div>
                                            {campaign.daysLeft > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{campaign.daysLeft} days left</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
};

export default ArticleSection;
