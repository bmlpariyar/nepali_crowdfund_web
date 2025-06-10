import React, { use, useEffect, useState } from 'react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { fetchCategories } from '../../services/apiService'

const HeroSection = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');


    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await fetchCategories(); // ✅ your custom API service
                setCategories(response.data || []);

            } catch (err) {
                console.error("Error fetching categories:", err);
                toast.error("Failed to load categories. Please try refreshing.");
            } finally {
                setIsLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();

        if (searchQuery) queryParams.append("name", searchQuery);
        if (selectedStatus) queryParams.append("status", selectedStatus);
        if (selectedCategory) queryParams.append("category", selectedCategory);

        navigate(`/search?${queryParams.toString()}`);
    };

    return (
        <section className="relative py-20 overflow-hidden mt-12">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                        Empowering Communities <br />
                        <span className="text-4xl md:text-6xl">One Campaign at a Time</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed">
                        Join thousands of changemakers creating positive impact across Nepal and beyond.
                        Discover, support, and launch campaigns that matter.
                    </p>

                    {/* <!-- Search Form --> */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-white/30 animate-slide-up">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Find Your Cause</h2>
                        <form id="searchForm" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* <!-- Campaign Name Input --> */}
                                <div className="space-y-2">
                                    <label htmlFor="campaignName" className="block text-sm font-semibold text-slate-700">Campaign Name</label>
                                    <input
                                        type="text"
                                        id="campaignName"
                                        name="name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search campaigns..."
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>

                                {/* <!-- Campaign Status Dropdown --> */}
                                <div className="space-y-2">
                                    <label htmlFor="campaignStatus" className="block text-sm font-semibold text-slate-700">Status</label>
                                    <select
                                        id="campaignStatus"
                                        name="status"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                    >
                                        <option value="">All Status</option>
                                        <option value="">Completed</option>
                                        <option value="">Active</option>

                                    </select>
                                </div>

                                {/* <!-- Campaign Category Dropdown --> */}
                                <div className="space-y-2">
                                    <label htmlFor="campaignCategory" className="block text-sm font-semibold text-slate-700">Category</label>
                                    <select
                                        id="campaignCategory"
                                        name="category"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                                    >
                                        <option value="">All Categories</option>
                                        {isLoadingCategories ? (
                                            <option disabled>Loading categories...</option>
                                        ) : (
                                            categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>

                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            {/* <!-- Search Button --> */}
                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    onClick={handleSearch}
                                    className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse-glow"
                                >
                                    🔍 Search Campaigns
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* <!-- CTA Buttons --> */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => navigate('/campaigns')}
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                            Browse All Campaigns
                        </button>
                        <button
                            onClick={() => navigate('/create/campaign/step1')}
                            className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
                            Create your campaign
                        </button>
                    </div>
                </div>
            </div>

            {/* <!-- Floating Elements --> */}
            <div className="absolute top-30 left-10 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-96 left-50 w-44 h-44 bg-gradient-to-r from-green-300 to-cyan-600 rounded-full opacity-20 animate-float" style={{ animationDelay: '-3s' }}></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '-4s' }}></div>
        </section >
    )
}

export default HeroSection