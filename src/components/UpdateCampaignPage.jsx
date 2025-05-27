import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById, updateCampaignById, fetchCategories } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function UpdateCampaignPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [campaign, setCampaign] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        funding_goal: '',
        deadline: '',
        story: '',
        image_url: '',
        video_url: '',
    });

    useEffect(() => {
        const loadCampaignAndCategories = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch campaign details
                const campaignResponse = await fetchCampaignById(id);
                if (campaignResponse.data) {
                    setCampaign(campaignResponse.data);
                    setFormData({
                        title: campaignResponse.data.title || '',
                        category_id: campaignResponse.data.category?.id || '',
                        funding_goal: campaignResponse.data.funding_goal || '',
                        deadline: campaignResponse.data.deadline
                            ? new Date(campaignResponse.data.deadline).toISOString().split('T')[0]
                            : '',
                        story: campaignResponse.data.story || '',
                        image_url: campaignResponse.data.image_url || '',
                        video_url: campaignResponse.data.video_url || '',
                    });
                } else {
                    setError('Failed to load campaign data.');
                }

                // Fetch categories
                const categoriesResponse = await fetchCategories();
                setCategories(categoriesResponse.data || []);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadCampaignAndCategories();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user?.id !== campaign?.user?.id) {
            alert('You are not authorized to update this campaign.');
            return;
        }

        try {
            await updateCampaignById(id, formData);
            alert('Campaign updated successfully!');
            navigate(`/campaigns/${id}`);
        } catch (err) {
            console.error('Error updating campaign:', err);
            setError('Failed to update campaign. Please try again later.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Update Campaign</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="funding_goal">
                        Funding Goal (NPR)
                    </label>
                    <input
                        type="number"
                        id="funding_goal"
                        name="funding_goal"
                        value={formData.funding_goal}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="deadline">
                        Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="image_url">
                        Image URL
                    </label>
                    <input
                        type="url"
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="video_url">
                        Video URL
                    </label>
                    <input
                        type="url"
                        id="video_url"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="story">
                        Story
                    </label>
                    <textarea
                        id="story"
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows="6"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600"
                >
                    Update Campaign
                </button>
            </form>
        </div>
    );
}

export default UpdateCampaignPage;