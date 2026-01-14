import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Loader, Star, ShoppingCart, ArrowLeft, Minus, Plus,
    ShieldCheck, Truck, RotateCcw, Sparkles, Heart, Share2
} from 'lucide-react';
import productAPI from '../../api/productAPI';
import cartAPI from '../../api/cartAPI';
import orderAPI from '../../api/orderAPI';
import userAPI from '../../api/userAPI';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/pricing';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const { user } = useAuth();

    const checkWatchlistStatus = useCallback(async () => {
        try {
            const { data } = await userAPI.getWatchlist();
            const exists = data.watchlist.some(item => item._id === id);
            setIsInWatchlist(exists);
        } catch {
            // Silently handle error for non-critical check
        }
    }, [id]);

    const checkPurchaseStatus = useCallback(async () => {
        if (!user) return;
        try {
            const response = await orderAPI.getMyOrders();
            const orders = response.data.orders;
            const purchased = orders.some(order =>
                (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') &&
                order.orderItems.some(item => item.product === id)
            );
            setShowReviewForm(purchased);
        } catch {
            // Silently handle error for non-critical check
        }
    }, [id, user]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productAPI.getProductById(id);
                setProduct(response.data.product || response.data.data);
            } catch {
                setError('We couldn\'t retrieve this product details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
            if (localStorage.getItem('accessToken')) {
                checkWatchlistStatus();
                checkPurchaseStatus();
            }
        }
    }, [id, checkWatchlistStatus, checkPurchaseStatus]);

    const toggleWatchlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            if (isInWatchlist) {
                await userAPI.removeFromWatchlist(id);
                setIsInWatchlist(false);
                toast.success('Removed from Watchlist');
            } else {
                await userAPI.addToWatchlist(id);
                setIsInWatchlist(true);
                toast.success('Saved to Watchlist');
            }
        } catch {
            toast.error('Could not update watchlist');
        }
    };

    const handleAddToCart = async () => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
            return;
        }

        try {
            setAddingToCart(true);
            await cartAPI.addToCart(product._id, quantity);
            window.dispatchEvent(new CustomEvent('cart-updated'));
            toast.success('Added to Cart!');
        } catch {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewData.comment.trim() || reviewData.rating < 1 || reviewData.rating > 5) {
            toast.error('Please provide a valid rating and comment');
            return;
        }

        try {
            await productAPI.createReview(id, {
                rating: reviewData.rating,
                comment: reviewData.comment
            });
            toast.success('Review submitted successfully!');
            const response = await productAPI.getProductById(id);
            setProduct(response.data.product || response.data.data);
            setReviewData({ rating: 5, comment: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-text-light font-bold text-lg tracking-widest uppercase">Curating Detail...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-secondary/5 rounded-[3rem] border border-secondary/10 mt-10">
                <h2 className="text-3xl font-black text-text-dark mb-4">Inventory sync failed.</h2>
                <p className="text-text-light mb-8 max-w-md text-center">{error || 'This product might have been moved or is currently unavailable.'}</p>
                <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Explore Other Collections
                </button>
            </div>
        );
    }

    const trustBadges = [
        { icon: ShieldCheck, text: "Secure Checkout", detail: "SSL Encrypted" },
        { icon: Truck, text: "Free Shipping", detail: "On orders over ₹999" },
        { icon: RotateCcw, text: "Wait-Free Returns", detail: "7-Day Policy" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 mb-10"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-text-light hover:text-text-dark font-bold transition-all text-sm uppercase tracking-widest"
                >
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 group-hover:-translate-x-1 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </div>
                    Back to Collection
                </button>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="text-text-light/50 font-bold text-sm uppercase tracking-widest">{product.category}</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
                <div className="space-y-6">
                    <motion.div
                        layoutId={`product-image-${product._id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square rounded-[3rem] overflow-hidden bg-background-light border border-slate-100 group shadow-2xl shadow-slate-200/50"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                src={product.images && product.images[activeImage] ? product.images[activeImage].url : 'https://placehold.co/800x800'}
                                alt={product.name}
                                className="w-full h-full object-contain"
                            />
                        </AnimatePresence>

                        <div className="absolute top-8 right-8">
                            <button
                                onClick={toggleWatchlist}
                                className={`w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all shadow-xl shadow-black/5 ${isInWatchlist ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/80 border-white/50 text-text-dark hover:bg-white hover:scale-110'}`}
                            >
                                <Heart className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                            </button>
                        </div>
                    </motion.div>

                    <div className="flex gap-4">
                        {product.images?.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary shadow-lg shadow-primary/10' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                                <img
                                    src={product.images[i].url}
                                    className="w-full h-full object-contain"
                                    alt="thumbnail"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col pt-4">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 bg-primary/5 text-primary text-xs font-black uppercase tracking-[0.2em] rounded-full ring-1 ring-primary/10">In Stock</span>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-background-dark rounded-full">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs font-black text-text-dark tracking-tighter">{product.ratings || 0} / 5.0</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-text-dark tracking-tighter leading-[1.1]">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-end gap-6 pb-8 border-b border-slate-100">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-text-light uppercase tracking-widest mb-1">Pricing</span>
                                <span className="text-5xl font-black text-primary tracking-tighter">₹{formatPrice(product.price)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-text-dark uppercase tracking-widest">About this item</h3>
                            <p className="text-text-light text-lg leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-100/50 space-y-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="flex items-center gap-2 p-2 bg-background-light rounded-2xl ring-1 ring-slate-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-text-dark hover:border-primary hover:text-primary transition-all disabled:opacity-30 shadow-sm"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-5 w-5" />
                                    </button>
                                    <span className="w-12 text-center text-xl font-black text-text-dark tracking-tighter">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-text-dark hover:border-primary hover:text-primary transition-all disabled:opacity-30 shadow-sm"
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || addingToCart}
                                    className="flex-1 w-full bg-gradient-to-r from-text-dark to-black text-white py-5 px-10 rounded-[2rem] font-bold text-lg shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.95] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
                                >
                                    {addingToCart ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                                            {product.stock === 0 ? 'Out of Stock' : 'Add to Collection'}
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                            {trustBadges.map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center sm:items-start gap-2 p-4 rounded-3xl bg-background-light group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-primary border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <badge.icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-xs font-black text-text-dark uppercase tracking-tighter leading-none mb-1">{badge.text}</h4>
                                        <p className="text-[0.65rem] font-bold text-text-light tracking-tight">{badge.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-text-dark mb-8">Customer Reviews</h2>

                    {showReviewForm && (
                        <div className="mb-12 p-6 bg-slate-50 rounded-2xl">
                            <h3 className="text-lg font-bold text-text-dark mb-4">Write a Review</h3>
                            <form onSubmit={submitReview} className="space-y-4">
                                <div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <textarea
                                        value={reviewData.comment}
                                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary min-h-32"
                                        placeholder="Share your experience..."
                                        required
                                    />
                                </div>
                                <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    )}

                    {product?.reviews?.length > 0 ? (
                        <div className="space-y-8">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                                            {review.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-dark">{review.name || 'Anonymous'}</h4>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-text-light">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-text-light">No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
