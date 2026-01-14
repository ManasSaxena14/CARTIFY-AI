import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm Procedure", type = "danger" }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
                >
                    <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 
                        ${type === 'danger' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-primary/10 text-primary border border-primary/20'}
                    `}>
                        <AlertTriangle size={32} />
                    </div>

                    <h2 className="text-3xl font-black text-text-dark tracking-tighter mb-4">{title}</h2>
                    <p className="text-text-light font-medium text-sm leading-relaxed mb-10">{message}</p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all
                                ${type === 'danger' ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600' : 'bg-primary text-white shadow-primary/20 hover:bg-indigo-700'}
                            `}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-5 bg-slate-50 text-text-dark rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
                        >
                            Cancel Mission
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
