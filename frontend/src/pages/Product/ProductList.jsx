import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter, ChevronDown, SlidersHorizontal, Search,
    LayoutGrid, List, Sparkles, X, ArrowUpRight
} from 'lucide-react';
import productAPI from '../../api/productAPI';
import ProductCard from '../../components/common/ProductCard';
import { formatPrice } from '../../utils/pricing';

const ProductList = () => {
    // const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isAiSearch, setIsAiSearch] = useState(false);
    const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
    const [priceRange, setPriceRange] = useState({
        min: Number(searchParams.get('minPrice')) || 0,
        max: Number(searchParams.get('maxPrice')) || 500000
    });
    const [localSearch, setLocalSearch] = useState(searchQuery || '');

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productAPI.getCategories();

                if (response.data.success) {
                    setCategories(response.data.categories);
                }
            } catch {
                setCategories(['Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', 'Books', 'Clothing', 'Beauty', 'Sports', 'Outdoor', 'Home', 'Automotive']);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');

                let response;
                if (searchQuery) {
                    setIsAiSearch(true);
                    response = await productAPI.getAIFilteredProducts({
                        userQuery: searchQuery,
                        minPrice: priceRange.min,
                        maxPrice: priceRange.max,
                        sort: sort
                    });
                } else {
                    setIsAiSearch(false);
                    const params = {
                        category: categoryQuery,
                        sort: sort,
                        minPrice: priceRange.min,
                        maxPrice: priceRange.max
                    };
                    response = await productAPI.getAllProducts(params);
                }

                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError('Something went wrong. Please try again.');
                }
            } catch {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery, categoryQuery, sort, priceRange.min, priceRange.max]);

    const handleSortChange = (newSort) => {
        setSort(newSort);
        searchParams.set('sort', newSort);
        setSearchParams(searchParams);
    };

    const handlePriceChange = (min, max) => {
        setPriceRange({ min, max });
        searchParams.set('minPrice', min);
        searchParams.set('maxPrice', max);
        setSearchParams(searchParams);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            if (localSearch.trim()) {
                searchParams.set('search', localSearch);
            } else {
                searchParams.delete('search');
            }
            setSearchParams(searchParams);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative min-h-screen pb-20">
            {/* Header / Banner Area */}
            <div className="pt-10 pb-16 px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6"
                >
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase mb-1">
                            <Sparkles className="w-4 h-4" />
                            Premium Curations
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display text-text-dark tracking-tighter leading-none">
                            {searchQuery ? (
                                <>
                                    AI Results for: <span className="text-primary italic">"{searchQuery}"</span>
                                </>
                            ) : (
                                <>
                                    Discover <span className="text-primary italic">The Best.</span>
                                </>
                            )}
                        </h1>
                        <p className="text-text-light text-lg font-medium leading-relaxed">
                            {isAiSearch
                                ? `Our AI engine analyzed your query and found ${products.length} matching products based on your specific needs.`
                                : "A highly curated selection of products designed for the modern lifestyle. AI-powered results, handpicked quality."
                            }
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="hidden md:flex bg-white/50 backdrop-blur-md border border-slate-100 p-1.5 rounded-2xl shadow-sm">
                            <select
                                value={sort}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="bg-transparent text-sm font-display text-text-dark px-4 outline-none cursor-pointer"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                                <option value="-ratings">Top Rated</option>
                            </select>
                        </div>
                        <div className="hidden md:flex bg-white/50 backdrop-blur-md border border-slate-100 p-1.5 rounded-2xl shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-primary' : 'text-text-light hover:text-text-dark'}`}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-primary' : 'text-text-light hover:text-text-dark'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="bg-text-dark text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl shadow-black/10 group"
                        >
                            <SlidersHorizontal className="w-5 h-5 transition-transform group-hover:rotate-180" />
                            Filters
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                {/* Search Bar (Static but styled) */}
                <div className="mb-12">
                    <div className="relative group max-w-4xl mx-auto">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-text-light group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search within this collection..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] outline-none shadow-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xl font-medium placeholder:text-text-light/40"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                            <div className="bg-background-dark py-2 px-4 rounded-full text-xs font-bold text-text-light border border-slate-100 uppercase tracking-tighter">
                                AI Optimized
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Inline Filter Sidebar (Desktop) */}
                    <div className="hidden lg:block w-72 space-y-10 shrink-0 sticky top-24 h-fit">
                        {/* Categories */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-display text-text-dark uppercase tracking-widest border-b border-slate-100 pb-3">Categories</h3>
                            <div className="flex flex-col gap-3">
                                {categories.length > 0 ? (
                                    categories.map(cat => (
                                        <label
                                            key={cat}
                                            className="flex items-center gap-3 group cursor-pointer"
                                            onClick={() => {
                                                if (categoryQuery === cat) {
                                                    searchParams.delete('category');
                                                } else {
                                                    searchParams.set('category', cat);
                                                }
                                                setSearchParams(searchParams);
                                            }}
                                        >
                                            <div className={`w-5 h-5 rounded-md border-2 ${categoryQuery === cat ? 'border-primary bg-primary' : 'border-slate-200 group-hover:border-primary'} transition-all flex items-center justify-center`}>
                                                {categoryQuery === cat && <div className="w-2.5 h-2.5 rounded-sm bg-white" />}
                                            </div>
                                            <span className={`text-sm font-bold transition-colors ${categoryQuery === cat ? 'text-primary' : 'text-text-light group-hover:text-text-dark'}`}>{cat}</span>
                                        </label>
                                    ))
                                ) : (
                                    // Loading skeleton while categories are being fetched
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-slate-100 animate-pulse"></div>
                                            <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-display text-text-dark uppercase tracking-widest pb-3">Price Range</h3>
                                <button
                                    onClick={() => handlePriceChange(0, 1000000000)}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="1000"
                                    value={priceRange.max}
                                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-xs font-bold text-text-light">
                                    <span>₹0</span>
                                    <span>Up to ₹{formatPrice(priceRange.max >= 500000 ? 500000 : priceRange.max)}{priceRange.max >= 500000 ? '+' : ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Promo Card */}
                        <div className="bg-gradient-to-br from-primary-dark to-primary p-8 rounded-[2rem] text-white overflow-hidden relative shadow-2xl shadow-primary/20">
                            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 opacity-20 rotate-12" />
                            <h4 className="text-xl font-display mb-3">AI Personalization</h4>
                            <p className="text-sm opacity-90 leading-relaxed mb-6 font-medium">Join our community for tailored recommendations.</p>
                            <button className="bg-white text-primary px-6 py-3 rounded-xl font-display text-sm hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-2">
                                Learn More <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Products Grid Area */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[2.5rem] animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-secondary/5 rounded-[3rem] border border-secondary/10">
                                <p className="text-secondary font-bold text-xl mb-4">{error}</p>
                                <button onClick={() => window.location.reload()} className="text-primary font-bold hover:underline">Try again</button>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-background-light rounded-[3rem] border border-slate-100">
                                <Search className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                <p className="text-text-light font-bold text-xl">We couldn't find any products in this collection.</p>
                            </div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10' : 'grid-cols-1 gap-6'}`}
                            >
                                {products.map(product => (
                                    <motion.div key={product._id} variants={itemVariants}>
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Pagination Placeholder */}
                        {!loading && products.length > 0 && (
                            <div className="mt-20 flex justify-center gap-3">
                                <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-text-dark hover:border-primary hover:text-primary transition-all">1</button>
                                <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-text-light hover:border-primary hover:text-primary transition-all">2</button>
                                <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-bold text-text-light hover:border-primary hover:text-primary transition-all">Next</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex justify-end"
                        onClick={() => setShowFilters(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-sm bg-white h-full p-8 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-display text-text-dark uppercase tracking-tight">Refine Results</h2>
                                <button onClick={() => setShowFilters(false)} className="p-3 bg-background-light rounded-2xl text-text-dark hover:bg-slate-100 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Filters Content - Reusing sidebar logic */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-sm font-display text-text-light uppercase tracking-widest">Collections</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.length > 0 ? (
                                            categories.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        if (categoryQuery === cat) {
                                                            searchParams.delete('category');
                                                        } else {
                                                            searchParams.set('category', cat);
                                                        }
                                                        setSearchParams(searchParams);
                                                    }}
                                                    className={`px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${categoryQuery === cat ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20' : 'border-slate-100 text-text-dark hover:border-primary hover:text-primary'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))
                                        ) : (
                                            // Loading skeleton while categories are being fetched
                                            [1, 2, 3, 4, 5].map((i) => (
                                                <div key={i} className="h-12 bg-slate-100 rounded-2xl animate-pulse w-24"></div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-display text-text-light uppercase tracking-widest">Filter by Price</h3>
                                    <div className="space-y-8 px-2">
                                        <div className="h-2 w-full bg-slate-100 rounded-full relative">
                                            <div className="absolute inset-y-0 left-0 w-3/4 bg-primary rounded-full" />
                                            <div className="absolute -top-2 left-0 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg" />
                                            <div className="absolute -top-2 left-3/4 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full bg-primary text-white py-5 rounded-[2rem] font-display text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-10"
                                >
                                    Apply Configuration
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductList;
