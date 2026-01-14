import React from 'react';
// import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={`bg-slate-100 rounded-2xl ${className}`}
        />
    );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
    return (
        <div className="w-full space-y-4">
            <div className="flex gap-4 mb-8">
                {[...Array(cols)].map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-slate-50">
                    {[...Array(cols)].map((_, j) => (
                        <Skeleton key={j} className="h-10 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-8" />
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
