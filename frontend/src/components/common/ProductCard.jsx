import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import cartAPI from '../../api/cartAPI';
import userAPI from '../../api/userAPI';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { user } = useAuth();
    // const navigate = useNavigate();
    const [adding, setAdding] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false); // Local state for immediate feedback

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to shop");
            return;
        }

        try {
            setAdding(true);
            await cartAPI.addToCart(product._id, 1);

            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 border-l-4 border-primary`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <img
                                    className="h-12 w-12 rounded-lg object-contain"
                                    src={product.images && product.images[0] ? product.images[0].url : 'https://placehold.co/100x100'}
                                    alt=""
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-display text-text-dark">Added to Cart!</p>
                                <p className="mt-1 text-sm text-text-light line-clamp-1">{product.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        } catch {
            toast.error('Session expired. Please login.');
        } finally {
            setAdding(false);
        }
    };

    const toggleWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to save items");
            return;
        }

        try {
            if (isInWatchlist) {
                await userAPI.removeFromWatchlist(product._id);
                setIsInWatchlist(false);
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black/5 items-center p-4 gap-3`}>
                        <Heart className="h-6 w-6 text-slate-400" />
                        <p className="text-sm font-bold text-slate-600">Removed from Watchlist</p>
                    </div>
                ));
            } else {
                await userAPI.addToWatchlist(product._id);
                setIsInWatchlist(true);
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 items-center p-4 gap-3 border border-rose-100`}>
                        <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                        </div>
                        <div>
                            <p className="text-sm font-display text-text-dark">Saved to Watchlist</p>
                            <p className="text-xs text-text-light">We'll track the price for you.</p>
                        </div>
                    </div>
                ));
            }
        } catch {
            toast.error("Could not update watchlist");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500"
        >
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden bg-background-light">
                <Link to={`/products/${product._id}`} className="block w-full h-full">
                    <motion.img
                        src={product.images && product.images[0] ? product.images[0].url : 'https://placehold.co/600x800?text=Premium+Collection'}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="backdrop-blur-md bg-secondary/80 text-white text-[0.65rem] font-black px-3 py-1 rounded-full tracking-tighter uppercase ring-1 ring-white/20">
                            Low Stock
                        </span>
                    )}
                    {product.stock === 0 && (
                        <span className="backdrop-blur-md bg-text-dark/80 text-white text-[0.65rem] font-black px-3 py-1 rounded-full tracking-tighter uppercase">
                            Sold Out
                        </span>
                    )}
                    <span className="backdrop-blur-md bg-white/80 text-text-dark text-[0.65rem] font-black px-3 py-1 rounded-full tracking-tighter uppercase ring-1 ring-black/5">
                        New In
                    </span>
                </div>

                {/* Quick Actions (Hover Reveal) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={toggleWatchlist}
                        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${isInWatchlist ? 'bg-rose-50 text-rose-500' : 'bg-white text-text-dark hover:bg-rose-500 hover:text-white'}`}
                    >
                        <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                    </button>
                    <Link to={`/products/${product._id}`} className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-text-dark hover:bg-primary-dark hover:text-white transition-all transform hover:scale-110 active:scale-95">
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                <div className="flex flex-col gap-1 mb-3">
                    <span className="text-[0.7rem] font-bold text-primary-dark uppercase tracking-[0.2em] opacity-80">{product.category}</span>
                    <Link to={`/products/${product._id}`}>
                        <h3 className="text-xl font-display text-text-dark leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-display text-text-dark">{product.ratings || 0}</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[0.7rem] font-semibold text-text-light">{product.numOfReviews || 0} Reviews</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[0.6rem] font-bold text-text-light uppercase tracking-widest leading-none mb-1">Starting From</span>
                        <span className="text-3xl font-display text-text-dark tracking-tight">₹{product.price}</span>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${product.stock === 0 ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-gradient-to-br from-primary-dark to-primary text-white shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'}`}
                    >
                        {adding ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
