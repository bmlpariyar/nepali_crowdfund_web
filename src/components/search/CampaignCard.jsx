
import React, { useCallback } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({ campaign, css }) => {
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

    return (
        <div
            onClick={() => handleCampaignClick(campaign.id)}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-white/20 overflow-hidden animate-slide-up"
        >
            <div className="relative overflow-hidden">
                <img
                    src={campaign.cover_image || 'https://placehold.co/400x240/d93b67/ffffff?text=No+Image'}
                    alt="Campaign Cover"
                    className="w-full h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/400x240';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                    <span className={`${getStatusColor(campaign.status)} px-3 py-1 rounded-full text-sm font-medium shadow-lg`
                    }>
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
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-4 pt-4">
                        <span><span className="font-bold">{campaign.backers || 0}</span> backers</span>
                        <span><span className="font-bold">{campaign.days_left > 0 ? campaign.days_left : 0}</span> days left</span>
                    </div>
                </div>
            </div>
        </div>

    )
};

export default CampaignCard