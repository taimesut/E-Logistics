import AxiosClient from "./AxiosClient.js";

const StatisticApi = {
    getCustomer: (startDate,endDate) => AxiosClient.get(`/statistics/customer?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`),
    getShipper: () => AxiosClient.get(`/statistics/shipper`),
    getManager: () => AxiosClient.get(`/statistics/manager`),
    getAdmin: () => AxiosClient.get(`/statistics/admin`)
};

export default StatisticApi;