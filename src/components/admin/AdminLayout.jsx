import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Target,
    TrendingUp,
    Settings,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    User,
    CreditCard,
    BarChart3,
    Shield,
    HelpCircle
} from 'lucide-react';

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
        { name: 'Users', href: '/admin/users', icon: Users, badge: '12' },
        { name: 'Campaigns', href: '/admin/campaigns', icon: Target, badge: '324' },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
        { name: 'Reports', href: '/admin/reports', icon: TrendingUp }
    ];

    const bottomNavigation = [
        { name: 'Settings', href: '/admin/settings', icon: Settings },
        { name: 'Security', href: '/admin/security', icon: Shield },
        { name: 'Help & Support', href: '/admin/help', icon: HelpCircle }
    ];

    const NavItem = ({ item, mobile = false }) => (
        <NavLink
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-white/40 text-gray-900 shadow'
                    : 'text-gray-800 hover:bg-white/30 hover:text-gray-900'
                }`
            }
            onClick={() => mobile && setSidebarOpen(false)}
        >
            <item.icon className="mr-3 h-5 w-5 text-gray-800 group-hover:text-gray-900 transition-colors" />
            <span className="flex-1">{item.name}</span>
            {item.badge && (
                <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-white/50 text-rose-700 group-hover:bg-white/70">
                    {item.badge}
                </span>
            )}
        </NavLink>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-30 w-72 bg-gradient-to-r from-gray-300/30 via-purple-300/80 to-rose-200/80 backdrop-blur-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}


                    {/* User Profile */}
                    <div className="px-6 py-4 bg-white/40 text-gray-900">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium">{user.full_name}</p>
                                <p className="text-xs text-gray-700">{user.email}</p>
                            </div>
                            <div className="ml-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="px-6 py-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-white/40 rounded-lg text-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
                        <div className="space-y-1">
                            {navigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="py-4">
                            <div className="border-t border-white/60" />
                        </div>

                        {/* Bottom Navigation */}
                        <div className="space-y-1">
                            {bottomNavigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-white/30 text-gray-800 text-xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                System Status: Online
                            </div>
                            <button className="hover:text-rose-600 transition-colors">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Top bar (mobile) */}
                <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-500 hover:text-gray-700 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                            </button>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
