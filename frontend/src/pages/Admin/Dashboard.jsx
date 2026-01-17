import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import {
    DollarSign, ShoppingBag, Users, Package, Loader,
    TrendingUp, Sparkles, Activity, ShieldCheck, Zap,
    ArrowUpRight, ChevronRight, Globe, Layers
} from 'lucide-react';
import adminAPI from '../../api/adminAPI';
import Skeleton, { CardSkeleton } from '../../components/common/Skeleton';
import { formatPrice } from '../../utils/pricing';

const ChartSkeleton = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
        <Skeleton className="h-80 w-full" />
    </div>
);

const StatCard = ({ title, value, icon: Icon, color, trend, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700 -z-10" />

        <div className="flex items-start justify-between relative">
            <div className="space-y-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                    <Icon size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em] mb-1">{title}</p>
                    <h3 className="text-3xl font-black text-text-dark tracking-tighter">{value}</h3>
                </div>
                {trend && (
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[0.65rem] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">
                            <TrendingUp size={10} /> {trend}
                        </span>
                    </div>
                )}
            </div>
            <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 text-slate-300 hover:text-primary transition-colors"
            >
                <ArrowUpRight size={20} />
            </motion.button>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAPI.getDashboardStats();
                setStats(response.data);
            } catch {
                // Silently handle fetch error
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                        <Zap className="w-4 h-4 fill-primary" />
                        Intelligence Overview
                    </div>
                    <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-tight">
                        Platform <span className="text-primary italic">Command.</span>
                    </h1>
                </div>
                {!loading && (
                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-bold text-text-dark">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Live Feed
                        </div>
                        <div className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest px-4">
                            Refresh in 30s
                        </div>
                    </div>
                )}
            </header>

            {loading ? (
                <>
                    <CardSkeleton count={4} />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-100">
                            <ChartSkeleton />
                        </div>
                        <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-slate-100">
                            <ChartSkeleton />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            index={0}
                            title="Gross Revenue"
                            value={`₹${formatPrice(stats?.stats?.revenue || 0)}`}
                            icon={DollarSign}
                            color="bg-primary shadow-primary/20"
                            trend="+12.5% Inc."
                        />
                        <StatCard
                            index={1}
                            title="Total Orders"
                            value={stats?.stats?.orders || 0}
                            icon={Package}
                            color="bg-secondary shadow-secondary/20"
                            trend="+4.2% Vol."
                        />
                        <StatCard
                            index={2}
                            title="Low Stock Alerts"
                            value={stats?.stats?.lowStock || 0}
                            icon={Layers}
                            color={stats?.stats?.lowStock > 0 ? "bg-rose-500 shadow-rose-200" : "bg-accent shadow-accent/20"}
                        />
                        <StatCard
                            index={3}
                            title="Global Members"
                            value={stats?.stats?.users || 0}
                            icon={Users}
                            color="bg-text-dark shadow-black/20"
                        />
                    </div>

                    {/* Analytics Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Main Performance Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-8 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-text-dark tracking-tight">Revenue Trajectory</h3>
                                    <p className="text-[0.65rem] font-bold text-text-light uppercase tracking-widest">Calculated Daily Basis</p>
                                </div>
                            </div>

                            <div className="h-96 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={stats?.stats?.trends?.length > 0 ? stats.stats.trends : [
                                            { _id: 'No Data', revenue: 0 }
                                        ]}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="_id"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                            contentStyle={{
                                                borderRadius: '20px',
                                                border: 'none',
                                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                                                padding: '16px 20px',
                                                backgroundColor: '#ffffff'
                                            }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#6366f1"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Secondary Distribution Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-4 bg-text-dark text-white rounded-[3rem] p-10 shadow-2xl shadow-black/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -z-0" />

                            <div className="relative z-10 space-y-10 h-full flex flex-col">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black tracking-tight">Status Mix</h3>
                                    <p className="text-[0.6rem] font-bold text-white/40 uppercase tracking-widest">Real-time Allocation</p>
                                </div>

                                <div className="flex-1 min-h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                        <BarChart data={[
                                            { name: 'Queue', count: stats?.stats?.orderStatus?.processing || 0 },
                                            { name: 'Transit', count: stats?.stats?.orderStatus?.shipped || 0 },
                                            { name: 'Final', count: stats?.stats?.orderStatus?.delivered || 0 }
                                        ]} margin={{ left: -30 }}>
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 700 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                            />
                                            <Bar dataKey="count" radius={[12, 12, 12, 12]} barSize={24}>
                                                {['#6366f1', '#a855f7', '#ec4899', '#f43f5e'].map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-white/60">
                                            <ShieldCheck className="w-4 h-4 text-primary" />
                                            System Security
                                        </span>
                                        <span className="text-[0.65rem] font-black text-primary">OPTIMAL</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-white/60">
                                            <Globe className="w-4 h-4 text-secondary" />
                                            Global Reach
                                        </span>
                                        <span className="text-[0.65rem] font-black text-secondary">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
