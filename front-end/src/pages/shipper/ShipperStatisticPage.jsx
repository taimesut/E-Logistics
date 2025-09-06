import React, {useEffect, useState} from 'react';
import StatisticApi from "../../services/StatisticApi.js";

const ShipperStatisticPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        StatisticApi.getShipper().then((res) => setData(res.data));
    }, []);

    if (!data) return <div className="text-center p-3">Loading...</div>;

    return (
        <div className="container mt-4">
            <h3 className="mb-3">🚚 Thống kê shipper</h3>
            <div className="card p-3 shadow-sm">
                <p><strong>Tổng số đơn tham gia:</strong> {data.totalParcels}</p>
                <p><strong>Đơn giao thành công:</strong> {data.successParcels}</p>
                <p><strong>Đơn thất bại:</strong> {data.failedParcels}</p>
                <h5>Thống kê theo trạng thái:</h5>
                <ul className="list-group">
                    {Object.entries(data.statusCount).map(([status, count]) => (
                        <li key={status} className="list-group-item d-flex justify-content-between">
                            <span>{status}</span>
                            <span className="badge bg-success">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ShipperStatisticPage;