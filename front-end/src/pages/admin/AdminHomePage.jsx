import React, {useEffect, useState} from 'react';
import AdminApi from "./AdminApi.js";
import {useNavigate} from "react-router-dom";
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

const AdminHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try{
                setIsLoading(true);
                const res = await AdminApi.getStats();
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
                <span>Tài khoản</span>
                <StatCard title={"Shipper"}  value={stats.SHIPPER} link={"/admin/account?role=ROLE_SHIPPER"} />
                <StatCard title={"Quản lý"}  value={stats.MANAGER} link={"/admin/account?role=ROLE_MANAGER"} />
                <StatCard title={"Khách hàng"}  value={stats.CUSTOMER} link={"/admin/account?role=ROLE_CUSTOMER"} />
            </div>
            <div className="row">
                <span>Chi nhánh</span>
                <StatCard title={"Chi nhánh hoạt động"}  value={stats.BRANCH_ACTIVE} link={"/admin/branch?status=ACTIVE"} />
                <StatCard title={"Chi nhánh không hoạt động"}  value={stats.BRANCH_INACTIVE} link={"/admin/branch?status=INACTIVE"} />
            </div>

        </div>
    );
};

export default AdminHomePage;