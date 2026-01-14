import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Loader, Package, MapPin, CreditCard, ArrowLeft,
    Sparkles, ShieldCheck, Truck, Clock, Info,
    ChevronLeft, Box, CheckCircle
} from 'lucide-react';
import orderAPI from '../../api/orderAPI';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/pricing';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderAPI.getOrderById(id);
                setOrder(response.data.order);
            } catch {
                toast.error('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                    <Box className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-text-light font-bold text-[0.65rem] tracking-[0.3em] uppercase">Retrieving Manifest...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto text-center py-24 px-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[3rem] bg-secondary/5 mb-8 border border-secondary/10">
                    <Info className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-3xl font-black text-text-dark tracking-tighter mb-4">Entry Not Found.</h2>
                <p className="text-text-light font-medium mb-10 leading-relaxed">The requested order manifest could not be located in our secure vault.</p>
                <Link to="/profile" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm hover:gap-3 transition-all">
                    <ChevronLeft className="w-5 h-5" /> Return to Archives
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <Link to="/profile" className="group inline-flex items-center text-[0.65rem] font-black text-text-light hover:text-primary uppercase tracking-[0.2em] transition-all">
                        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Archives
                    </Link>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                            <Sparkles className="w-4 h-4" />
                            Confirmed Acquisition
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tighter leading-none">
                            Entry <span className="text-primary italic">#{order._id.slice(-8)}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="text-[0.65rem] font-black text-text-light/60 uppercase tracking-widest">Fulfillment Status</span>
                    <div className={`px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest text-xs border
                        ${order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                    `}>
                        {order.orderStatus}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 overflow-hidden relative">
                        <h2 className="text-2xl font-black text-text-dark tracking-tighter mb-10 flex items-center gap-3">
                            <Package className="h-6 w-6 text-primary" /> Curated Manifest
                        </h2>

                        <div className="space-y-8">
                            {order.orderItems.map((item) => (
                                <div key={item.product} className="flex items-center gap-6 group">
                                    <div className="h-24 w-24 flex-shrink-0 bg-background-light rounded-[2rem] overflow-hidden border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Link to={`/products/${item.product}`} className="font-black text-xl text-text-dark hover:text-primary transition-colors line-clamp-1 leading-tight">
                                            {item.name}
                                        </Link>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[0.65rem] font-bold text-text-light/60 uppercase tracking-widest">Qty: {item.quantity}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                            <span className="text-[0.65rem] font-bold text-primary uppercase tracking-widest">Val: ₹{formatPrice(item.price)}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-black text-text-dark tracking-tighter">₹{formatPrice(item.quantity * item.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-background-light rounded-[3rem] p-10 border border-slate-100 space-y-6">
                            <h3 className="text-lg font-black text-text-dark tracking-tight flex items-center gap-3">
                                <Truck className="h-5 w-5 text-primary" /> Destination
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest opacity-60">Recipient</p>
                                    <p className="font-black text-text-dark">{order.user?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest opacity-60">Coordinates</p>
                                    <p className="text-sm font-bold text-text-dark leading-relaxed">
                                        {order.shippingInfo.address}, <br />
                                        {order.shippingInfo.city}, {order.shippingInfo.state} <br />
                                        {order.shippingInfo.pinCode}, {order.shippingInfo.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-light rounded-[3rem] p-10 border border-slate-100 space-y-6">
                            <h3 className="text-lg font-black text-text-dark tracking-tight flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-primary" /> Settlement
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest opacity-60">Transaction Status</p>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[0.6rem] font-black uppercase tracking-widest">
                                        {order.paymentInfo.status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest opacity-60">System Timestamp</p>
                                    <p className="text-sm font-bold text-text-dark">
                                        {new Date(order.paidAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4">
                    <div className="bg-text-dark text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <h2 className="text-3xl font-black tracking-tighter mb-10">Final Audit.</h2>
                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-40">Subtotal</span>
                                <span className="font-black text-lg tracking-tighter">₹{formatPrice(order.itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center px-2">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-40">Tax</span>
                                <span className="font-black text-lg tracking-tighter">₹{formatPrice(order.taxPrice)}</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 mt-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black uppercase tracking-[0.2em]">Total</span>
                                    <span className="text-5xl font-black text-primary-light tracking-tighter">₹{formatPrice(order.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default OrderDetail;
