import axios from 'axios';
import { AuthService } from '../services/auth.service';

const api = axios.create({
    baseURL: 'https://pheasant-massive-regularly.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "69420",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            new AuthService().logout();
            localStorage.setItem("expiredSession", "true");
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 