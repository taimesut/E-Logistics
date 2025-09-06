import React, {useEffect, useState} from 'react';
import AdminApi from "../admin/AdminApi.js";
import {useNavigate} from "react-router-dom";
import CustomerApi from "./CustomerApi.js";
import Spinner from "../../componets/Spinner.jsx";

const StatCard = ({title, value, link}) => {
    const navigate = useNavigate();

    return (
        <div className="col-md-3 col-sm-6 mb-3 btn" onClick={() => navigate(link)}>
            <div className="card shadow-sm border-primary">
                <div className="card-body text-center">
                    <h6 className="card-title text-muted">{title}</h6>
                    <h3 className="card-text text-primary fw-bold">{value}</h3>
                </div>
            </div>
        </div>)
}

const CustomerHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsLoading(true);
                const res = await CustomerApi.getStats();
                setStats(res?.data?.data);
                console.log(res?.data?.data);
            }catch(err){
                console.log(err);
            }finally {
                setIsLoading(false);
            }
        }
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);
    if (isLoading) {
        return <Spinner />;
    }
    return (
        <div className="container my-4">
            <div className="row">
                <span>Đơn hàng</span>
                <StatCard title={"Tổng số đơn"}  value={stats.SUM}/>
                <StatCard title={"Mới tạo"}  value={stats.CREATED} link={"/customer/parcel?status=CREATED"} />
                <StatCard title={"Đã hủy"}  value={stats.CANCELLED} link={"/customer/parcel?status=CANCELLED"} />
                <StatCard title={"Đang lấy hàng"}  value={stats.PICKUP_IN_PROGRESS} link={"/customer/parcel?status=PICKUP_IN_PROGRESS"} />
                <StatCard title={"Lấy hàng thất bại"}  value={stats.PICKUP_FAILED} link={"/customer/parcel?status=PICKUP_FAILED"} />
                <StatCard title={"Lấy hàng thành công"}  value={stats.PICKUP_SUCCESS} link={"/customer/parcel?status=PICKUP_SUCCESS"} />
                <StatCard title={"Đến nơi lấy hàng"}  value={stats.AT_FROM_BRANCH} link={"/customer/parcel?status=AT_FROM_BRANCH"} />
                <StatCard title={"Đến nơi giao hàng"}  value={stats.AT_TO_BRANCH} link={"/customer/parcel?status=AT_TO_BRANCH"} />
                <StatCard title={"Đang chuyển tới nơi giao"}  value={stats.IN_TRANSIT_TO_TO_BRANCH} link={"/customer/parcel?status=IN_TRANSIT_TO_TO_BRANCH"} />
                <StatCard title={"Đang chuyển tới nơi lấy"}  value={stats.IN_TRANSIT_TO_FROM_BRANCH} link={"/customer/parcel?status=IN_TRANSIT_TO_FROM_BRANCH"} />
                <StatCard title={"Đang giao hàng"}  value={stats.DELIVERY_IN_PROGRESS} link={"/customer/parcel?status=DELIVERY_IN_PROGRESS"} />
                <StatCard title={"Giao thất bại"}  value={stats.DELIVERY_FAILED} link={"/customer/parcel?status=DELIVERY_FAILED"} />
                <StatCard title={"Giao thành công"}  value={stats.DELIVERED} link={"/customer/parcel?status=DELIVERED"} />
                <StatCard title={"Đã trả"}  value={stats.RETURNED} link={"/customer/parcel?status=RETURNED"} />
            </div>
        </div>
    );
};

export default CustomerHomePage;
