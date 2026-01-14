import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { Package, DollarSign, Tag, Layers, FileText, Image as ImageIcon, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import productAPI from '../../api/productAPI';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await productAPI.getCategories();
                if (catRes.data.success) {
                    setCategories(catRes.data.categories);
                }

                if (isEdit) {
                    setLoading(true);
                    const prodRes = await productAPI.getSingleProduct(id);
                    if (prodRes.data.success) {
                        const product = prodRes.data.data;
                        setFormData({
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            category: product.category,
                            stock: product.stock,
                            images: product.images || []
                        });
                    }
                }
            } catch {
                toast.error('Failed to fetch products');
                navigate('/admin/products');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...formData.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({ ...prev, images: [...prev.images, { public_id: '', url: '' }] }));
    };

    const removeImageField = (index) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await productAPI.updateProduct(id, formData);
                toast.success('Product updated successfully');
            } else {
                await productAPI.createProduct(formData);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-text-light hover:text-primary mb-8 transition-colors"
            >
                <ArrowLeft size={20} />
                <span className="font-bold text-sm uppercase tracking-widest">Back to Inventory</span>
            </button>

            <header className="mb-12">
                <h1 className="text-4xl font-black text-text-dark tracking-tighter">
                    {isEdit ? 'Legacy' : 'New'} <span className="text-primary italic">Addition.</span>
                </h1>
                <p className="text-text-light font-medium mt-2">Define the specifications for your curated collection.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Package size={12} /> Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold"
                                placeholder="E.g. Lunar Chronograph"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={12} /> Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold appearance-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FileText size={12} /> Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold resize-none"
                            placeholder="Detailed product specifications..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                <DollarSign size={12} /> Price (INR)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold"
                                placeholder="99.99"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Layers size={12} /> Inventory Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold"
                                placeholder="100"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                    <div className="flex items-center justify-between">
                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                            <ImageIcon size={12} /> Product Media
                        </label>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-xs font-black text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Image URL
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        value={img.url}
                                        onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                                        className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Public ID (Optional)"
                                        value={img.public_id}
                                        onChange={(e) => handleImageChange(idx, 'public_id', e.target.value)}
                                        className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs font-bold"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImageField(idx)}
                                    className="p-4 text-rose-400 hover:text-rose-600 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        {formData.images.length === 0 && (
                            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                <p className="text-text-light text-xs font-bold italic opacity-50">No images linked. Add at least one for visual presence.</p>
                            </div>
                        )}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    type="submit"
                    className="w-full bg-text-dark text-white py-6 rounded-[2.5rem] font-black text-lg shadow-2xl shadow-black/10 flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <Save size={20} />
                            {isEdit ? 'Authorize Updates' : 'Initialize Product'}
                        </>
                    )}
                </motion.button>
            </form>
        </div>
    );
};

export default ProductForm;
