import AxiosClient from "../../services/AxiosClient.js";

const CustomerApi = {
    createParcel (data) {
        return AxiosClient.post('/customer/parcel', data);
    },
    getParcels (page = 0, size = 10, status, search ="") {
        if(status === "" || status === null) {
            return AxiosClient.get(`/customer/parcel?page=${page}&size=${size}&search=${search}`);
        }
        return AxiosClient.get(`/customer/parcel?page=${page}&size=${size}&status=${status}&search=${search}`);
    },
    getParcelById(id) {
        return AxiosClient.get('/customer/parcel/' + id);
    },
    getShipper(id) {
        return AxiosClient.get('/customer/shipper/' + id);
    },
    cancelParcel(id){
        return AxiosClient.put(`/customer/parcel/${id}`);
    },
    getStats(){
        return AxiosClient.get('/customer/stats');
    }
}

export default CustomerApi;