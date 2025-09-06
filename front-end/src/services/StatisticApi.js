import axios from "axios";
import AxiosClient from "./AxiosClient.js";

const StatisticApi = {
    getCustomer: () => AxiosClient.get(`/statistics/customer`),
    getShipper: () => AxiosClient.get(`/statistics/shipper`),
    getManager: () => AxiosClient.get(`/statistics/manager`),
    getAdmin: () => AxiosClient.get(`/statistics/admin`)
};

export default StatisticApi;