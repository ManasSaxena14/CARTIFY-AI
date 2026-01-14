import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader, Trash2, Star, MessageSquare, Search,
    Filter, ShoppingBag, AlertCircle, ShieldCheck,
    UserCircle, Calendar, ChevronDown
} from 'lucide-react';
import adminAPI from '../../api/adminAPI';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { TableSkeleton } from '../../components/common/Skeleton';

const ReviewListAdmin = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDelete, setConfirmDelete] = useState({ open: false, productId: null, reviewId: null });

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllReviews();
            setReviews(response.data.reviews);
        } catch {
            // Silently handle fetch error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteReview = async () => {
        const toastId = toast.loading('Purging review from records...');
        try {
            await adminAPI.deleteReview(confirmDelete.productId, confirmDelete.reviewId);
            toast.success('Review eliminated from manifest', { id: toastId });
            setConfirmDelete({ open: false, productId: null, reviewId: null });
            fetchReviews();
        } catch {
            toast.error('Protocol failed: Unable to remove review', { id: toastId });
        }
    };

    const filteredReviews = reviews.filter(rev =>
        rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="w-48 h-4 bg-slate-100 rounded-full" />
                    <div className="w-96 h-12 bg-slate-100 rounded-full" />
                </div>
            </header>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100">
                <TableSkeleton rows={8} cols={4} />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                        <ShieldCheck className="w-4 h-4 fill-primary" />
                        Quality Control
                    </div>
                    <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-tight">
                        Review <span className="text-primary italic">Moderation.</span>
                    </h1>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search reviews, products or authors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-text-dark"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        {reviews.length} Feedbacks Processed
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredReviews.map((rev, idx) => (
                        <motion.div
                            key={rev._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-all duration-500"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left: Review Info */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-background-light rounded-xl flex items-center justify-center text-primary border border-slate-100">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-text-dark tracking-tight">{rev.name}</p>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}
                                                        />
                                                    ))}
                                                    <span className="text-[0.65rem] font-bold text-text-light ml-2 uppercase tracking-widest">
                                                        {rev.rating}/5 Rating
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[0.65rem] font-bold text-text-light uppercase tracking-widest mb-1">Asset Reference</p>
                                            <p className="text-sm font-black text-primary hover:underline cursor-pointer">{rev.productName}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 italic text-text-light font-medium leading-relaxed">
                                        "{rev.comment}"
                                    </div>
                                </div>

                                {/* Right: Control Panel */}
                                <div className="md:w-48 flex flex-col justify-between border-l border-slate-100 md:pl-8 py-2">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-[0.65rem] font-bold text-text-light uppercase tracking-widest">
                                            <Calendar size={14} />
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setConfirmDelete({ open: true, productId: rev.productId, reviewId: rev._id })}
                                        className="w-full mt-6 py-4 bg-secondary/5 text-secondary rounded-2xl font-black text-[0.65rem] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-secondary hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                        Decommission
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredReviews.length === 0 && (
                <div className="p-20 text-center space-y-4 bg-white rounded-[3rem] border border-slate-100">
                    <AlertCircle className="mx-auto h-12 w-12 text-slate-200" />
                    <p className="text-text-light font-bold text-[0.65rem] uppercase tracking-widest">No matching feedback manifests located.</p>
                </div>
            )}

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, productId: null, reviewId: null })}
                onConfirm={handleDeleteReview}
                title="Discard Review?"
                message="This will permanently delete the review content and impact the average product rating. This action is irreversible."
                confirmText="Delete Review"
            />
        </div>
    );
};

export default ReviewListAdmin;
