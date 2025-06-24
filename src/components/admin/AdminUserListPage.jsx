import React, { useState, useEffect } from 'react';
import { getUserCountDetails, adminFetchUsers } from '../../services/apiService';
import {
    Search,
    Filter,
    Download,
    Plus,
    MoreVertical,
    Edit,
    Trash2,
    Shield,
    ShieldOff,
    Mail,
    User,
    Calendar,
    DollarSign,
    Target,
    Users,
    Eye,
    Ban,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

function AdminUserListPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRole, setFilterRole] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [userCountDetails, setUserCountDetails] = useState({
        total_users: 0,
        active_users: 0,
        creators: 0,
        admins: 0
    });
    const [usersPerPage] = useState(10);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await adminFetchUsers();

                // Handle different possible response structures
                const userData = response?.data?.users || response?.users || response?.data || response || [];
                setUsers(Array.isArray(userData) ? userData : []);
            } catch (err) {
                console.error("Error fetching users for admin:", err);
                setError("Failed to fetch users. Please try again.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Fetch user count details
    useEffect(() => {
        const fetchUserCountDetails = async () => {
            try {
                const response = await getUserCountDetails();
                const countData = response?.data || response || {};

                setUserCountDetails({
                    total_users: countData.total_users || 0,
                    active_users: countData.active_users || 0,
                    creators: countData.creators || 0,
                    admins: countData.admins || 0
                });
            } catch (err) {
                console.error("Error fetching user count details:", err);
                // Don't set error for count details, just use defaults
                setUserCountDetails({
                    total_users: 0,
                    active_users: 0,
                    creators: 0,
                    admins: 0
                });
            }
        };

        fetchUserCountDetails();
    }, []);

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        // Safe property access with fallbacks
        const fullName = user?.full_name || '';
        const email = user?.email || '';
        const status = user?.is_active || false;
        const isAdmin = user?.is_admin || false;

        const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || status === filterStatus;
        const matchesRole = filterRole === 'all' ||
            (filterRole === 'admin' && isAdmin) ||
            (filterRole === 'user' && !isAdmin);

        return matchesSearch && matchesStatus && matchesRole;
    });

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === currentUsers.length && currentUsers.length > 0) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(currentUsers.map(user => user.id));
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Active' },
            suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Suspended' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Pending' }
        };

        const config = statusConfig[status] || statusConfig.active;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) return 'Rs. 0';
        return 'Rs. ' + new Intl.NumberFormat('en-IN').format(amount);
    };



    // Refresh data function
    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersResponse, countResponse] = await Promise.all([
                adminFetchUsers(),
                getUserCountDetails()
            ]);

            const userData = usersResponse?.data?.users || usersResponse?.users || usersResponse?.data || usersResponse || [];
            setUsers(Array.isArray(userData) ? userData : []);

            const countData = countResponse?.data || countResponse || {};
            setUserCountDetails({
                total_users: countData.total_users || 0,
                active_users: countData.active_users || 0,
                creators: countData.creators || 0,
                admins: countData.admins || 0
            });
        } catch (err) {
            console.error("Error refreshing data:", err);
            setError("Failed to refresh data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600 mt-2">Manage platform users, creators, and backers</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Refresh
                        </button>
                        <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </button>
                        <button className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{userCountDetails.total_users}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {userCountDetails.active_users}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className='flex items-center'>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Creators</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {userCountDetails.creators}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Shield className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {userCountDetails.admins}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="pending">Pending</option>
                            </select>

                            <select
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="user">Users</option>
                            </select>
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                    {selectedUsers.length} selected
                                </span>
                                <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                                    Delete
                                </button>
                                <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors">
                                    Suspend
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all' || filterRole !== 'all'
                                ? "Try adjusting your search or filters."
                                : "Get started by adding a new user."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contributions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {user.user_profile?.profile_picture_url ? (
                                                    <img
                                                        src={user.user_profile.profile_picture_url}
                                                        alt={user.full_name || 'User Avatar'}
                                                        className="w-10 h-10 rounded-full mr-4 border border-gray-300 object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-10 h-10 text-gray-400 mr-4" />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.full_name || 'Unknown User'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {user.is_admin && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        Admin
                                                    </span>
                                                )}
                                                {getStatusBadge(user.status)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="space-y-1">
                                                <div className="flex items-center">
                                                    <Target className="w-4 h-4 text-blue-500 mr-1" />
                                                    <span>{user.user_profile?.total_created_campaigns || 0} campaigns</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                                                    <span>{user.user_profile?.total_donations || 0} backed</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="space-y-1">
                                                <div>Raised: {formatCurrency(user.user_profile?.total_raised_amount)}</div>
                                                <div className="text-gray-500">Donated: {formatCurrency(user.user_profile?.total_donated_amount)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="space-y-1">
                                                <div>{formatDate(user.created_at)}</div>
                                                <div className="text-xs">
                                                    Last active: {formatDate(user.last_active)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    className="text-purple-600 hover:text-purple-900 p-1"
                                                    title="View user"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Edit user"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 p-1"
                                                    title="Send email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-gray-600 hover:text-gray-900 p-1"
                                                    title="More actions"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                                    <span className="font-medium">{filteredUsers.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                                        let pageNumber;
                                        if (totalPages <= 7) {
                                            pageNumber = i + 1;
                                        } else if (currentPage <= 4) {
                                            pageNumber = i + 1;
                                        } else if (currentPage >= totalPages - 3) {
                                            pageNumber = totalPages - 6 + i;
                                        } else {
                                            pageNumber = currentPage - 3 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                    ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUserListPage;