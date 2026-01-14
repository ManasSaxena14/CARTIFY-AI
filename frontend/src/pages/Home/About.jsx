import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, ShieldCheck, Zap, ChevronDown, Bot, MessageSquare, Globe, Heart } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 leading-relaxed font-medium">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const About = () => {
    const stats = [
        { label: 'Active Shoppers', value: '10k+', icon: <Heart className="w-5 h-5" /> },
        { label: 'Global Brands', value: '500+', icon: <Globe className="w-5 h-5" /> },
        { label: 'AI Accuracy', value: '99.9%', icon: <Bot className="w-5 h-5" /> },
    ];

    const faqs = [
        {
            question: "How does the AI filtering work?",
            answer: "Our proprietary AI engine uses natural language processing to understand your specific needs. Instead of just matching keywords, it analyzes the context of your query to find products that truly fit your lifestyle."
        },
        {
            question: "Are the products authentic?",
            answer: "Absolutely. We partner directly with verified brands and authorized distributors. Every item on Cartify AI undergoes a rigorous quality check for provenance and authenticity."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 'Smart Return' window of 30 days. If the AI didn't quite get it right for you, we provide a seamless, zero-cost return process."
        },
        {
            question: "Is my data secure?",
            answer: "Data privacy is our baseline. We use enterprise-grade encryption and never share your personal shopping habits with third-party advertisers."
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187530221-8960faef1db3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/80 to-slate-950"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">The Future of Retail</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-[900] text-white tracking-tighter leading-none mb-8">
                            Engineered for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Luxury Discovery.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed">
                            Cartify AI isn't just a shop—it's a neural marketplace designed to eliminate the friction of modern shopping through intelligent curation.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight italic uppercase leading-none">Our Vision</h2>
                            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 italic">
                                "The best way to predict the future of retail is to engineer it."
                            </p>
                            <p className="text-slate-600 font-medium leading-relaxed mb-8 text-lg">
                                We believe that in an age of infinite choice, the most valuable luxury is time. Our mission is to bridge the gap between human intent and product delivery using world-class AI models. We're not just building a store; we're crafting a neural ecosystem where every interaction is meaningful and every discovery is delightful.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">Precision Curation</h4>
                                        <p className="text-sm text-slate-500 font-medium">Every product is vetted against our 50-point quality matrix.</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100 transition-transform hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-800 mb-1">Instant Insights</h4>
                                        <p className="text-sm text-slate-500 font-medium">Real-time trend analysis that puts you ahead of the curve.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative lg:ml-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative rounded-[4rem] overflow-hidden border border-slate-100 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                                    alt="Future Office"
                                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 grid grid-cols-1 gap-6">
                                {stats.map((stat) => (
                                    <div key={stat.label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter italic uppercase">Key Features</h2>
                            <p className="text-lg text-slate-500 font-medium">Revolutionizing the way you discover and acquire premium goods.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "AI Search Engine",
                                desc: "No more complex filters. Describe what you want in plain words and our neural engine finds it.",
                                icon: <Bot className="w-8 h-8" />,
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                title: "Verified Assets",
                                desc: "Every single listing is authenticated. We guarantee 100% genuine products directly from source.",
                                icon: <ShieldCheck className="w-8 h-8" />,
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            {
                                title: "Global Delivery",
                                desc: "Seamless logistics to over 50 countries with real-time AI tracking and smart customs handling.",
                                icon: <Globe className="w-8 h-8" />,
                                color: "bg-indigo-50 text-indigo-600"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50 border-y border-slate-100" id="faqs">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
                            <MessageSquare className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter italic">COMMON QUERIES</h2>
                        <p className="text-slate-500 font-medium">Everything you need to know about navigating the future of shopping.</p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-white">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Professional Signature */}
            <section className="py-24 text-center bg-slate-950">
                <div className="container mx-auto px-4">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">ENGINEERED FOR EXCELLENCE</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        © 2026 Cartify AI. AI-First E-commerce Framework. v2.0
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;
