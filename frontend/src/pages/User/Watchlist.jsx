import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader } from 'lucide-react';
import userAPI from '../../api/userAPI';
import cartAPI from '../../api/cartAPI';
import toast from 'react-hot-toast';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getWatchlist();
            setWatchlist(response.data.watchlist || []);
        } catch {
            toast.error('Could not sync watchlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await userAPI.removeFromWatchlist(productId);
            setWatchlist(prev => prev.filter(item => item._id !== productId));
            toast.success('Removed from collection');
        } catch {
            toast.error('Manifest update failed');
        }
    };

    const handleAddToCart = async (product) => {
        if (product.stock <= 0) return;
        try {
            await cartAPI.addToCart(product._id, 1);
            toast.success('Added to cart');
        } catch {
            toast.error('Could not add to cart.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <Loader className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-text-dark tracking-tighter">My Watchlist</h1>
                        <p className="text-sm font-bold text-text-light">{watchlist.length} items saved</p>
                    </div>
                </div>

                {watchlist.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl shadow-slate-100/50">
                        <Heart className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-text-dark mb-2">Your collection is empty</h2>
                        <p className="text-text-light font-medium mb-8">Save items you love to track their availability.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform"
                        >
                            Explore Collections <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {watchlist.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100/50 hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                                >
                                    {/* Image Area */}
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100">
                                        <Link to={`/products/${product._id}`}>
                                            <img
                                                src={product.images && product.images[0] ? product.images[0].url : 'https://placehold.co/600x600'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </Link>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemove(product._id)}
                                            className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-black/5 z-10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        {/* Add to Cart - Floating */}
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className="absolute bottom-4 left-4 right-4 py-3 bg-white/90 backdrop-blur-md rounded-xl text-text-dark font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-black hover:text-white"
                                        >
                                            <ShoppingBag className="w-3 h-3" />
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="mt-4 px-2 pb-2">
                                        <div className="flex justify-between items-start gap-4 mb-2">
                                            <div>
                                                <p className="text-[10px] font-black text-text-light uppercase tracking-widest mb-1">{product.category}</p>
                                                <Link to={`/products/${product._id}`}>
                                                    <h3 className="font-bold text-text-dark leading-tight line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                                                </Link>
                                            </div>
                                            <span className="font-black text-text-dark">₹{product.price}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Watchlist;
