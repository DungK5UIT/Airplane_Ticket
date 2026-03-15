import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (name, email, password, role = 'USER') => {
        const response = await api.post('/api/auth/register', { name, email, password, role });
        return response.data;
    },

    verifyEmail: async (code) => {
        const response = await api.get(`/api/auth/verify?code=${code}`);
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/api/auth/forgot-password', { email });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Flight Services
    getAllFlights: async () => {
        const response = await api.get('/api/flights');
        return response.data;
    },

    searchFlights: async (origin, destination) => {
        const response = await api.get('/api/flights/search', {
            params: { origin, destination }
        });
        return response.data;
    },

    createFlight: async (flightData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.post('/api/flights', flightData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    },

    updateFlight: async (id, flightData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.put(`/api/flights/${id}`, flightData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    },

    deleteFlight: async (id) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.delete(`/api/flights/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    }
};

export default api;
