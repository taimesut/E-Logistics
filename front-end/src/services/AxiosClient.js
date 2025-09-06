import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACK_END;

const AxiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

AxiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

AxiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.message || "";

            // Nếu token hết hạn
            if (status === 401 && message.includes("Token đã hết hạn")) {
                // Xóa token
                localStorage.removeItem("accessToken");

                // Redirect về trang login
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default AxiosClient;
