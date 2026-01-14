import axiosClient from './axiosClient';

const userAPI = {
    getMe: () => axiosClient.get('/users/me'),
    getWatchlist: () => axiosClient.get('/users/watchlist'),
    addToWatchlist: (productId) => axiosClient.post('/users/watchlist', { productId }),
    removeFromWatchlist: (productId) => axiosClient.delete(`/users/watchlist/${productId}`),
};

export default userAPI;
