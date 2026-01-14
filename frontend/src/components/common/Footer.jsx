import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Bot, CheckCircle2, Loader2, Mail, Github, Linkedin, Instagram, MapPin, Phone, Mail as MailIcon, Globe, Shield, Truck, RotateCcw } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import newsletterAPI from '../../api/newsletterAPI';
import toast from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setSubscribing(true);
        try {
            await newsletterAPI.subscribe(email);
            setSubscribed(true);
            setEmail('');
            toast.success('Check your inbox for a surprise!');
        } catch (_err) {
            // Silently handle subscription failure
            toast.error('Subscription service is busy. Try later.');
        } finally {
            setSubscribing(false);
        }
    };

    const handleSupportClick = (serviceName) => {
        toast.success(`Thank you for contacting ${serviceName}! We've sent an email to manas.saxena2024@nst.rishihood.edu.in with your request.`);
    };

    return (
        <footer className="bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 pt-20 pb-12 overflow-hidden relative border-t border-slate-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-100/50 via-transparent to-indigo-50/20"></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand & Newsletter Layer */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-3 group mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Bot className="w-7 h-7" />
                            </div>
                            <span className="text-3xl font-display tracking-tight text-slate-900">
                                Cartify<span className="text-indigo-600">AI</span>
                            </span>
                        </div>

                        <p className="text-slate-600 font-medium leading-relaxed mb-10 text-lg italic">
                            "Elevating e-commerce with AI-powered intelligence and seamless shopping experiences."
                        </p>

                        {/* Premium Newsletter */}
                        <div className="relative max-w-md">
                            <h4 className="text-sm font-display text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Premium Newsletter
                            </h4>
                            <form onSubmit={handleSubscribe} className="relative group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email for exclusive updates..."
                                    disabled={subscribing || subscribed}
                                    className="w-full pl-6 pr-16 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all font-display text-slate-900 placeholder:text-slate-400 disabled:opacity-50 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribing || subscribed || !email}
                                    className="absolute right-2 top-2 bottom-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
                                >
                                    {subscribing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : subscribed ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </form>
                            <AnimatePresence>
                                {subscribed && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-emerald-600 text-sm font-display italic uppercase tracking-widest"
                                    >
                                        Subscription Successful!
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Premium Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Shop Section */}
                        <div>
                            <h4 className="text-xs font-display text-indigo-600 uppercase tracking-[0.3em] mb-6">SHOP</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/products" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        All Products
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/categories" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Categories
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/products" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Catalog
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support Section */}
                        <div>
                            <h4 className="text-xs font-display text-indigo-600 uppercase tracking-[0.3em] mb-6">SUPPORT</h4>
                            <ul className="space-y-4">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => handleSupportClick('Help Center')}
                                        className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300 cursor-pointer text-left w-full">
                                        Help Center
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => handleSupportClick('Customer Service')}
                                        className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300 cursor-pointer text-left w-full">
                                        Customer Service
                                    </button>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => handleSupportClick('Contact Us')}
                                        className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300 cursor-pointer text-left w-full">
                                        Contact Us
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Company Section */}
                        <div>
                            <h4 className="text-xs font-display text-indigo-600 uppercase tracking-[0.3em] mb-6">COMPANY</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/about" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Press
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services Section */}
                        <div>
                            <h4 className="text-xs font-display text-indigo-600 uppercase tracking-[0.3em] mb-6">SERVICES</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link to="/profile" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Track Order
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Returns
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className="text-sm font-display text-slate-700 hover:text-indigo-600 transition-all duration-300">
                                        Shipping
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Premium Bottom Section */}
                <div className="border-t border-slate-200 pt-12">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-4 items-center lg:items-start">
                            <div className="flex items-center gap-6 text-slate-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span className="font-display">India</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span className="font-display">Global</span>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm text-center lg:text-left max-w-md font-display">
                                © {new Date().getFullYear()} Cartify AI. All rights reserved. Elevating commerce through AI innovation.
                            </p>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-6">
                            <div className="flex gap-8 text-slate-600 text-sm font-display">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    <span>Easy Returns</span>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <a href="https://github.com/ManasSaxena14" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-full bg-slate-100 hover:bg-indigo-100">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="https://www.linkedin.com/in/manas-saxena-1b3b27324/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-full bg-slate-100 hover:bg-indigo-100">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="https://www.instagram.com/_manas_14_/?hl=en" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 p-2 rounded-full bg-slate-100 hover:bg-indigo-100">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
