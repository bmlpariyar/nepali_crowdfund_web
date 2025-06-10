// src/components/RecommendedCampaigns.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommendations } from '../services/apiService';

const RecommendedCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations()
            .then(response => {
                setCampaigns(response.data);
            })
            .catch(error => {
                console.error("Error fetching recommendations:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading recommendations...</p>;
    }

    if (campaigns.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Using a simplified campaign card view */}
                {campaigns.map(campaign => (
                    <div key={campaign.id} className="border rounded-lg shadow hover:shadow-lg transition-shadow">
                        <Link to={`/campaigns/${campaign.id}`}>
                            {/* Assume campaign serializer provides image_url */}
                            <img src={campaign.image_url || 'https://via.placeholder.com/400x300'} alt={campaign.title} className="w-full h-48 object-cover rounded-t-lg" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg">{campaign.title}</h3>
                                <p className="text-gray-600 text-sm mt-1">Goal: NPR {campaign.funding_goal?.toLocaleString()}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecommendedCampaigns;

