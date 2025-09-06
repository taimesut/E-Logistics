import AxiosClient from "./AxiosClient.js";

const UserApi = {
    getProfile() {
        return AxiosClient.get('/user/profile');
    }
};

export default UserApi;