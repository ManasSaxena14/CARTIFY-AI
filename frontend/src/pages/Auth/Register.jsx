import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import authAPI from '../../api/authAPI';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register(formData);
            localStorage.setItem('accessToken', response.data.data.accessToken);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center p-4 overflow-hidden">
            {/* Background Aesthetic Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-background-light">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[15%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ y: -10 }}
                                animate={{ y: 0 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dark text-white mb-6 shadow-lg shadow-accent/20"
                            >
                                <Zap className="w-8 h-8" />
                            </motion.div>
                            <h2 className="text-4xl font-extrabold text-text-dark tracking-tight mb-3">Join the Future</h2>
                            <p className="text-text-light text-lg">Create your identity and start shopping with AI</p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-8 p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center gap-3 text-secondary text-sm overflow-hidden"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark ml-2">Full Name</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-text-light group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-background-light border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-text-dark placeholder:text-text-light/50 font-medium"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark ml-2">Email Address</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-text-light group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-background-light border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-text-dark placeholder:text-text-light/50 font-medium"
                                        placeholder="Email Address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark ml-2">Secure Password</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-light group-focus-within:text-accent transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-background-light border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all text-text-dark placeholder:text-text-light/50 font-medium"
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-4 px-6 bg-gradient-to-r from-accent-dark to-accent text-white font-bold text-lg rounded-2xl shadow-[0_12px_24px_-8px_rgba(15,118,110,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(15,118,110,0.6)] transition-all flex items-center justify-center overflow-hidden disabled:opacity-80 group mt-4"
                            >
                                <span className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity inline-flex items-center gap-2`}>
                                    Create Experience <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader className="w-6 h-6 animate-spin text-white" />
                                    </div>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-background-dark/50 p-6 md:p-8 text-center border-t border-slate-100/50">
                        <p className="text-text-light font-medium">
                            Already part of the future?{' '}
                            <Link to="/login" className="text-accent font-bold hover:text-accent-dark hover:underline underline-offset-4 transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
