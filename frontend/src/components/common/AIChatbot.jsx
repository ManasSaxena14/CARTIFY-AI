import React, { useState, useRef, useEffect } from 'react';
import chatAPI from '../../api/chatAPI';
import { Bot, X, Send, Sparkles, Loader } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Cartify AI. How can I help you shop today?", sender: 'ai' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        try {
            const response = await chatAPI.sendMessage(userMsg.text);
            const aiMsg = { id: Date.now() + 1, text: response.data.reply, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errorMessage = err.response?.data?.reply || "Sorry, I'm having trouble connecting right now.";
            const errorMsg = { id: Date.now() + 1, text: errorMessage, sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between text-white">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Cartify Assistant</h3>
                                    <span className="text-xs text-blue-100 flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 min-h-[300px]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                                            AI
                                        </div>
                                    )}
                                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
                        ${msg.sender === 'user'
                                            ? 'bg-primary text-white rounded-br-none'
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                        }
                     `}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start mb-4 ml-10">
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex space-x-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="bg-primary hover:bg-primary-dark text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-colors duration-300
           ${isOpen ? 'bg-slate-700' : 'bg-gradient-to-r from-secondary to-pink-600'}
        `}
            >
                {isOpen ? <X size={24} /> : <Bot size={24} />}
            </motion.button>
        </div>
    );
};

export default AIChatbot;
