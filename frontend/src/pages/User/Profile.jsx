import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    User, Package, Calendar, Loader,
    LogOut, Shield, Sparkles, ShoppingBag,
    ChevronRight, ArrowUpRight, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../../api/authAPI';
import orderAPI from '../../api/orderAPI';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userRes, ordersRes] = await Promise.all([
                    authAPI.getMe(),
                    orderAPI.getMyOrders()
                ]);
                setUser(userRes.data.data);
                setOrders(ordersRes.data.orders);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeItem('accessToken');
            navigate('/');
        } catch {
            // Silently handle error
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                    <User className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-text-light font-bold text-[0.65rem] tracking-[0.3em] uppercase">Authenticating Identity...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
            {/* Premium Header / Command Center */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-text-dark rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl shadow-black/20"
            >
                {/* Decorative Sparkles */}
                <Sparkles className="absolute top-10 right-10 w-32 h-32 opacity-5 text-white animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

                <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="h-32 w-32 md:h-40 md:w-40 bg-gradient-to-br from-primary/30 to-white/10 rounded-[3rem] flex items-center justify-center border border-white/20 backdrop-blur-xl group overflow-hidden">
                                <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
                                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary p-3 rounded-2xl shadow-xl border-4 border-text-dark">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{user.name}</h1>
                                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[0.65rem] font-black uppercase tracking-widest border border-white/10">
                                        {user.role} Member
                                    </span>
                                </div>
                                <p className="text-white/50 font-medium text-lg">{user.email}</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] font-bold text-white/30 uppercase tracking-widest">Affiliation Since</span>
                                    <span className="text-sm font-black tracking-tight">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                                <div className="flex flex-col">
                                    <span className="text-[0.65rem] font-bold text-white/30 uppercase tracking-widest">Total Acquisitions</span>
                                    <span className="text-sm font-black tracking-tight">{orders.length} Curations</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="px-8 py-4 bg-white text-text-dark rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-xl shadow-white/5"
                            >
                                Management <ArrowUpRight className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-secondary/20 hover:border-secondary/40 transition-all"
                        >
                            <LogOut className="h-4 w-4" /> Relinquish Session
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Orders Section */}
            <div className="space-y-8">
                <header className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                            <Clock className="w-4 h-4" />
                            Acquisition History
                        </div>
                        <h2 className="text-3xl font-black text-text-dark tracking-tighter">Your <span className="text-primary italic">Collections.</span></h2>
                    </div>
                    {orders.length > 0 && (
                        <div className="text-[0.65rem] font-black text-text-light uppercase tracking-widest border-b-2 border-primary/20 pb-1">
                            {orders.length} Matches Found
                        </div>
                    )}
                </header>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="bg-background-light rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200"
                    >
                        <ShoppingBag className="mx-auto h-20 w-20 text-slate-300 mb-6" />
                        <h3 className="text-2xl font-black text-text-dark tracking-tight mb-2">No acquisitions detected.</h3>
                        <p className="text-text-light font-medium mb-8">Begin your journey by exploring our premium AI-curated collections.</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-text-dark text-white px-10 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-black/10"
                        >
                            Explore Curation
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence initial={false}>
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => navigate(`/order/${order._id}`)}
                                    className="group relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer overflow-hidden"
                                >
                                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                        {/* Status & ID */}
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-background-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[0.6rem] font-black text-text-light uppercase tracking-widest opacity-60">Entry ID: #{order._id.slice(-8)}</span>
                                                <h4 className="text-xl font-black text-text-dark tracking-tighter">Premium Order Confirmation</h4>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <span className="flex items-center text-xs font-bold text-text-light gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className={`px-4 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest
                                                        ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                            order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                        }
                                                    `}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing & CTA */}
                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:border-l md:border-slate-50 md:pl-10">
                                            <div className="text-left md:text-right">
                                                <span className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest block opacity-60 mb-1">Total Valuation</span>
                                                <span className="text-3xl font-black text-primary tracking-tighter leading-none">₹{order.totalPrice}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[0.65rem] font-bold text-primary uppercase tracking-widest group-hover:gap-3 transition-all pt-1">
                                                Full Disclosure <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Highlight */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
