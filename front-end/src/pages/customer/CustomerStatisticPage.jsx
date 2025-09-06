import React, {useEffect, useState} from 'react';
import StatisticApi from "../../services/StatisticApi.js";
import Spinner from "../../componets/Spinner.jsx";

const CustomerStatisticPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        StatisticApi.getCustomer().then((res) => setData(res.data));
    }, []);

    if (!data) return <Spinner />;

    return (
        <div className="container mt-4">
            <h3 className="mb-3">📦 Thống kê khách hàng</h3>
            <div className="card p-3 shadow-sm">
                <p><strong>Tổng số đơn hàng:</strong> {data.totalParcels}</p>
                <p><strong>Tổng phí vận chuyển:</strong> {data.totalShippingFee} VND</p>
                <h5>Thống kê theo trạng thái:</h5>
                <ul className="list-group">
                    {Object.entries(data.statusCount).map(([status, count]) => (
                        <li key={status} className="list-group-item d-flex justify-content-between">
                            <span>{status}</span>
                            <span className="badge bg-primary">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomerStatisticPage;