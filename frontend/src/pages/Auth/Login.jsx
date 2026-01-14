import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader, Sparkles, ShieldCheck } from 'lucide-react';
// import authAPI from '../../api/authAPI';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
            const cleanFormData = {
                ...formData,
                email: formData.email.trim()
            };
            // Context login updates the user state
            const user = await login(cleanFormData);
            // Navigation happens after state is updated
            if (user && user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            // Provide user-friendly error messages
            if (err.response?.status === 401) {
                setError('Invalid email or password. Please check your credentials and try again.');
            } else if (err.code === 'ERR_NETWORK' || !err.response) {
                setError('Unable to connect to server. Please check your internet connection.');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again later.');
            }
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
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-lg"
            >
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white mb-6 shadow-lg shadow-primary/20"
                            >
                                <Sparkles className="w-8 h-8" />
                            </motion.div>
                            <h2 className="text-4xl font-extrabold text-text-dark tracking-tight mb-3">Welcome Back</h2>
                            <p className="text-text-light text-lg">Experience the next generation of AI-driven shopping</p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="mb-8 p-4 bg-secondary/5 border border-secondary/20 rounded-2xl flex items-center gap-3 text-secondary text-sm"
                                >
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-dark ml-2">Email Identity</label>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-text-light group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-background-light border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-dark placeholder:text-text-light/50 font-medium"
                                        placeholder="you@domain.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-2">
                                    <label className="text-sm font-semibold text-text-dark">Secure Password</label>
                                    <Link to="/forgot-password" title="Recover access" className="text-xs font-bold text-primary hover:text-primary-dark hover:underline transition-all">
                                        Recovery Access?
                                    </Link>
                                </div>
                                <div className="group relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-text-light group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 bg-background-light border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-dark placeholder:text-text-light/50 font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-4 px-6 bg-gradient-to-r from-primary-dark to-primary text-white font-bold text-lg rounded-2xl shadow-[0_12px_24px_-8px_rgba(79,70,229,0.5)] hover:shadow-[0_16px_32px_-8px_rgba(79,70,229,0.6)] transition-all flex items-center justify-center overflow-hidden disabled:opacity-80 group"
                            >
                                <span className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity inline-flex items-center gap-2`}>
                                    Unlock Experience <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                            New to the future?{' '}
                            <Link to="/register" className="text-primary font-bold hover:text-primary-dark hover:underline underline-offset-4 transition-all">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
