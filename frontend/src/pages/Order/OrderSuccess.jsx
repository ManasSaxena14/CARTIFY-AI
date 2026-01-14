import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Box, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    return (
        <div className="relative min-h-[85vh] flex items-center justify-center p-4 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    type: 'spring',
                    bounce: 0.4
                }}
                className="relative max-w-xl w-full"
            >
                {/* Decorative Elements */}
                <motion.div
                    initial={{ opacity: 0, rotate: -20 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute -top-12 -left-12 w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center -rotate-12 border border-slate-50 z-10 hidden md:flex"
                >
                    <Box className="w-10 h-10 text-primary" />
                </motion.div>

                <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border border-white text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', damping: 12 }}
                        className="h-28 w-28 bg-gradient-to-br from-primary to-primary-dark rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/30"
                    >
                        <CheckCircle className="h-14 w-14 text-white" />
                    </motion.div>

                    <div className="space-y-4 mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                            <Sparkles className="w-4 h-4" />
                            Confirmed Securely
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-dark tracking-tighter leading-tight">
                            Acquisition <br /> <span className="text-primary italic">Successful.</span>
                        </h1>
                        <p className="text-text-light font-medium text-lg leading-relaxed max-w-sm mx-auto">
                            Thank you for your trust. Your curated selection is now being prepared for express dispatch.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                to="/profile"
                                className="flex items-center justify-center gap-2 w-full px-8 py-5 bg-background-light text-text-dark font-black rounded-3xl hover:bg-slate-100 transition-all border border-slate-100"
                            >
                                Track Progress
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                to="/products"
                                className="flex items-center justify-center gap-2 w-full px-8 py-5 bg-text-dark text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl shadow-black/10"
                            >
                                Continue <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-100 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-[0.6rem] font-bold text-text-light uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Insured
                        </div>
                        <div className="flex items-center gap-2 text-[0.6rem] font-bold text-text-light uppercase tracking-widest">
                            <Heart className="w-4 h-4 text-secondary" />
                            Priority
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
