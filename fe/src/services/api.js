import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';
const STORAGE_KEY = 'user';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const normalizeAuthResponse = (payload) => {
    const token = payload?.token ?? payload?.accessToken ?? payload?.access_token ?? null;
    let user = payload?.user ?? null;
    const role = user?.role ?? payload?.role ?? null;
    const maNguoiDung = payload?.maNguoiDung ?? user?.maNguoiDung ?? user?.id ?? null;

    if (!user && maNguoiDung) {
        user = { maNguoiDung, role };
    } else if (user && maNguoiDung && !user.maNguoiDung) {
        user.maNguoiDung = maNguoiDung;
    }

    return {
        ...payload,
        token,
        user,
        role,
        maNguoiDung,
    };
};

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        const normalizedData = normalizeAuthResponse(response.data);
        if (normalizedData.token) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedData));
        }
        return normalizedData;
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
        localStorage.removeItem(STORAGE_KEY);
    },

    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
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
        const user = authService.getCurrentUser();
        const response = await api.post('/api/flights', flightData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    },

    updateFlight: async (id, flightData) => {
        const user = authService.getCurrentUser();
        const response = await api.put(`/api/flights/${id}`, flightData, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    },

    deleteFlight: async (id) => {
        const user = authService.getCurrentUser();
        const response = await api.delete(`/api/flights/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        return response.data;
    }
};

export default api;
