import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const newsletterAPI = {
    subscribe: async (email) => {
        return axios.post(`${API_URL}/support/subscribe`, { email });
    }
};

export default newsletterAPI;
