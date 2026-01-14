import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader, Trash2, User, Search, Filter,
    Shield, Mail, Calendar, ChevronDown, Activity,
    ShieldCheck, UserCheck, AlertCircle, ShoppingBag, X
} from 'lucide-react';
import adminAPI from '../../api/adminAPI';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { TableSkeleton } from '../../components/common/Skeleton';

const UserListAdmin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getAllUsers();
            setUsers(response.data.users);
        } catch {
            // Silently handle fetch error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (id, role) => {
        const toastId = toast.loading('Reconfiguring authority level...');
        try {
            await adminAPI.updateUserRole(id, role);
            toast.success('Security clearance updated', { id: toastId });
            fetchUsers();
            if (selectedUser && selectedUser._id === id) {
                setSelectedUser({ ...selectedUser, role });
            }
        } catch {
            toast.error('Failed to update role', { id: toastId });
        }
    };

    const handleDelete = async () => {
        const toastId = toast.loading('Excommunicating member...');
        try {
            await adminAPI.deleteUser(confirmDelete.id);
            toast.success('Profile purged from database', { id: toastId });
            setConfirmDelete({ open: false, id: null });
            fetchUsers();
        } catch {
            toast.error('Failed to delete user', { id: toastId });
        }
    };

    const filteredUsers = users
        .filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

    if (loading) return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="w-48 h-4 bg-slate-100 rounded-full" />
                    <div className="w-96 h-12 bg-slate-100 rounded-full" />
                </div>
            </header>
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100">
                <TableSkeleton rows={8} cols={4} />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                        <Shield className="w-4 h-4 fill-primary" />
                        Access Authority
                    </div>
                    <h1 className="text-5xl font-black text-text-dark tracking-tighter leading-tight">
                        Member <span className="text-primary italic">Directory.</span>
                    </h1>
                </div>
            </header>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search members by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-text-dark"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="appearance-none pl-6 pr-12 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark focus:border-primary/30 outline-none cursor-pointer shadow-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                    </div>
                    <div className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[0.65rem] font-black uppercase tracking-widest text-text-dark shadow-sm">
                        <Activity size={16} className="text-primary" />
                        {users.length} Active Profiles
                    </div>
                </div>
            </div>

            {/* Modern Table Interface */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Member Identity</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Contact Channel</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em]">Privilege Level</th>
                                <th className="px-8 py-6 text-[0.65rem] font-black text-text-light uppercase tracking-[0.2em] text-right">Security Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user, idx) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-slate-50/50 transition-all duration-300"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-background-light rounded-xl flex items-center justify-center text-primary border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                                <User size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="font-mono text-[0.6rem] font-black text-text-light uppercase tracking-widest opacity-60">ID: #{user._id.slice(-8)}</p>
                                                <p className="font-black text-text-dark tracking-tight">{user.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-300" />
                                            <span className="text-sm font-bold text-text-light">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="relative min-w-[120px]">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                                className={`appearance-none w-full px-4 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none
                                                    ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-100'}
                                                `}
                                            >
                                                <option value="user">Member</option>
                                                <option value="admin">Authority</option>
                                            </select>
                                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => setSelectedUser(user)}
                                                className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                            >
                                                <UserCheck size={18} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => setConfirmDelete({ open: true, id: user._id })}
                                                className="p-3 text-secondary hover:bg-secondary/10 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* User Detail Modal */}
                <AnimatePresence>
                    {selectedUser && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedUser(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border-4 border-white shadow-xl">
                                            <User size={36} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-text-dark tracking-tighter">{selectedUser.name}</h2>
                                            <p className="text-text-light font-bold text-sm tracking-widest uppercase opacity-60">Verified Member</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        <X size={20} className="text-text-dark" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[0.6rem] font-black text-text-light uppercase tracking-[0.2em] mb-2 block">Electronic Mail</label>
                                            <p className="text-lg font-bold text-text-dark">{selectedUser.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-[0.6rem] font-black text-text-light uppercase tracking-[0.2em] mb-2 block">Authority Level</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedUser.role}
                                                    onChange={(e) => handleRoleUpdate(selectedUser._id, e.target.value)}
                                                    className={`appearance-none w-full px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-widest border transition-all cursor-pointer outline-none
                                                        ${selectedUser.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-100'}
                                                    `}
                                                >
                                                    <option value="user">Member</option>
                                                    <option value="admin">Authority</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[0.6rem] font-black text-text-light uppercase tracking-[0.2em] mb-2 block">Registration Date</label>
                                            <div className="flex items-center gap-2 text-text-dark font-bold">
                                                <Calendar size={16} className="text-primary" />
                                                {new Date(selectedUser.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[0.6rem] font-black text-text-light uppercase tracking-[0.2em] mb-2 block">Member Index</label>
                                            <code className="text-[0.7rem] bg-slate-50 px-2 py-1 rounded-lg text-slate-400">#{selectedUser._id}</code>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        onClick={() => setSelectedUser(null)}
                                        className="flex-1 py-5 bg-text-dark text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all"
                                    >
                                        Acknowledge
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <AlertCircle className="mx-auto h-12 w-12 text-slate-200" />
                        <p className="text-text-light font-bold text-[0.65rem] uppercase tracking-widest">No matching identities identified.</p>
                    </div>
                )}
            </motion.div>

            <ConfirmationModal
                isOpen={confirmDelete.open}
                onClose={() => setConfirmDelete({ open: false, id: null })}
                onConfirm={handleDelete}
                title="Purge Profile?"
                message="This will permanently delete the member identity and associated metadata. This operation cannot be rolled back."
                confirmText="Terminate Account"
            />
        </div>
    );
};

export default UserListAdmin;
