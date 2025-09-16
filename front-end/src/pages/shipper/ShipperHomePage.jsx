import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Spin, Typography } from "antd";
import DashboardApi from "../../services/DashboardApi.js";

const { Title, Text } = Typography;

const StatCard = ({ title, value, status }) => {
    const navigate = useNavigate();

    return (
        <Col xs={24} sm={12} md={8} lg={6} style={{ marginBottom: 16 }}>
            <Card
                hoverable
                bordered
                onClick={() => navigate(`/shipper/parcel?status=${status}`)}
                style={{ textAlign: "center" }}
            >
                <Text type="secondary">{title}</Text>
                <Title level={3} style={{ color: "#1890ff", margin: "8px 0 0 0" }}>
                    {value}
                </Title>
            </Card>
        </Col>
    );
};

const ShipperHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await DashboardApi.getShipper();
            setStats(response?.data?.data);
            console.log(response?.data?.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const intervalId = setInterval(() => {
            fetchStats();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const statusConfig = [
        { key: "CANCELLED", label: "Đã hủy" },
        { key: "PICKUP_IN_PROGRESS", label: "Đang lấy hàng" },
        { key: "PICKUP_FAILED", label: "Lấy hàng thất bại" },
        { key: "PICKUP_SUCCESS", label: "Lấy hàng thành công" },
        { key: "IN_TRANSIT_TO_FROM_BRANCH", label: "Đang chuyển tới nơi lấy" },
        { key: "AT_FROM_BRANCH", label: "Đến nơi lấy hàng" },
        { key: "IN_TRANSIT_TO_TO_BRANCH", label: "Đang chuyển tới nơi giao" },
        { key: "AT_TO_BRANCH", label: "Đến nơi giao hàng" },
        { key: "DELIVERY_IN_PROGRESS", label: "Đang giao hàng" },
        { key: "DELIVERY_FAILED", label: "Giao thất bại" },
        { key: "DELIVERED", label: "Giao thành công" },
        { key: "RETURNED", label: "Đã trả" },
    ];

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={4} style={{ backgroundColor: "#1890ff", color: "#fff", textAlign: "center", padding: "8px 0" }}>
                Đơn hàng
            </Title>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {statusConfig.map(({ key, label }) => (
                    <StatCard key={key} title={label} value={stats[key] || 0} status={key} />
                ))}
            </Row>
        </div>
    );
};

export default ShipperHomePage;
