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
    const [imageUrl, setImageUrl] = useState("");

    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category_id: '',
        funding_goal: '',
        deadline: '',
        story: '',
        cover_image: imageUrl,
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
                        cover_image: campaignResponse.data.cover_image || '',
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                cover_image: file, // Store actual file object
            }));
        }
    };
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
            const data = new FormData();

            // Wrap all keys under "campaign[...]"
            data.append('campaign[title]', formData.title);
            data.append('campaign[category_id]', formData.category_id);
            data.append('campaign[funding_goal]', formData.funding_goal);
            data.append('campaign[deadline]', formData.deadline);
            data.append('campaign[story]', formData.story);
            data.append('campaign[video_url]', formData.video_url);

            if (formData.cover_image instanceof File) {
                data.append('campaign[cover_image]', formData.cover_image);
            }

            await updateCampaignById(id, data);

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
        <div className="w-full mx-auto my-10 px-6 py-10 max-w-5xl shadow-2xl rounded-2xl bg-white animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
                Update Campaign
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="category_id" className="block text-gray-700 font-semibold mb-2">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                {/* Funding Goal */}
                <div>
                    <label htmlFor="funding_goal" className="block text-gray-700 font-semibold mb-2">
                        Funding Goal (NPR)
                    </label>
                    <input
                        type="number"
                        id="funding_goal"
                        name="funding_goal"
                        value={formData.funding_goal}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                    />
                </div>

                {/* Deadline */}
                <div>
                    <label htmlFor="deadline" className="block text-gray-700 font-semibold mb-2">
                        Deadline
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label htmlFor="cover_image" className="block text-gray-700 font-semibold mb-2">
                        Cover Image
                    </label>
                    <div className="mb-4">
                        {formData.cover_image ? (
                            <img
                                src={URL.createObjectURL(formData.cover_image)}
                                alt="Selected Cover"
                                className="w-full h-[30rem] object-cover rounded-xl shadow-lg"
                            />
                        ) : campaign.cover_image_url ? (
                            <img
                                src={campaign.cover_image_url}
                                alt="Current Cover"
                                className="w-full h-[30rem] object-cover rounded-xl shadow-lg"
                            />
                        ) : null}
                    </div>
                    <input
                        type="file"
                        id="cover_image"
                        name="cover_image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Video URL */}
                <div>
                    <label htmlFor="video_url" className="block text-gray-700 font-semibold mb-2">
                        Video URL
                    </label>
                    <input
                        type="url"
                        id="video_url"
                        name="video_url"
                        value={formData.video_url}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Story */}
                <div>
                    <label htmlFor="story" className="block text-gray-700 font-semibold mb-2">
                        Story
                    </label>
                    <textarea
                        id="story"
                        name="story"
                        value={formData.story}
                        onChange={handleInputChange}
                        rows="6"
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Submit */}
                <div className="s">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition duration-300 ease-in-out"
                    >
                        Update Campaign
                    </button>
                </div>
            </form>
        </div>
    );
}
export default UpdateCampaignPage;