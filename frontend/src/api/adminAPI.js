import axiosClient from './axiosClient';

const adminAPI = {
    getAllUsers: () => axiosClient.get('/admin/users'),
    getSingleUser: (id) => axiosClient.get(`/admin/users/${id}`),
    updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),

    getAdminProducts: () => axiosClient.get('/admin/products'),
    getLowStockProducts: () => axiosClient.get('/admin/products/low-stock'),
    createProduct: (productData) => axiosClient.post('/products', productData), 
    updateProduct: (id, productData) => axiosClient.put(`/products/${id}`, productData),
    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

    getAllOrders: () => axiosClient.get('/admin/orders'),
    updateOrderStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),
    deleteOrder: (id) => axiosClient.delete(`/admin/orders/${id}`),

    getDashboardStats: () => axiosClient.get('/admin/dashboard'),
    getAIReport: () => axiosClient.get('/admin/report'),

    getAllReviews: () => axiosClient.get('/admin/reviews'),
    deleteReview: (productId, reviewId) => axiosClient.delete(`/admin/reviews/${productId}/${reviewId}`),
    uploadImage: (image) => axiosClient.post('/cloud/upload', { image }),
    deleteImage: (public_id) => axiosClient.post('/cloud/delete', { public_id }),
};

export default adminAPI;
