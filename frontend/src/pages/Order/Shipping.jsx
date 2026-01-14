import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Truck, ArrowRight, ShieldCheck, Sparkles, Home, Building2, Globe } from 'lucide-react';

const Shipping = () => {
    const navigate = useNavigate();
    const storedInfo = JSON.parse(localStorage.getItem('shippingInfo')) || {};

    const [formData, setFormData] = useState({
        address: storedInfo.address || '',
        city: storedInfo.city || '',
        pinCode: storedInfo.pinCode || '',
        phoneNo: storedInfo.phoneNo || '',
        country: storedInfo.country || 'India',
        state: storedInfo.state || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.phoneNo.length < 10) {
            return;
        }
        localStorage.setItem('shippingInfo', JSON.stringify(formData));
        navigate('/payment');
    };

    const steps = [
        { id: 1, name: 'Logistics', status: 'current', icon: Truck },
        { id: 2, name: 'Settlement', status: 'upcoming', icon: ShieldCheck }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center">
            {/* High-End Progress Stepper */}
            <div className="w-full max-w-2xl mb-16">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10" />
                    <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-primary -z-10" />

                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 bg-white px-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${step.status === 'current' ? 'bg-primary text-white shadow-primary/20 scale-110' : 'bg-white border border-slate-100 text-text-light'}`}>
                                <step.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-[0.65rem] font-black uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-primary' : 'text-text-light/50'}`}>{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-12"
            >
                {/* Visual Context Sidebar */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                            <Sparkles className="w-4 h-4" />
                            Secure Fulfillment
                        </div>
                        <h1 className="text-4xl font-black text-text-dark tracking-tighter leading-tight">
                            Delivery <br /> <span className="text-primary italic">Coordinates.</span>
                        </h1>
                        <p className="text-text-light font-medium leading-relaxed">Please provide the destination for your curated items. Our express logistics network ensures white-glove handling.</p>
                    </div>

                    <div className="p-8 bg-background-light rounded-[2.5rem] border border-slate-100 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-text-dark tracking-tight leading-none mb-1">Global Standard</h4>
                                <p className="text-xs font-bold text-text-light opacity-60">Verified address matching enabled.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-text-dark tracking-tight leading-none mb-1">Express Dispatch</h4>
                                <p className="text-xs font-bold text-text-light opacity-60">Expected 48-hour fulfillment.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Form */}
                <div className="lg:col-span-3">
                    <div className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Home className="w-3 h-3" /> Street Address
                                    </label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-text-light/30"
                                            placeholder="Ex: 123 Luxury Avenue, Suite 402"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Building2 className="w-3 h-3" /> City / Region
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-text-light/30"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1">Provincial State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-text-light/30"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1">Postal Code</label>
                                        <input
                                            type="number"
                                            name="pinCode"
                                            required
                                            value={formData.pinCode}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-text-light/30"
                                            placeholder="400001"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Phone className="w-3 h-3" /> Contact Info
                                        </label>
                                        <input
                                            type="number"
                                            name="phoneNo"
                                            required
                                            value={formData.phoneNo}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-text-light/30"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[0.65rem] font-black text-text-light uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Global Jurisdiction
                                    </label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-background-light border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-black"
                                    >
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-text-dark text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-black/10 flex items-center justify-center group transition-all"
                            >
                                Continue to Settlement <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Shipping;
