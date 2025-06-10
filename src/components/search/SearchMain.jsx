import { useEffect, useState } from "react";
import { Search, Filter, Calendar, Tag, Users, Loader2, AlertCircle, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { fetchCategories, fetchSearchedCampaigns } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";



// Mock hook for demonstration - replace with actual useLocation hook
const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

const SearchMain = () => {
    const query = useQuery();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    // Search states
    const [searchTerm, setSearchTerm] = useState(query.get("name") || "");
    const [selectedStatus, setSelectedStatus] = useState(query.get("status") || "");
    const [selectedCategory, setSelectedCategory] = useState(query.get("category") || "");
    const [sortBy, setSortBy] = useState("recent");
    const [minGoal, setMinGoal] = useState("");
    const [maxGoal, setMaxGoal] = useState("");

    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);


    useEffect(() => {
        const loadCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await fetchCategories();
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
    // Filter options
    const statusOptions = ["", "Active", "Funded", "Ended"];
    const sortOptions = [
        { value: "recent", label: "Most Recent" },
        { value: "popular", label: "Most Popular" },
        { value: "funded", label: "Most Funded" },
        { value: "ending", label: "Ending Soon" }
    ];

    const handleCampaignClick = (id) => {
        navigate(`/campaigns/${id}`);
    }

    // Search and filter function
    // Replace your existing searchCampaigns function in the React component
    const searchCampaigns = async () => {
        setLoading(true);

        try {
            const searchParams = {
                name: searchTerm.trim(),
                status: selectedStatus,
                category: selectedCategory,
                sort_by: sortBy,
                min_goal: minGoal,
                max_goal: maxGoal,
                page: 1,
                per_page: 6
            };

            // Remove empty parameters
            Object.keys(searchParams).forEach(key => {
                if (!searchParams[key]) {
                    delete searchParams[key];
                }
            });

            const response = await fetchSearchedCampaigns(searchParams);
            setResults(response.data || []);

        } catch (error) {
            console.error("Search failed", error);
            // You might want to show an error message to the user
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial search on component mount
    useEffect(() => {
        if (searchTerm || selectedStatus || selectedCategory) {
            searchCampaigns();
        }
    }, [searchTerm, selectedStatus, selectedCategory, sortBy, minGoal, maxGoal]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedCategory("");
        setSortBy("recent");
        setMinGoal("");
        setMaxGoal("");
    };



    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'funded': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getProgressPercentage = (raised, goal) => {
        return Math.min((raised / goal) * 100, 100);
    };

    const activeFiltersCount = [selectedStatus, selectedCategory, minGoal, maxGoal].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50 pt-14 mt-2">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Search className="w-8 h-8 text-blue-600" />
                                Search Campaigns
                            </h1>

                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center  gap-6">
                            {/* Search Bar */}
                            <div className="flex-2 max-w-5xl">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search campaigns by name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && searchCampaigns()}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${showFilters || activeFiltersCount > 0
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>Filters</span>
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>

                                <button
                                    onClick={searchCampaigns}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    {statusOptions.slice(1).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Goal Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Goal ($)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minGoal}
                                    onChange={(e) => setMinGoal(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Goal ($)</label>
                                <input
                                    type="number"
                                    placeholder="No limit"
                                    value={maxGoal}
                                    onChange={(e) => setMaxGoal(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 sm:mt-0 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all filters
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Results */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <hr className="border-3 my-2 text-indigo-600/20 rounded-full max-w-[12rem]" />
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">

                                Search Results
                                {!loading && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        ({results.length} {results.length === 1 ? 'campaign' : 'campaigns'} found)
                                    </span>
                                )}
                            </h2>

                            {searchTerm && !loading && (
                                <div className="text-sm text-gray-600">
                                    Results for "<span className="font-medium">{searchTerm}</span>"
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                <div className="text-center">
                                    <p className="text-lg font-medium text-gray-900 mb-2">Searching campaigns...</p>
                                    <p className="text-gray-600">Please wait while we find the best matches</p>
                                </div>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-gray-900 mb-2">No campaigns found</p>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your search terms or filters
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {results.map((campaign) => (
                                    <div
                                        onClick={() => handleCampaignClick(campaign.id)}
                                        key={campaign.id}
                                        className="group bg-white/80 cursor-pointer backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-white/20 overflow-hidden animate-slide-up"
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
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SearchMain;