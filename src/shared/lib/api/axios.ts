import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

let activeRequestsCount = 0;

const showLoader = () => {
    activeRequestsCount++;
    if (activeRequestsCount === 1) {
        window.dispatchEvent(new CustomEvent('mnv-preloader-show'));
    }
};

const hideLoader = () => {
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    if (activeRequestsCount === 0) {
        window.dispatchEvent(new CustomEvent('mnv-preloader-hide'));
    }
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        showLoader();
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        hideLoader();
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        hideLoader();
        return response;
    },
    (error) => {
        hideLoader();
        return Promise.reject(error);
    }
);

export default api;
