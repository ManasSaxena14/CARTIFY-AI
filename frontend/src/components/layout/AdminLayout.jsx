import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authAPI from '../../api/authAPI';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Package,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const AdminLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await authAPI.getMe();
                if (response.data.data.role !== 'admin') {
                    navigate('/'); // Not authorized
                }
            } catch {
                // Silently handle logout error
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        checkAdmin();
    }, [navigate]);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', path: '/admin/orders', icon: Package },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    ];

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin...</div>;

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed h-full z-20`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isOpen && (
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                            Cartify Admin
                        </span>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-500">
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map(item => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                       ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                                    }
                    `}
                            >
                                <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
                                {isOpen && <span className="ml-3 font-medium">{item.name}</span>}
                                {isOpen && isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors ${!isOpen && 'justify-center'}`}
                    >
                        <LogOut size={20} />
                        {isOpen && <span className="ml-3 font-medium">Exit Admin</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'} p-8 overflow-y-auto`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
