import AxiosClient from "./AxiosClient.js";

const DashboardApi = {
    getCustomer: () => AxiosClient.get(`/dashboard/customer`),
    getShipper: () => AxiosClient.get(`/dashboard/shipper`),
    getManager: () => AxiosClient.get(`/dashboard/manager`),
    getAdmin: () => AxiosClient.get(`/dashboard/admin`)
};

export default DashboardApi;