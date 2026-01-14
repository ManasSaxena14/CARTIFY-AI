import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader, Eye, Trash2, Package, Search,
    Filter, Calendar, DollarSign, Clock, ChevronDown,
    ShieldCheck, Truck, ShoppingBag, AlertCircle, X, ArrowUpRight, Activity
} from 'lucide-react';
import adminAPI from '../../api/adminAPI';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { TableSkeleton } from '../../components/common/Skeleton';

const OrderListAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewMode, setViewMode] = useState('all'); // all, processing, shipped, delivered
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllOrders();
            setOrders(response.data.orders);
        } catch {
            // Silently handle fetch error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        const toastId = toast.loading('Dispatching status update protocol...');
        try {
            await adminAPI.updateOrderStatus(id, status);
            toast.success('Logistics status synchronized', { id: toastId });
            fetchOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder({ ...selectedOrder, orderStatus: status });
            }
        } catch {
            toast.error('Failed to update status', { id: toastId });
        }
    };

    const handleDelete = async () => {
        const toastId = toast.loading('Purging manifest from records...');
        try {
            await adminAPI.deleteOrder(confirmDelete.id);
            toast.success('Manifest entry eliminated', { id: toastId });
            setConfirmDelete({ open: false, id: null });
            fetchOrders();
        } catch {
            toast.error('Failed to delete order', { id: toastId });
        }
    };

    const filteredOrders = orders
        .filter(o =>
            o._id.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(o => viewMode === 'all' || o.orderStatus.toLowerCase() === viewMode.toLowerCase());

    if (loading) return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="w-48 h-4 bg-slate-100 rounded-full" />
                    <div className="w-96 h-12 bg-slate-100 rounded-full" />
                </div>
            </header>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100">
                <TableSkeleton rows={8} cols={5} />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                        <ShoppingBag className="w-4 h-4 fill-primary" />
                        Logistics Command
                    </div>
                    <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-tight">
                        Order <span className="text-primary italic">Manifests.</span>
                    </h1>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search manifests by Entry ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-text-dark"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                            className="appearance-none pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark focus:border-primary/30 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="all">All Manifests</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                    </div>
                </div>
            </div>

            {/* Modern Table Interface */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Manifest Reference</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Fulfillment Protocol</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Curation Volume</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Final Valuation</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em] text-right">Security</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order, idx) => (
                                <motion.tr
                                    key={order._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-all duration-300"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-background-light flex items-center justify-center text-primary border border-slate-100">
                                                <Package size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-mono text-[0.6rem] font-black text-text-light uppercase tracking-widest opacity-60">Entry ID: #{order._id.slice(-8)}</p>
                                                <p className="font-black text-text-dark tracking-tight">Acquisition #{idx + 1001}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="relative min-w-[140px]">
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`appearance-none w-full px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none
                                                    ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                                `}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-text-dark">{order.orderItems.length} curated assets</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-lg font-black text-primary tracking-tighter">₹{order.totalPrice}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            >
                                                <Eye size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => setConfirmDelete({ open: true, id: order._id })}
                                                className="p-3 text-secondary hover:bg-secondary/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Order Detail Modal */}
                <AnimatePresence>
                    {selectedOrder && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedOrder(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-background-light rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                            <Package size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-text-dark tracking-tighter">Manifest Details</h2>
                                            <p className="text-[0.65rem] font-black text-text-light uppercase tracking-widest opacity-60">Entry ID: #{selectedOrder._id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        <X size={20} className="text-text-dark" />
                                    </button>
                                </div>

                                <div className="p-10 overflow-y-auto space-y-12">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        {/* Logistics Status */}
                                        <div className="space-y-8">
                                            <h3 className="text-[0.7rem] font-black text-text-light uppercase tracking-[0.3em] border-b pb-4">Logistics Status</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
                                                    <span className="text-[0.55rem] font-black text-text-light uppercase tracking-widest block opacity-60">Curation Stage</span>
                                                    <span className={`text-[0.65rem] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedOrder.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        selectedOrder.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        }`}>
                                                        {selectedOrder.orderStatus}
                                                    </span>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-2xl space-y-2">
                                                    <span className="text-[0.55rem] font-black text-text-light uppercase tracking-widest block opacity-60">Revenue Flow</span>
                                                    <span className={`text-[0.65rem] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${selectedOrder.paymentInfo?.status === 'succeeded' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                        {selectedOrder.paymentInfo?.status === 'succeeded' ? 'Finalized' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Shipping Protocol */}
                                        <div className="space-y-8">
                                            <h3 className="text-[0.7rem] font-black text-text-light uppercase tracking-[0.3em] border-b pb-4">Shipping Protocol</h3>
                                            <div className="space-y-2">
                                                <p className="font-bold text-text-dark">{selectedOrder.shippingInfo.address}</p>
                                                <p className="text-sm font-medium text-text-light">{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} - {selectedOrder.shippingInfo.pinCode}</p>
                                                <p className="text-sm font-medium text-text-light">{selectedOrder.shippingInfo.country}</p>
                                                <div className="flex items-center gap-2 mt-4 text-primary font-bold">
                                                    <Activity size={16} />
                                                    <span className="text-sm">{selectedOrder.shippingInfo.phoneNo}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asset Inventory */}
                                    <div className="space-y-8">
                                        <h3 className="text-[0.7rem] font-black text-text-light uppercase tracking-[0.3em] border-b pb-4">Asset Inventory</h3>
                                        <div className="space-y-4">
                                            {selectedOrder.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                                    <div className="h-16 w-12 bg-white rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-text-dark tracking-tight">{item.name}</p>
                                                        <p className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest">{item.quantity} Units x ₹{item.price}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-primary">₹{item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Valuation Summary */}
                                    <div className="bg-text-dark p-10 rounded-[2.5rem] flex items-center justify-between text-white">
                                        <div className="space-y-1">
                                            <p className="text-[0.65rem] font-black uppercase tracking-widest opacity-50">Total Manifest Valuation</p>
                                            <p className="text-3xl font-black tracking-tighter italic">₹{selectedOrder.totalPrice}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-2 group cursor-pointer">
                                                <span className="text-[0.6rem] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">View Acquisition Record</span>
                                                <ArrowUpRight size={14} className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </div>
                                            <span className="text-[0.55rem] font-bold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded">Priority Dispatch</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {filteredOrders.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <AlertCircle className="mx-auto h-12 w-12 text-slate-200" />
                        <p className="text-text-light font-bold text-[0.65rem] uppercase tracking-widest">No matching manifests identified.</p>
                    </div>
                )}
            </motion.div>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Discard Manifest?"
                message="This will permanently delete the acquisition record and logistics trajectory. This operation cannot be reversed."
                confirmText="Purge Manifest"
            />
        </div>
    );
};

export default OrderListAdmin;
