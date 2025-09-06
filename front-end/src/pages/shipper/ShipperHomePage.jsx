import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import ManagerApi from "../manager/ManagerApi.js";
import Spinner from "../../componets/Spinner.jsx";
import ShipperApi from "./ShipperApi.js";

const StatCard = ({title, value, type, status}) => {
    const navigate = useNavigate();
    return (
        <div className="col-md-3 col-sm-6 mb-3 btn" onClick={() => navigate(`/shipper/parcel?type=${type}&status=${status}`)}>
            <div className="card shadow-sm border-primary">
                <div className="card-body text-center">
                    <h6 className="card-title text-muted">{title}</h6>
                    <h3 className="card-text text-primary fw-bold">{value}</h3>
                </div>
            </div>
        </div>)
}

const ShipperHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await ShipperApi.getStats();
            setStats(response?.data?.data);
            console.log(response?.data?.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStats();

        const intervalId = setInterval(() => {
            fetchStats();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [])

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="container my-4">
            <div className="row">
                <span>PICKUP</span>
                {/*<StatCard title={"Chưa gán nhân viên"} status={"CREATED"} type={"PICKUP"} value={stats.CREATED} />*/}
                <StatCard title={"Đang lấy"} status={"PICKUP_IN_PROGRESS"} type={"PICKUP"} value={stats.PICKUP_IN_PROGRESS} />
                <StatCard title={"Lấy thành công"} status={"PICKUP_SUCCESS"} type={"PICKUP"} value={stats.PICKUP_SUCCESS} />
                <StatCard title={"Lấy thất bại"} status={"PICKUP_FAILED"} type={"PICKUP"} value={stats.PICKUP_FAILED} />
                {/*<StatCard title={"Chưa chuyển đi"} status={"AT_FROM_BRANCH"} type={"PICKUP"} value={stats.AT_FROM_BRANCH} />*/}
                {/*<StatCard title={"Đang chuyển đi"} status={"IN_TRANSIT_TO_TO_BRANCH"} type={"PICKUP"} value={stats.IN_TRANSIT_TO_TO_BRANCH} />*/}
                {/*<StatCard title={"Đã hủy"} status={"CANCELLED"} type={"PICKUP"} value={stats.CANCELLED} />*/}
            </div>
            <div className="row">
                <span>DELIVERY</span>
                {/*<StatCard title={"Đang chuyển tới"} status={"IN_TRANSIT_TO_TO_BRANCH"} type={"DELIVERY"} value={stats.IN_TRANSIT_TO_TO_BRANCH} />*/}
                {/*<StatCard title={"Chưa gán nhân viên"} status={"AT_TO_BRANCH"} type={"DELIVERY"} value={stats.AT_TO_BRANCH} />*/}
                <StatCard title={"Đang giao"} status={"DELIVERY_IN_PROGRESS"} type={"DELIVERY"} value={stats.DELIVERY_IN_PROGRESS} />
                <StatCard title={"Giao thành công"} status={"DELIVERED"} type={"DELIVERY"} value={stats.DELIVERED} />
                <StatCard title={"Giao thất bại"} status={"DELIVERY_FAILED"} type={"DELIVERY"} value={stats.DELIVERY_FAILED} />
            </div>
        </div>
    );
};

export default ShipperHomePage;