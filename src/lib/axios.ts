import axios from 'axios';
// import { AuthService } from '../services/auth.service';

const api = axios.create({
    baseURL: 'http://162.240.144.174',
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true",
    },
});

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401 && window.location.pathname !== '/login') {
//             new AuthService().logout();
//             localStorage.setItem("expiredSession", "true");
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

export default api; 