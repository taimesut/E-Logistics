import AxiosClient from "../../services/AxiosClient.js";

const ManagerApi = {
    createParcel(data) {
        return AxiosClient.post('/manager/parcel', data);
    },
    getParcels(page = 0, size = 10, status, type, search = "") {
        return AxiosClient.get(`/manager/parcel?page=${page}&size=${size}&status=${status}&type=${type}&search=${search}`);
    },
    getParcel(id) {
        return AxiosClient.get('/manager/parcel/' + id);
    },
    getShippers() {
        return AxiosClient.get('/manager/shipper');
    },
    getShipper(id) {
        return AxiosClient.get('/manager/shipper/' + id);
    },
    setShipper(id, shipperId, type){
        return AxiosClient.put(`/manager/parcel/${id}?shipperId=${shipperId}&type=${type}`);
    },
    updateStatusParcel(id, status) {
        return AxiosClient.put(`/manager/parcel/${id}?&status=${status}`);
    },
    getStats(){
        return AxiosClient.get(`/manager/stats`);
    }
}

export default ManagerApi;