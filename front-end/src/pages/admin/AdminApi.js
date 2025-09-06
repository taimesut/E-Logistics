import AxiosClient from "../../services/AxiosClient.js";

const AdminApi = {
    // branch
    createBranch (branch) {
        return AxiosClient.post('/admin/branch', data);
    },
    getBranchById (id) {
        return AxiosClient.get(`/admin/branch/${id}`);
    },
    updateBranch (id,branch) {
        return AxiosClient.put(`/admin/branch/${id}`, branch);
    },
    getBranches(page = 0, size = 10, search = "",status=""){
        return AxiosClient.get(`/admin/branch?page=${page}&size=${size}&search=${search}&status=${status}`);
    },

    // staff
    createStaff (account) {
        return AxiosClient.post(`/admin/account`, account);
    },
    updateStaff (id, account) {
        return AxiosClient.put(`/admin/account/${id}`, account);
    },
    getStaffById (id) {
        return AxiosClient.get(`/admin/account/${id}`);
    },
    getStaffs(page = 0, size = 10, search ="", role = ""){
        return AxiosClient.get(`/admin/account?page=${page}&size=${size}&search=${search}&role=${role}`);
    },
    getShippingRule(){
        return AxiosClient.get(`/admin/shipping-rule`);
    },
    setShippingRule(data){
        return AxiosClient.post(`/admin/shipping-rule`,data);
    },
    getStats(){
        return AxiosClient.get(`/admin/stats`);
    }
}

export default AdminApi;