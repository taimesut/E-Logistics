import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import StatisticApi from "../../services/StatisticApi.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const CustomerStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split("T")[0];

    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(today);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await StatisticApi.getCustomer(startDate, endDate);
            const formatted = response.data.map(item => ({
                productId: item[0],
                productName: item[1],
                totalQuantity: item[2],
                totalRevenue: item[3],
            }));
            setData(formatted);
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totalQuantity = data.reduce((sum, item) => sum + item.totalQuantity, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);

    const chartData = {
        labels: data.map(d => d.productName),
        datasets: [
            {
                label: "Doanh thu (VNĐ)",
                data: data.map(d => d.totalRevenue),
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, "rgba(54, 162, 235, 0.5)");
                    gradient.addColorStop(1, "rgba(54, 162, 235, 0.9)");
                    return gradient;
                },
                borderRadius: 6,
            },
            {
                label: "Số lượng bán",
                data: data.map(d => d.totalQuantity),
                backgroundColor: function(context) {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, "rgba(255, 99, 132, 0.5)");
                    gradient.addColorStop(1, "rgba(255, 99, 132, 0.9)");
                    return gradient;
                },
                borderRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: "easeOutQuart" },
        plugins: {
            title: {
                display: true,
                text: "📊 Thống kê doanh thu & số lượng sản phẩm",
                font: { size: 18 },
                padding: { top: 8, bottom: 15 },
            },
            legend: { position: "bottom", labels: { boxWidth: 15, padding: 10 } },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let value = context.raw;
                        if (context.dataset.label.includes("Doanh thu")) {
                            value = Number(value).toLocaleString("vi-VN") + " VNĐ";
                        }
                        return `${context.dataset.label}: ${value}`;
                    },
                },
            },
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
        scales: {
            y: { beginAtZero: true },
            x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 } }
        }
    };

    return (
        <div style={{
            maxWidth: "1100px",
            margin: "40px auto",
            backgroundColor: "#f5f7fa",
            padding: "20px 25px",
            boxSizing: "border-box",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "25px"
        }}>
            <h2 style={{ textAlign: "center", margin: "0 0 20px", fontWeight: 600, fontSize: "22px" }}>
                Thống kê sản phẩm
            </h2>

            {/* Card summary */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
                <div style={{ flex: "1 1 150px", backgroundColor: "#e6f2ff", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                    <h3 style={{ margin: "0 0 5px", fontSize: "20px", color: "#007bff" }}>{totalQuantity}</h3>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Tổng sản phẩm</p>
                </div>
                <div style={{ flex: "1 1 150px", backgroundColor: "#ffe6f0", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                    <h3 style={{ margin: "0 0 5px", fontSize: "20px", color: "#ff3399" }}>{totalRevenue.toLocaleString()} VNĐ</h3>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Tổng doanh thu</p>
                </div>
                <div style={{ flex: "1 1 200px", backgroundColor: "#e6ffe6", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
                    <h3 style={{ margin: "0 0 5px", fontSize: "14px", color: "#33aa33" }}>{startDate} → {endDate}</h3>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Khoảng thời gian</p>
                </div>
            </div>

            {/* Form chọn ngày */}
            <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>Từ ngày:</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                </div>
                <div style={{ flex: "1 1 200px", backgroundColor: "#fff", padding: "15px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 500, fontSize: "14px" }}>Đến ngày:</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", border: "1px solid #ccc" }} />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={fetchData} style={{ padding: "10px 25px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500, fontSize: "14px" }}>
                    Xem thống kê
                </button>
            </div>

            {/* Chart */}
            <div style={{ flex: 1, backgroundColor: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", minHeight: "400px" }}>
                {loading ? (
                    <p style={{ textAlign: "center", fontSize: "16px" }}>Đang tải dữ liệu...</p>
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>
        </div>
    );
};

export default CustomerStats;
