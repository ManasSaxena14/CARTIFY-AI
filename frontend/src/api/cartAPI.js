import axiosClient from './axiosClient';

const cartAPI = {
    getMyCart: () => axiosClient.get('/cart'),
    addToCart: (productId, quantity) => axiosClient.post('/cart/add', { productId, quantity }),
    updateCartItem: (productId, quantity) => axiosClient.put('/cart/update', { productId, quantity }),
    removeFromCart: (productId) => axiosClient.delete(`/cart/remove/${productId}`),
    clearCart: () => axiosClient.delete('/cart/clear'),
};

export default cartAPI;
