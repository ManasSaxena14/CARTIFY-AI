import axiosClient from './axiosClient';

const productAPI = {
    getAllProducts: (params) => axiosClient.get('/products', { params }), // params for search/filter
    getProductById: (id) => axiosClient.get(`/products/${id}`),
    createReview: (id, reviewData) => axiosClient.post(`/products/${id}/review`, reviewData),
    getCategories: () => axiosClient.get('/products/categories'),

    // AI Features - uses single ai-filter endpoint for all AI queries
    getAIFilteredProducts: (userQuery) => axiosClient.post('/products/ai-filter', { userQuery }),
};

export default productAPI;
