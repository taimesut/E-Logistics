import AxiosClient from "../../services/AxiosClient.js";

const ShipperApi =  {
    getParcels(page = 0, size = 10, status, type, search =""){
        return AxiosClient.get(`/shipper/parcel?page=${page}&size=${size}&status=${status}&type=${type}&search=${search}`);
    },
    getParcel(id){
        return AxiosClient.get('/shipper/parcel/' + id);
    },
    updateStatusParcel(id, status){
        return AxiosClient.put(`/shipper/parcel/${id}?&status=${status}`);
    },
    getStats(){
        return AxiosClient.get(`/shipper/stats`);
    },
    uploadImages(formData){
        return AxiosClient.post(`/shipper/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default ShipperApi;