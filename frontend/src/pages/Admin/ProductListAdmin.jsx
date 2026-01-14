import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import {
    Loader, Plus, Edit2, Trash2, Search,
    Filter, LayoutGrid, List, Star, ChevronRight, X,
    Package, ShoppingBag, AlertCircle, Upload, Image as ImageIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import adminAPI from '../../api/adminAPI';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { TableSkeleton } from '../../components/common/Skeleton';

const ProductListAdmin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Electronics',
        stock: '',
        images: []
    });
    const [uploading, setUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const categories = ['All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', 'Books', 'Clothing', 'Beauty', 'Sports', 'Outdoor', 'Home', 'Automotive'];

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    uploadToCloud(reader.result);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const uploadToCloud = async (base64) => {
        setUploading(true);
        const toastId = toast.loading('Syncing asset with neural cloud...');
        try {
            const { data } = await adminAPI.uploadImage(base64);
            setFormData(prev => {
                const updatedImages = [...prev.images, { public_id: data.public_id, url: data.url }];
                if (updatedImages.length > 3) {
                    toast.error('Maximum 3 images allowed. Keep only the best.');
                    return prev;
                }
                return { ...prev, images: updatedImages };
            });
            toast.success('Asset synchronized successfully', { id: toastId });
        } catch (_err) {
            toast.error('Failed to fetch products');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (public_id) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.public_id !== public_id)
        }));
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAdminProducts();
            setProducts(response.data.products);
        } catch (_err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(editingProduct ? 'Updating asset...' : 'Integrating asset...');
        try {
            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct._id, formData);
                toast.success('Asset updated in the manifest', { id: toastId });
            } else {
                await adminAPI.createProduct(formData);
                toast.success('New asset integrated into system', { id: toastId });
            }
            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', category: 'Electronics', stock: '', images: [] });
            fetchProducts();
        } catch {
            toast.error('Failed to save product', { id: toastId });
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            category: product.category,
            stock: product.stock,
            images: product.images || []
        });
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        const toastId = toast.loading('Decommissioning asset...');
        try {
            await adminAPI.deleteProduct(confirmDelete.id);
            toast.success('Asset removed from manifest', { id: toastId });
            setConfirmDelete({ open: false, id: null });
            fetchProducts();
        } catch {
            toast.error('Failed to delete product', { id: toastId });
        }
    };

    const filteredProducts = products
        .filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p._id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'priceLowHigh') return a.price - b.price;
            if (sortBy === 'priceHighLow') return b.price - a.price;
            if (sortBy === 'stockLow') return a.stock - b.stock;
            return 0;
        });

    if (loading) return (
        <div className="space-y-10 pb-20">
            {/* Header Section Skeleton */}
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
                        <ShoppingBag className="w-4 h-4" />
                        Inventory Protocol
                    </div>
                    <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-tight">
                        Product <span className="text-primary italic">Manifest.</span>
                    </h1>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', price: '', description: '', category: 'Electronics', stock: '', images: [] });
                        setIsModalOpen(true);
                    }}
                    className="px-8 py-5 bg-text-dark text-white rounded-[2rem] font-black text-[0.65rem] uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center gap-3"
                >
                    <Plus size={18} />
                    Integrate New Asset
                </motion.button>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search assets by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-text-dark"
                    />
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark focus:border-primary/30 outline-none cursor-pointer shadow-sm"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 rotate-90" size={14} />
                    </div>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark focus:border-primary/30 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="priceLowHigh">Price: Low to High</option>
                            <option value="priceHighLow">Price: High to Low</option>
                            <option value="stockLow">Low Stock First</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 rotate-90" size={14} />
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
                        <button className="p-2.5 bg-white rounded-xl shadow-sm"><List size={18} /></button>
                        <button className="p-2.5 text-slate-400"><LayoutGrid size={18} /></button>
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
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Product Reference</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Asset Attributes</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Real-time Stock</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Valuation</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((product, idx) => (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-all duration-300"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-12 bg-background-light rounded-xl overflow-hidden border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[0.6rem] font-black text-text-light uppercase tracking-widest opacity-60 mb-0.5">#{product._id.slice(-6)}</span>
                                                <span className="font-black text-text-dark tracking-tight leading-tight group-hover:text-primary transition-colors">{product.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-text-light">{product.category}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${product.stock <= 5 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                                            <span className={`text-[0.65rem] font-black uppercase tracking-widest ${product.stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {product.stock} Units
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-text-dark">₹{product.price}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => handleEdit(product)}
                                                className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => setConfirmDelete({ open: true, id: product._id })}
                                                className="p-3 text-secondary hover:bg-secondary/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ x: 3 }}
                                                className="p-3 text-slate-300 hover:text-text-dark transition-all"
                                            >
                                                <ChevronRight size={18} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <AlertCircle className="mx-auto h-12 w-12 text-slate-200" />
                        <p className="text-text-light font-bold text-[0.65rem] uppercase tracking-widest">No matching assets found.</p>
                    </div>
                )}
            </motion.div>

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-text-dark tracking-tighter">
                                    {editingProduct ? 'Update Inventory' : 'Integrate New Asset'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    <X size={20} className="text-text-dark" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
                                {/* Image Upload Interface */}
                                <div className="space-y-4">
                                    <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest block">Visual Manifestation (Max 3)</label>
                                    <div className="flex flex-wrap gap-4 items-start">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative group h-32 w-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                                                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(img.public_id)}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        {formData.images.length < 3 && (
                                            <div className="relative group flex-shrink-0 h-32 w-24">
                                                <div className="h-full w-full bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/30">
                                                    {uploading ? (
                                                        <Loader className="w-6 h-6 text-primary animate-spin" />
                                                    ) : (
                                                        <Plus className="text-slate-300 w-8 h-8" />
                                                    )}
                                                </div>
                                                <label className="absolute inset-0 cursor-pointer">
                                                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} />
                                                </label>
                                            </div>
                                        )}

                                        <div className="flex-1 space-y-2 pt-2 min-w-[200px]">
                                            <p className="text-xs font-bold text-text-dark tracking-tight">Cloud Integration Active</p>
                                            <p className="text-[0.6rem] text-text-light leading-relaxed font-medium">Upload up to 3 high-resolution asset images. AI processing will optimize the visual parameters for the storefront.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest mb-2 block">Product Identity</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-bold"
                                            placeholder="Asset Designation..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest mb-2 block">Valuation (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest mb-2 block">Inventory Mass</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest mb-2 block">Categorization</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-bold appearance-none"
                                        >
                                            {categories.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[0.6rem] font-black text-text-light uppercase tracking-widest mb-2 block">Technical Specifications</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary/30 transition-all font-medium min-h-[120px]"
                                        placeholder="Detailed description..."
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-indigo-700 transition-all"
                                    >
                                        {editingProduct ? 'Finalize Protocol' : 'Deploy Asset'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Decommission Asset?"
                message="This will permanently remove the item from the central inventory database. This action is irreversible."
                confirmText="Terminate Asset"
            />
        </div>
    );
};

export default ProductListAdmin;
