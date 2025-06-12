import { useEffect, useState, useCallback } from "react";
import { Search, SlidersHorizontal, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCategories, fetchSearchedCampaigns } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import CampaignCard from "./CampaignCard"; // Ensure this path is correct
import { toast } from "react-toastify";

// Mock hook for demonstration
const useQuery = () => {
    return new URLSearchParams(window.location.search);
};

const SearchMain = () => {
    const query = useQuery();
    const navigate = useNavigate();

    // Core State
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState([]);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState(query.get("name") || "");
    const [selectedStatus, setSelectedStatus] = useState(query.get("status") || "");
    const [selectedCategory, setSelectedCategory] = useState(query.get("category") || "");
    const [sortBy, setSortBy] = useState("recent");
    const [minGoal, setMinGoal] = useState("");
    const [maxGoal, setMaxGoal] = useState("");

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // For total results count

    const PER_PAGE = 6; // Define items per page here

    // Fetch initial data like categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response.data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
                toast.error("Failed to load categories.");
            }
        };
        loadCategories();
    }, []);

    // Main search function - now replaces data instead of appending
    const searchCampaigns = useCallback(async (newPage) => {
        setLoading(true);
        try {
            const searchParams = {
                name: searchTerm.trim(),
                status: selectedStatus,
                category: selectedCategory,
                sort_by: sortBy,
                min_goal: minGoal,
                max_goal: maxGoal,
                page: newPage,
                per_page: PER_PAGE
            };

            // Remove empty parameters
            Object.keys(searchParams).forEach(key => {
                if (!searchParams[key]) delete searchParams[key];
            });

            const response = await fetchSearchedCampaigns(searchParams);
            const campaigns = response.data;
            const pagination = response.pagination;

            setResults(campaigns || []);

            if (pagination) {
                setTotalPages(pagination.total_pages || 1);
                setTotalCount(pagination.total_count || 0);
            }

        } catch (error) {
            console.error("Search failed", error);
            toast.error("An error occurred while searching.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, selectedStatus, selectedCategory, sortBy, minGoal, maxGoal]);

    // Effect to trigger a new search when filters/sorting change. Resets to page 1.
    useEffect(() => {
        setPage(1); // Reset page to 1 on any filter change
        searchCampaigns(1); // Search for the first page
    }, [searchTerm, selectedStatus, selectedCategory, sortBy, minGoal, maxGoal]);


    // Effect to fetch data when page number changes
    useEffect(() => {
        searchCampaigns(page);
        // Scroll to top of results when page changes
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }, [page, searchCampaigns]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setSelectedCategory("");
        setSortBy("recent");
        setMinGoal("");
        setMaxGoal("");
        setPage(1);
    };



    const sortOptions = [
        { value: "recent", label: "Most Recent" },
        { value: "popular", label: "Most Popular" },
        { value: "funded", label: "Most Funded" },
        { value: "ending", label: "Ending Soon" }
    ];
    const activeFiltersCount = [selectedStatus, selectedCategory, minGoal, maxGoal].filter(Boolean).length;
    const statusOptions = ["Active", "Funded", "Ended"];

    return (
        <div className="min-h-screen bg-gray-50 pt-14 mt-2">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                            <Search className="w-8 h-8 text-blue-600" />
                            Search Campaigns
                        </h1>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex-grow">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() => {
                                        console.log('Toggle clicked');
                                        setShowFilters(!showFilters)
                                    }}
                                    className={`flex items-center justify-center w-full lg:w-auto gap-2 px-4 py-3 border rounded-lg transition-colors ${showFilters || activeFiltersCount > 0
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showFilters && (
                <div className={`bg-white border-b border-gray-200 animate-fade-slide-down`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
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
                        </div>
                        {activeFiltersCount > 0 && (
                            <div className="mt-4">
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* --- NEW: Pagination and Sorting Controls --- */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Left Side: Sorting */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                id="sortBy"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Middle: Results Count */}
                        <div className="text-sm font-medium text-gray-800">
                            {loading ? (
                                <span>Searching...</span>
                            ) : (
                                <span>
                                    {totalCount} {totalCount === 1 ? 'campaign' : 'campaigns'} found
                                </span>
                            )}
                        </div>

                        {/* Right Side: Page Navigation */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page <= 1 || loading}
                                    className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages || loading}
                                    className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                        <p className="mt-4 text-lg">Searching Campaigns...</p>
                    </div>
                ) : results.length > 0 ? (
                    <>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {results.map((campaign) => (
                                <CampaignCard key={campaign.id} campaign={campaign} />
                            ))}
                        </div>
                        {/* --- Bottom Pagination Controls (Optional but good for UX) --- */}
                        <div className="flex justify-center mt-12">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={page <= 1 || loading}
                                        className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={page >= totalPages || loading}
                                        className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 text-gray-300 mx-auto" />
                        <h3 className="mt-4 text-xl font-semibold">No Campaigns Found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-6 bg-blue-100 text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
};


export default SearchMain;