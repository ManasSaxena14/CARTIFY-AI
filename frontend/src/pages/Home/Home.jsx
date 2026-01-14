import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, ShoppingBag, Zap, TrendingUp, ArrowRight, Search,
    Star, ShieldCheck, Heart, User, Filter, ArrowUpRight
} from 'lucide-react';
import productAPI from '../../api/productAPI';
import ProductCard from '../../components/common/ProductCard';
import { useAuth } from '../../context/AuthContext';

// Asset Imports for Production
import heroBanner from '../../assets/hero-banner.png';
import electronicsImg from '../../assets/categories/electronics.png';
import fashionImg from '../../assets/categories/fashion.png';
import homeImg from '../../assets/categories/home.png';
import logo from '../../assets/logo.png';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiQuery, setAiQuery] = useState('');
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);
    const [suggestionChips, setSuggestionChips] = useState([
        "Running shoes for marathons",
        "Minimalist aesthetic lamps",
        "Noise cancelling headphones",
        "Floral summer dresses"
    ]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await productAPI.getAllProducts();
                setFeaturedProducts(response.data.products.slice(0, 8));
            } catch (err) {
                // Error handled silently - fallback content shown
            } finally {
                setLoading(false);
            }
        };

        const fetchAiSuggestions = async () => {
            try {
                setSuggestionsLoading(true);
                // Fetch recommendations with a generic 'discovery' prompt
                const response = await productAPI.getAIRecommendations("latest premium electronics, stylish fashion, and modern lifestyle trends");
                if (response.data.success && response.data.products && response.data.products.length > 0) {
                    const titles = response.data.products.slice(0, 4).map(p => p.name);
                    setSuggestionChips(titles);
                }
            } catch (err) {
                // Error handled silently - default suggestions used
            } finally {
                setSuggestionsLoading(false);
            }
        };

        fetchFeaturedProducts();
        fetchAiSuggestions();
    }, []);

    const categories = [
        {
            name: 'Electronics',
            description: 'Next-gen gadgets & power workstations',
            image: electronicsImg,
            color: 'from-blue-600/80 to-indigo-600/80',
            link: '/products?category=Electronics'
        },
        {
            name: 'Clothing',
            description: 'Curated apparel & premium street style',
            image: fashionImg,
            color: 'from-rose-500/80 to-orange-500/80',
            link: '/products?category=Clothing'
        },
        {
            name: 'Home',
            description: 'Minimalist decor & intelligent home tech',
            image: homeImg,
            color: 'from-emerald-500/80 to-teal-600/80',
            link: '/products?category=Home'
        },
        {
            name: 'Cameras',
            description: 'Professional optics & cinematic gear',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
            color: 'from-slate-700/80 to-slate-900/80',
            link: '/products?category=Cameras'
        },
        {
            name: 'Laptops',
            description: 'High-performance computing assets',
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
            color: 'from-cyan-600/80 to-blue-700/80',
            link: '/products?category=Laptops'
        },
        {
            name: 'Accessories',
            description: 'The final touch for your aesthetic',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
            color: 'from-amber-500/80 to-orange-600/80',
            link: '/products?category=Accessories'
        },
        {
            name: 'Headphones',
            description: 'Immersive audio & acoustic clarity',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
            color: 'from-purple-600/80 to-fuchsia-600/80',
            link: '/products?category=Headphones'
        },
        {
            name: 'Food',
            description: 'Gourmet selections & organic pantry',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
            color: 'from-green-600/80 to-lime-600/80',
            link: '/products?category=Food'
        },
        {
            name: 'Books',
            description: 'Rare editions & intellectual volumes',
            image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop',
            color: 'from-orange-700/80 to-red-800/80',
            link: '/products?category=Books'
        },
        {
            name: 'Beauty',
            description: 'Premium skincare & neural cosmetics',
            image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
            color: 'from-pink-500/80 to-rose-400/80',
            link: '/products?category=Beauty'
        },
        {
            name: 'Sports',
            description: 'Elite performance & athletic tech',
            image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop',
            color: 'from-blue-700/80 to-cyan-500/80',
            link: '/products?category=Sports'
        },
        {
            name: 'Outdoor',
            description: 'Expedition gear & wild exploration',
            image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop',
            color: 'from-emerald-700/80 to-green-800/80',
            link: '/products?category=Outdoor'
        },
        {
            name: 'Automotive',
            description: 'Next-gen mobility & precision parts',
            image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop',
            color: 'from-slate-800/80 to-zinc-900/80',
            link: '/products?category=Automotive'
        }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-violet-200/40 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            className="lg:w-3/5 text-left"
                            initial={{ opacity: 0, x: -50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-4 py-1.5 rounded-full mb-8 shadow-sm">
                                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                                <span className="text-[12px] font-bold text-slate-600 tracking-tight">AI-Engine v2.0 is now live</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                            </div>

                            <h1 className="text-6xl md:text-8xl font-display tracking-tight text-slate-900 leading-[0.9] mb-8">
                                Shop Smarter <br />
                                <span className="relative inline-block mt-4">
                                    With Cartify AI
                                    <svg className="absolute -bottom-4 left-0 w-full h-4 text-indigo-200 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,10 Q50,20 100,10" stroke="currentColor" strokeWidth="8" fill="none" />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl leading-relaxed font-medium">
                                Forget endless scrolling. Describe what you need in plain English and let our AI
                                curate the perfect collection for you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-14">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    <Link
                                        to="/products"
                                        className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-slate-300 flex items-center justify-center gap-3"
                                    >
                                        Explore Collection
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                                {!user && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                    >
                                        <Link
                                            to="/register"
                                            className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-lg hover:border-slate-900 transition-all flex items-center justify-center gap-2"
                                        >
                                            Join Community
                                        </Link>
                                    </motion.div>
                                )}
                            </div>

                            {/* Trusted Users (Social Proof) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex items-center gap-5 p-4 bg-slate-50/50 rounded-2xl w-fit border border-slate-100"
                            >
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">+10k</div>
                                </div>
                                <div className="text-slate-600">
                                    <div className="flex gap-0.5 mb-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <p className="text-xs font-bold leading-none uppercase tracking-widest">Trusted by 10k+ shoppers</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="lg:w-2/5 relative"
                            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        >
                            <div className="relative pt-[100%]">
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-[4rem] blur-[80px]"
                                    animate={{ rotate: [0, 90, 180, 270, 360] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                                <img
                                    src={heroBanner}
                                    alt="Smart Shopping"
                                    className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_45px_100px_rgba(79,70,229,0.3)]"
                                />
                            </div>

                            {/* Floating Feature Tags */}
                            <motion.div
                                className="absolute -top-10 -left-10 bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-3"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                                    <img src={logo} alt="Cartify AI" className="w-full h-full object-cover" />
                                </div>
                                <div className="pr-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cartify AI</p>
                                    <p className="text-sm font-bold text-slate-900">Neural Engine</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Search Highlight Section */}
            <section className="py-20 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
                    <motion.div
                        {...fadeInUp}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            viewport={{ once: true }}
                            className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 ring-8 ring-white/5"
                        >
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-display text-white mb-6 tracking-tight"
                        >
                            The Search Engine for Your Needs
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-slate-400 text-lg mb-12"
                        >
                            Try our semantic search. No more ticking checkboxes.
                        </motion.p>

                        <div className="relative group max-w-2xl mx-auto mb-10">
                            <input
                                type="text"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="e.g. 'Cozy winter jacket with deep pockets'..."
                                className="w-full bg-slate-800/50 border border-slate-700 p-6 pl-16 rounded-[2rem] text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400" />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/products?search=${encodeURIComponent(aiQuery)}`)}
                                className="absolute right-3 top-3 bottom-3 px-8 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-colors"
                            >
                                Find
                            </motion.button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            <span className="text-slate-500 text-sm font-bold pt-2 uppercase tracking-widest mr-2">Try:</span>
                            {suggestionsLoading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-32 bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50" />
                                ))
                            ) : (
                                suggestionChips.map((chip, index) => (
                                    <motion.button
                                        key={`${chip}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                                        whileHover={{ y: -3, backgroundColor: "#334155" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate(`/products?search=${encodeURIComponent(chip)}`)}
                                        className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold border border-slate-700 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
                                        viewport={{ once: true }}
                                    >
                                        {chip}
                                    </motion.button>
                                ))
                            )}
                        </motion.div>
                    </motion.div>
                </div>
                {/* Decorative Grids */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('/grid.svg')] [mask-image:radial-gradient(white,transparent)]"></div>
            </section>

            {/* Curated Categories */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-display text-slate-900 mb-6 tracking-tighter italic">SHOP COLLECTIONS</h2>
                            <p className="text-lg text-slate-500 font-medium">Elevate your lifestyle with our AI-curated premium categories.</p>
                        </div>
                        <Link to="/categories" className="group flex items-center gap-4 text-slate-900 border-2 border-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest text-sm">
                            View Catalog
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    to={category.link}
                                    className="group relative block aspect-[4/5] overflow-hidden rounded-[3rem] bg-slate-100 shadow-2xl shadow-slate-100"
                                >
                                    <motion.img
                                        src={category.image}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out`} />

                                    <div className="absolute inset-0 p-10 flex flex-col justify-end text-white z-10">
                                        <div className="translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-4xl font-display mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-tighter italic uppercase leading-none">{category.name}</h3>
                                            <p className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed max-w-[200px] mb-6">{category.description}</p>
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                                                <ArrowRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Default Visible Label */}
                                    <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full group-hover:opacity-0 transition-opacity">
                                        <span className="text-sm font-bold text-white uppercase tracking-widest">{category.name}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-4 text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display text-slate-900 mb-6 tracking-tight">Must-Have Essentials</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Selected by our AI trends analysis for your specific style.</p>
                </div>

                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="animate-pulse bg-slate-200 rounded-[2.5rem] aspect-[3/4]"></div>
                            ))}
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                            {featuredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto text-center py-20 px-8 bg-white border border-slate-200 rounded-[3rem] shadow-xl shadow-slate-200/50">
                            <ShoppingBag className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Inventory Arriving Soon</h3>
                            <p className="text-slate-500 font-medium">Our curators are busy adding the latest drops. Stay tuned!</p>
                        </div>
                    )}

                    <div className="text-center mt-20">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-4 text-indigo-600 font-black uppercase tracking-widest hover:gap-6 transition-all"
                        >
                            Explore Full Catalog
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Premium CTA Section - Only show if user is not logged in */}
            {!user && (
                <section className="py-32 bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-rose-900/40 opacity-50"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-700 rounded-[4rem] p-12 md:p-24 text-center shadow-[0_50px_100px_-20px_rgba(79,70,229,0.5)]">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <Star className="w-16 h-16 text-yellow-300 mx-auto mb-10 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)] fill-current" />
                                <h2 className="text-4xl md:text-6xl font-display text-white mb-8 tracking-tighter leading-tight">
                                    Own Your Style with <br /> Cartify AI Perks
                                </h2>
                                <p className="text-xl text-indigo-100 mb-12 font-medium">
                                    Join our inner circle for early drops, exclusive AI insights, and zero delivery fees.
                                </p>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-4 px-12 py-6 bg-white text-indigo-700 rounded-[2rem] font-black text-xl hover:bg-slate-50 transition-all hover:scale-[1.05] active:scale-95 shadow-2xl"
                                >
                                    Create Account Free
                                    <ArrowRight className="w-6 h-6" />
                                </Link>

                                <div className="mt-14 flex flex-wrap justify-center gap-8 text-indigo-200">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Buyer Protection</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Price Tracking</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Gradients */}
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]"></div>
                </section>
            )}

            {/* Testimonials from Great Personalities */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display text-slate-900 mb-6 tracking-tight">
                            Voices of Excellence
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                            Insights from living legends who inspire our world
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Elon Musk */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/ELON.jpg" alt="Elon Musk" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Elon Musk</h4>
                                    <p className="text-slate-500 text-sm">Tech Entrepreneur & CEO of Tesla</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "This platform perfectly combines innovation and convenience. Cartify AI delivers exactly what modern shoppers need!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Christopher Nolan */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/Christopher.webp" alt="Christopher Nolan" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Christopher Nolan</h4>
                                    <p className="text-slate-500 text-sm">Film Director & Screenwriter</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "The attention to detail and user experience here is cinematic in its precision. A truly immersive shopping journey!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Lionel Messi */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/LIONEL.avif" alt="Lionel Messi" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Lionel Messi</h4>
                                    <p className="text-slate-500 text-sm">Professional Footballer</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "The precision and quality of products here mirrors what I strive for in football. An exceptional shopping experience!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Taylor Swift */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/TAYLOR.jpg" alt="Taylor Swift" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Taylor Swift</h4>
                                    <p className="text-slate-500 text-sm">Musician & Songwriter</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "This shopping platform has the perfect rhythm - everything flows so seamlessly. A truly delightful experience!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Dwayne Johnson */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/DWAYNE.jpg" alt="Dwayne Johnson" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Dwayne Johnson</h4>
                                    <p className="text-slate-500 text-sm">Actor & Producer</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "The dedication to excellence here is just like what I bring to my projects. This is the kind of quality I can get behind!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>

                        {/* Rohit Sharma */}
                        <motion.div
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-xl transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden">
                                    <img src="/ROHIT.jpg" alt="Rohit Sharma" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-display text-lg text-slate-900">Rohit Sharma</h4>
                                    <p className="text-slate-500 text-sm">Indian Cricket Captain</p>
                                </div>
                            </div>
                            <blockquote className="text-slate-700 text-lg italic mb-4">
                                "Just like in cricket, this platform demonstrates consistency and strategy at the highest level. A winning experience!"
                            </blockquote>
                            <div className="flex gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer Signature */}
            <footer className="py-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        &copy; 2026 Cartify AI E-commerce Hub. Engineered for Luxury.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
