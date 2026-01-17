import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import electronicsImg from '../assets/categories/electronics.png';
import fashionImg from '../assets/categories/fashion.png';
import homeImg from '../assets/categories/home.png';

const categories = [
    {
        name: 'Electronics',
        description: 'Next-gen gadgets & power workstations',
        image: electronicsImg,
        color: 'from-blue-600/80 to-indigo-600/80',
    },
    {
        name: 'Clothing',
        description: 'Curated apparel & premium street style',
        image: fashionImg,
        color: 'from-rose-500/80 to-orange-500/80',
    },
    {
        name: 'Home',
        description: 'Minimalist decor & intelligent home tech',
        image: homeImg,
        color: 'from-emerald-500/80 to-teal-600/80',
    },
    {
        name: 'Cameras',
        description: 'Professional optics & cinematic gear',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        color: 'from-slate-700/80 to-slate-900/80',
    },
    {
        name: 'Laptops',
        description: 'High-performance computing assets',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
        color: 'from-cyan-600/80 to-blue-700/80',
    },
    {
        name: 'Accessories',
        description: 'The final touch for your aesthetic',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        color: 'from-amber-500/80 to-orange-600/80',
    },
    {
        name: 'Headphones',
        description: 'Immersive audio & acoustic clarity',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        color: 'from-purple-600/80 to-fuchsia-600/80',
    },
    {
        name: 'Food',
        description: 'Gourmet selections & organic pantry',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
        color: 'from-green-600/80 to-lime-600/80',
    },
    {
        name: 'Books',
        description: 'Rare editions & intellectual volumes',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop',
        color: 'from-orange-700/80 to-red-800/80',
    },
    {
        name: 'Beauty',
        description: 'Premium skincare & neural cosmetics',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
        color: 'from-pink-500/80 to-rose-400/80',
    },
    {
        name: 'Sports',
        description: 'Elite performance & athletic tech',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop',
        color: 'from-blue-700/80 to-cyan-500/80',
    },
    {
        name: 'Outdoor',
        description: 'Expedition gear & wild exploration',
        image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop',
        color: 'from-emerald-700/80 to-green-800/80',
    },
    {
        name: 'Automotive',
        description: 'Next-gen mobility & precision parts',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop',
        color: 'from-slate-800/80 to-zinc-900/80',
    }
];

const Categories = () => {
    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Header section with glassy effect */}
            <header className="pt-32 pb-20 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                            <Sparkles className="w-4 h-4" />
                            Curated Ecosystems
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                            Category <span className="text-primary">Catalog.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
                            Browse through our specialized collections, each engineered for a specific
                            aesthetic and lifestyle requirement.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Gallery Grid */}
            <main className="max-w-7xl mx-auto px-4 md:px-8 mt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                to={`/products?category=${cat.name}`}
                                className="group relative block aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-slate-100 shadow-2xl shadow-slate-200/50 hover:shadow-primary/20 transition-all duration-500"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-12 flex flex-col justify-end text-white`} />

                                <div className="absolute inset-0 p-12 flex flex-col justify-end z-10">
                                    <div className="group-hover:translate-x-2 transition-transform duration-500">
                                        <h3 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            {cat.name}
                                        </h3>
                                        <p className="text-sm font-bold text-white/90 leading-relaxed mb-6 max-w-[240px] opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                            {cat.description}
                                        </p>
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-100 scale-0 transition-transform duration-500">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Default Label */}
                                    <div className="absolute top-12 left-12 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full group-hover:opacity-0 transition-opacity">
                                        <span className="text-xs font-black text-white uppercase tracking-widest">{cat.name}</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Footer Engagement */}
            <section className="mt-40 max-w-5xl mx-auto px-8">
                <div className="bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <ShoppingBag className="w-16 h-16 text-indigo-400 mx-auto mb-8" />
                    <h2 className="text-4xl font-black mb-6 tracking-tight">Can't find what you're looking for?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                        Our AI engine can find any product across our entire ecosystem based on your natural language description.
                    </p>
                    <Link
                        to="/products"
                        className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center gap-3 w-fit mx-auto"
                    >
                        Use AI Search <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Categories;
