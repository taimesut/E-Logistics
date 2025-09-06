import React, {useEffect, useState} from 'react';
import StatisticApi from "../../services/StatisticApi.js";

const AdminStatisticPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        StatisticApi.getAdmin().then((res) => setData(res.data));
    }, []);

    if (!data) return <div className="text-center p-3">Loading...</div>;

    return (
        <div className="container mt-4">
            <h3 className="mb-3">🛠️ Thống kê toàn hệ thống</h3>
            <div className="card p-3 shadow-sm">
                <div className="row text-center">
                    <div className="col">
                        <h5>Khách hàng</h5>
                        <p>{data.totalCustomers}</p>
                    </div>
                    <div className="col">
                        <h5>Shipper</h5>
                        <p>{data.totalShippers}</p>
                    </div>
                    <div className="col">
                        <h5>Manager</h5>
                        <p>{data.totalManagers}</p>
                    </div>
                    <div className="col">
                        <h5>Chi nhánh</h5>
                        <p>{data.totalBranches}</p>
                    </div>
                </div>
                <hr />
                <p><strong>Tổng số đơn:</strong> {data.totalParcels}</p>
                <p><strong>Tổng doanh thu:</strong> {data.totalRevenue} VND</p>
                <h5>Thống kê đơn theo trạng thái:</h5>
                <ul className="list-group">
                    {Object.entries(data.statusCount).map(([status, count]) => (
                        <li key={status} className="list-group-item d-flex justify-content-between">
                            <span>{status}</span>
                            <span className="badge bg-dark">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminStatisticPage;