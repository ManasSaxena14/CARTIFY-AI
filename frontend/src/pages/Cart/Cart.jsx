import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Trash2, Plus, Minus, ArrowRight, ShoppingBag,
    Loader, Sparkles, ShieldCheck, Zap, Info
} from 'lucide-react';
import cartAPI from '../../api/cartAPI';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.getMyCart();
            setCart(response.data.data);
        } catch {
            // Silently handle sync failure
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            setUpdating(true);
            await cartAPI.updateCartItem(productId, newQuantity);
            await fetchCart();
        } catch {
            // Silently handle error
        } finally {
            setUpdating(false);
        }
    };

    const removeItem = async (productId) => {
        try {
            setUpdating(true);
            await cartAPI.removeFromCart(productId);
            await fetchCart();
        } catch {
            // Silently handle error
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                    <ShoppingBag className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-text-light font-bold text-lg tracking-widest uppercase">Syncing Cart...</p>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto text-center py-24 px-4"
            >
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-[3rem] bg-background-light mb-10 border border-slate-100 shadow-inner">
                    <ShoppingBag className="h-16 w-16 text-slate-200" />
                </div>
                <h2 className="text-4xl font-black text-text-dark tracking-tighter mb-4">Your collection is empty.</h2>
                <p className="text-text-light text-lg mb-10 max-w-md mx-auto leading-relaxed">It seems you haven't curated any items yet. Start exploring our premium selections to begin.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-text-dark text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                    Explore Collections <ArrowRight className="w-5 h-5" />
                </Link>
            </motion.div>
        );
    }

    const subtotal = cart.totalPrice;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <header className="mb-12">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-2">
                    <Sparkles className="w-4 h-4" />
                    Your Curation
                </div>
                <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-none">
                    Shopping <span className="text-primary italic">Bag.</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-8 pb-4 border-b border-slate-100 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">
                        <div className="col-span-6">Item Selection</div>
                        <div className="col-span-3 text-center">Adjustment</div>
                        <div className="col-span-3 text-right">Valuation</div>
                    </div>

                    <AnimatePresence initial={false}>
                        {cart.items.map((item) => (
                            <motion.div
                                key={item.product._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group relative bg-white md:bg-transparent md:hover:bg-white md:p-8 p-6 rounded-[2.5rem] md:grid md:grid-cols-12 md:gap-4 items-center border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500"
                            >
                                {/* Selection Info */}
                                <div className="col-span-6 flex items-center gap-6">
                                    <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-[2rem] bg-background-light border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={item.product.images && item.product.images[0] ? item.product.images[0].url : 'https://placehold.co/200'}
                                            alt={item.product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[0.6rem] font-bold text-primary uppercase tracking-widest">{item.product.category || 'Curated'}</span>
                                        <Link to={`/products/${item.product._id}`} className="block font-black text-text-dark text-xl hover:text-primary transition-colors line-clamp-1 leading-tight">
                                            {item.product.name}
                                        </Link>
                                        <div className="flex items-center gap-2 pt-1">
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="text-[0.65rem] font-bold text-secondary uppercase tracking-widest hover:underline underline-offset-4"
                                            >
                                                Relinquish Item
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Adjustment Controls */}
                                <div className="col-span-3 flex justify-center mt-6 md:mt-0">
                                    <div className="flex items-center gap-2 p-1 bg-background-light rounded-2xl ring-1 ring-slate-100">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-text-dark hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                                            disabled={updating || item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-8 text-center text-lg font-black text-text-dark tracking-tighter">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-text-dark hover:border-primary hover:text-primary transition-all disabled:opacity-30"
                                            disabled={updating}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Valuation */}
                                <div className="col-span-3 text-right mt-4 md:mt-0">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-text-dark tracking-tighter leading-none">₹{item.price * item.quantity}</span>
                                        {item.quantity > 1 && (
                                            <span className="text-[0.65rem] font-bold text-text-light/60 uppercase tracking-widest mt-1">₹{item.price} UNIT</span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary Summary */}
                <aside className="lg:col-span-4 lg:sticky lg:top-24">
                    <div className="bg-text-dark text-white p-10 rounded-[3.5rem] shadow-[0_48px_80px_-32px_rgba(0,0,0,0.3)] relative overflow-hidden">
                        <Zap className="absolute -top-10 -right-10 w-48 h-48 opacity-5 text-white" />

                        <h2 className="text-3xl font-black tracking-tighter mb-10 relative">Summary.</h2>

                        <div className="space-y-6 mb-10 relative">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/10">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Selection Subtotal</span>
                                <span className="font-black text-xl tracking-tighter">₹{subtotal}</span>
                            </div>

                            <div className="flex justify-between items-center px-4">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Logistics (Express)</span>
                                <span className="text-xs font-black uppercase tracking-widest text-primary-light bg-primary/20 px-3 py-1 rounded-full">Complimentary</span>
                            </div>

                            <div className="flex justify-between items-center px-4 pt-4 border-t border-white/10">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                                        Tax Levy (18%) <Info className="w-3 h-3 opacity-40" />
                                    </span>
                                </div>
                                <span className="font-bold tracking-tighter opacity-80 font-mono text-sm leading-none">₹{tax}</span>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/20 mb-10 relative">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-black uppercase tracking-[0.2em] mb-1">Grand Cumulative</span>
                                <span className="text-5xl font-black tracking-tighter text-primary-light">₹{total}</span>
                            </div>
                        </div>

                        <div className="space-y-4 relative">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/shipping')}
                                className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all"
                            >
                                Secure Checkpoint <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                            </motion.button>

                            <div className="flex items-center justify-center gap-2 text-[0.6rem] font-bold text-white/40 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4" />
                                Military-Grade Encryption Active
                            </div>
                        </div>
                    </div>

                    {/* Promo Mini Card */}
                    <div className="mt-8 p-8 bg-background-light rounded-[2.5rem] border border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-text-dark tracking-tight leading-none mb-1">AI Curation Reward</h4>
                            <p className="text-xs font-bold text-text-light leading-snug">This selection qualifies for future AI-personalized bundles.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;
