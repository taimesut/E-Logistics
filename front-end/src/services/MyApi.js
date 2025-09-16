import AxiosClient from "./AxiosClient.js";

const MyApi = {
    // ------------------------------------------------------------
    getShipper(id) {
        return AxiosClient.get('/user/shipper/' + id);
    },
    getParcel(id) {
        return AxiosClient.get('/parcel/' + id);
    },
    getShippers() {
        return AxiosClient.get('/user/shipper');
    },
    tracking(code) {
        return AxiosClient.get('/public/tracking', {
            params: {code: code}
        });
    },
    getImagesForParcel(id) {
        return AxiosClient.get(`/user/images-parcel?id=${id}`);
    },
    getProductsInParcel(parcelId) {
        return AxiosClient.get('/parcel/detail-product-in-parcel?parcelId=' + parcelId);
    },
    setShipperForParcel(id, shipperId, type) {
        return AxiosClient.put(`/parcel/${id}?shipperId=${shipperId}&typeShipper=${type}`);
    },
    getParcels(page = 0, size = 10, status, search = "") {
        return AxiosClient.get(`/parcel?page=${page}&size=${size}&status=${status}&search=${search}`);
    },
    updateStatusParcel(id, status) {
        return AxiosClient.put(`/parcel/${id}?&status=${status}`);
    },
    uploadImages(formData) {
        return AxiosClient.post(`/parcel/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getShippingRule(){
        return AxiosClient.get(`/shipping-rule`);
    },
    setShippingRule(data){
        return AxiosClient.post(`/shipping-rule`,data);
    },
    createBranch (branch) {
        return AxiosClient.post('/branch', branch);
    },
    getBranchById (id) {
        return AxiosClient.get(`/branch/${id}`);
    },
    updateBranch (id,branch) {
        return AxiosClient.put(`/branch/${id}`, branch);
    },
    getAllBranch(page = 0, size = 10, search, status){
        return AxiosClient.get(`/branch?page=${page}&size=${size}&search=${search}&status=${status}`);
    },

    createAccount (account) {
        return AxiosClient.post(`/user`, account);
    },
    updateAccount (id, account) {
        return AxiosClient.put(`/user/${id}`, account);
    },
    getAccountById (id) {
        return AxiosClient.get(`/user/${id}`);
    },
    getAllAccount(page = 0, size = 10, search ="", role = "", status = "") {
        return AxiosClient.get(`/user?page=${page}&size=${size}&search=${search}&role=${role}&status=${status}`);
    },
    createProduct(data) {
        return AxiosClient.post('/product', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getProducts(page=0,size=10,search = "") {
        return AxiosClient.get(`/product?page=${page}&size=${size}&search=${search}`);
    },
    getProductById(id) {
        return AxiosClient.get(`/product/${id}`);
    },
    updateProduct(id, data) {
        return AxiosClient.put(`/product/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    deleteProduct(id) {
        return AxiosClient.delete(`/product/${id}`);
    },
    createParcel (data) {
        return AxiosClient.post('/parcel', data);
    },
    getParcelById(id) {
        return AxiosClient.get('/parcel/' + id);
    },
};

export default MyApi;