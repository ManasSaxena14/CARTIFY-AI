import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Loader, Bot, ChevronDown, ShoppingBag, LayoutDashboard, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import cartAPI from '../../api/cartAPI';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!user) {
                setCartItemsCount(0);
                return;
            }
            try {
                const response = await cartAPI.getMyCart();
                const itemsCount = response.data.data?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                setCartItemsCount(itemsCount);
            } catch {
                setCartItemsCount(0);
            }
        };

        fetchCartCount();

        // Listen for custom event 'cart-updated' to refresh count
        window.addEventListener('cart-updated', fetchCartCount);
        return () => window.removeEventListener('cart-updated', fetchCartCount);
    }, [user]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setSearching(true);
        try {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        } catch (_err) {
            // Silently handle logout failure
        } finally {
            setSearching(false);
        }
    };

    const categories = [
        'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones',
        'Food', 'Books', 'Clothing', 'Beauty', 'Sports', 'Outdoor', 'Home', 'Automotive'
    ];

    const navLinks = [
        { name: 'Catalog', path: '/products' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-100 py-3'
                : 'bg-white py-5'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 group whitespace-nowrap"
                    >
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                            <img src={logo} alt="Cartify AI Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-2xl font-display tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Cartify<span className="text-indigo-600">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Center Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {/* Categories Dropdown */}
                        <Link
                            to="/categories"
                            className="text-[15px] font-display text-slate-600 hover:text-indigo-600 transition-colors py-2"
                        >
                            Categories
                        </Link>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-[15px] font-display text-slate-600 hover:text-indigo-600 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </nav>

                    {/* AI Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md relative group">
                        <form onSubmit={handleSearch} className="w-full relative">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ask AI: 'Premium watches under ₹5000'..."
                                    className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all text-[14px]"
                                />
                                <div className="absolute right-3 flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-display text-slate-400 uppercase tracking-widest pointer-events-none group-focus-within:opacity-0 transition-opacity">
                                    AI Search
                                </div>
                                {searching && (
                                    <Loader className="absolute right-4 h-5 w-5 animate-spin text-indigo-500" />
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-5">
                        <Link
                            to="/cart"
                            className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        {/* Watchlist Icon */}
                        {user && (
                            <Link to="/watchlist" className="hidden md:flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all group mr-2">
                                <Heart className="h-5 w-5 fill-transparent group-hover:fill-current transition-all" />
                            </Link>
                        )}

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-xs font-display text-slate-900 leading-none">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 mt-1 capitalize">{user.role}</p>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-64 z-[120]">
                                        <div
                                            className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 ring-8 ring-black/5"
                                            onMouseLeave={() => setShowUserMenu(false)}
                                        >
                                            <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                                <p className="text-xs font-display text-slate-400 uppercase tracking-widest">Signed in as</p>
                                                <p className="text-sm font-display text-slate-900 truncate">{user.email}</p>
                                            </div>

                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span className="text-sm font-display text-slate-900 tracking-tight">Admin Dashboard</span>
                                                </Link>
                                            )}

                                            <Link
                                                to="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <User className="h-4 w-4 text-slate-500" />
                                                <span className="text-sm font-display text-slate-700 tracking-tight">My Profile</span>
                                            </Link>

                                            <Link
                                                to="/profile?tab=orders"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <ShoppingBag className="h-4 w-4 text-slate-500" />
                                                <span className="text-sm font-display text-slate-700 tracking-tight">My Orders</span>
                                            </Link>

                                            <Link
                                                to="/watchlist"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors"
                                            >
                                                <Heart className="h-4 w-4 text-slate-500" />
                                                <span className="text-sm font-display text-slate-700 tracking-tight">My Wishlist</span>
                                            </Link>

                                            <hr className="my-1 border-slate-50" />

                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-xl transition-colors text-rose-600"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span className="text-sm font-display text-rose-600 tracking-tight">Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 text-[14px] font-display text-slate-700 hover:text-indigo-600 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-[14px] font-display shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-900"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-4 animate-slide-up">
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search with AI..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none"
                                />
                            </div>
                        </form>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-4 py-3">
                                <span className="text-xs font-display text-slate-400 uppercase tracking-widest">Collections</span>
                                <Link to="/categories" className="text-[10px] font-display text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
                            </div>
                            <div className="grid grid-cols-2 gap-1 px-2">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        to={`/products?category=${cat}`}
                                        className="px-3 py-2 text-sm font-display text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                            <hr className="my-2 border-slate-100 mx-4" />
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-4 py-3 text-sm font-display text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        {user ? (
                            <div className="mt-6 space-y-2 px-2">
                                <div className="px-4 py-3 text-xs font-display text-slate-400 uppercase tracking-widest">Account</div>
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-display">
                                        <LayoutDashboard className="h-5 w-5" />
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl font-display text-slate-700 transition-colors">
                                    <User className="h-5 w-5 text-slate-400" />
                                    My Profile
                                </Link>
                                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl font-display text-slate-700 transition-colors">
                                    <ShoppingBag className="h-5 w-5 text-slate-400" />
                                    My Orders
                                </Link>
                                <Link to="/watchlist" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl font-display text-slate-700 transition-colors">
                                    <Heart className="h-5 w-5 text-slate-400" />
                                    My Wishlist
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-50 rounded-xl font-display text-rose-600 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 flex gap-3">
                                <Link to="/login" className="flex-1 px-4 py-3 text-center text-sm font-display text-slate-900 border border-slate-200 rounded-xl">Log In</Link>
                                <Link to="/register" className="flex-1 px-4 py-3 text-center text-sm font-display text-white bg-indigo-600 rounded-xl">Join Now</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="h-px bg-transparent"></div>
        </header>
    );
};

export default Header;
