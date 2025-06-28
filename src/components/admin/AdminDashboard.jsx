import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeeklyCampaignActivities, getCategoryCampaignDetails, getRecentCampaigns } from '../../services/apiService';

import {
    DollarSign,
    Users,
    Target,
    Award,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const balanceHistory = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 },
    { month: 'Jul', amount: 72000 }
];

function AdminDashboard() {
    const [weeklyActivities, setWeeklyActivities] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentCampaignsData, setRecentCampaignsData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWeeklyActivities = async () => {
            try {
                const weekly_data = await getWeeklyCampaignActivities();
                const category_data = await getCategoryCampaignDetails();
                const recent_campaigns_data = await getRecentCampaigns();
                setCategoryData(category_data.data);
                setWeeklyActivities(weekly_data.data);
                setRecentCampaignsData(recent_campaigns_data.data);
            } catch (error) {
                console.error("Error fetching weekly activities:", error);
            }
        };

        fetchWeeklyActivities();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Crowdfunding Dashboard</h1>
                <p className="text-gray-600 mt-2">Monitor platform performance and manage campaigns</p>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Funds Raised */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-md border border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-300/90 bg-opacity-20 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm opacity-80">TOTAL RAISED</div>
                            <div className="text-sm opacity-60">This Month</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">Rs. 847,592</div>
                    <div className="text-sm opacity-80 flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +12.5% from last month
                    </div>
                </div>

                {/* Active Campaigns */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">CAMPAIGNS</div>
                            <div className="text-sm text-gray-400">Active</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">324</div>
                    <div className="text-sm text-green-600 flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +8.2% from last week
                    </div>
                </div>

                {/* Total Backers */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">BACKERS</div>
                            <div className="text-sm text-gray-400">Total</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">12,847</div>
                    <div className="text-sm text-green-600 flex items-center">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +15.3% growth
                    </div>
                </div>

                {/* Success Rate */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Award className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">SUCCESS</div>
                            <div className="text-sm text-gray-400">Rate</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">68.4%</div>
                    <div className="text-sm text-red-600 flex items-center">
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                        -2.1% from last month
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Charts */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Weekly Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                    <span className="text-gray-600">Funding (Rs.)</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                                    <span className="text-gray-600">Campaigns</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                    <span className="text-gray-600">Backers</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyActivities} barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="day" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="donation" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="campaigns" fill="#06B6D4" radius={[4, 4, 0, 0]} />campaigns
                                    <Bar dataKey="doners" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Platform Revenue History */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Platform Revenue</h3>
                            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                                <option>Last 7 months</option>
                                <option>Last 12 months</option>
                                <option>Last 2 years</option>
                            </select>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={balanceHistory}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Campaign Categories */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Categories</h3>
                        <div className="space-y-4">
                            {categoryData.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div
                                            className="w-4 h-4 rounded-full mr-3"
                                            style={{ backgroundColor: category.color }}
                                        ></div>
                                        <span className="text-gray-700">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">{category.campaigns_count}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="campaigns_count"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Campaigns Table */}
            <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                        <button
                            onClick={() => navigate('/campaigns')}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                            See All
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backers</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentCampaignsData.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{campaign.title}</div>
                                            <div className="text-sm text-gray-500">{campaign.category?.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{campaign.user?.full_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            Rs {campaign.current_amount.toLocaleString()} / Rs.{campaign.funding_goal.toLocaleString()}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full"
                                                style={{ width: `${Math.min((campaign.current_amount / campaign.funding_goal) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{campaign.total_donations}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${campaign.status === 'successful'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button onClick={() => navigate(`/campaigns/${campaign.id}`)} className="text-purple-600 hover:text-purple-900">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;