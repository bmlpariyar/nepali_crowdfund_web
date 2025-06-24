// src/components/RecommendedCampaigns.js
import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { fetchRecommendations } from '../services/apiService';

// Import the necessary CSS for react-slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RecommendedCampaigns = () => {
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getProgressPercentage = useCallback((raised, goal) => {
        if (!goal || goal === 0) return 0;
        return Math.min((raised / goal) * 100, 100);
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'funded': return 'bg-blue-100 text-blue-800';
            case 'ended': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleCampaignClick = (id) => {
        navigate(`/campaigns/${id}`);
    }

    useEffect(() => {
        const loadRecommended = async () => {
            try {
                const response = await fetchRecommendations();
                setRecommended(response.data);
            } catch (error) {
                console.error("Could not load recommended campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRecommended();
    }, []);

    if (loading || recommended.length === 0) {
        return null;
    }


    const settings = {
        dots: true, // Show the pagination dots
        infinite: true, // Loop through the slides
        speed: 500, // Animation speed in milliseconds
        slidesToShow: 3, // Number of cards to show at once
        slidesToScroll: 1, // Number of cards to scroll at a time
        autoplay: true, // Enable auto-scrolling
        autoplaySpeed: 2000, // Delay between auto-scrolls in milliseconds
        pauseOnHover: true, // Pause auto-scrolling when hovering over the carousel
        responsive: [ // Responsive settings for different screen sizes
            {
                breakpoint: 1024, // For screens smaller than 1024px
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600, // For screens smaller than 600px
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <div className=" bg-indigo-400/20 rounded-2xl p-2">
            <h2 className="text-2xl text-gray-600 font-bold mb-4 ml-2">Recommended For You</h2>
            <Slider
                className='bg-transparent rounded-lg p-2 arrow'
                {...settings}
            >
                {recommended.map(campaign => (
                    <div className='p-2'>
                        <div
                            key={campaign.id}
                            onClick={() => handleCampaignClick(campaign.id)}
                            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 ease-out transform hover:-translate-y-1 border border-white/20 overflow-hidden h-full flex flex-col"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={campaign.cover_image || 'https://placehold.co/400x240/d93b67/ffffff?text=No+Image'}
                                    alt="Campaign Cover"
                                    className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src = 'https://placehold.co/400x240';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-2 right-2">
                                    <span className={`${getStatusColor(campaign.status)} px-2 py-0.5 rounded-full text-xs font-medium shadow-lg`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <span className={'bg-indigo-400/80 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg'}>
                                        {campaign.category}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-4 flex flex-col flex-grow `}>
                                <div className="block mb-2">
                                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                                        {campaign.title}
                                    </h2>
                                </div>
                                <p className="text-slate-600 text-xs mb-4 line-clamp-1 leading-relaxed">
                                    {campaign.description}
                                </p>
                                <div className="mt-auto space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <div>
                                            <span className="font-semibold text-slate-700">Goal:</span>
                                            <span className="text-emerald-600 font-bold ml-1">
                                                NPR {campaign.goal?.toLocaleString() ?? 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-slate-700">Raised:</span>
                                            <span className="text-indigo-600 font-bold ml-1">
                                                NPR {campaign.raised?.toLocaleString() ?? '0'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${getProgressPercentage(campaign.raised, campaign.goal)}%` }}
                                            ></div>
                                        </div>

                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                                        <span><span className="font-bold">{campaign.backers || 0}</span> backers</span>
                                        <span><span className="font-bold">{campaign.days_left > 0 ? campaign.days_left : 0}</span> days left</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default React.memo(RecommendedCampaigns);