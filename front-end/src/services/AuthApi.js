import AxiosClient from "./AxiosClient.js";

const AuthApi = {
    register(data) {
        return AxiosClient.post('/auth/register', data);
    },
    login(data) {
        return AxiosClient.post('/auth/login', data);
    }
};

export default AuthApi;