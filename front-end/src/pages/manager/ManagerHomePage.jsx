import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Spin } from "antd";
import DashboardApi from "../../services/DashboardApi.js";

const { Title, Text } = Typography;

const StatCard = ({ title, value, status }) => {
    const navigate = useNavigate();

    return (
        <Col xs={24} sm={12} md={8} lg={6} style={{ marginBottom: 16 }}>
            <Card
                hoverable
                bordered
                onClick={() => navigate(`/manager/parcel?status=${status}`)}
                style={{ textAlign: "center" }}
            >
                <Text type="secondary">{title}</Text>
                <Title level={3} style={{ color: "#1890ff", marginTop: 8 }}>
                    {value}
                </Title>
            </Card>
        </Col>
    );
};

const ManagerHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchStatsFrom = async () => {
        try {
            setIsLoading(true);
            const response = await DashboardApi.getManager();
            setStats(response?.data?.data);
            console.log(response?.data?.data);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatsFrom();

        const intervalId = setInterval(() => {
            fetchStatsFrom();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

    const statusConfig = [
        { key: "CREATED", label: "Mới tạo" },
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
            <Spin
                tip="Đang tải..."
                size="large"
                style={{ display: "block", marginTop: 50 }}
            />
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            <Title
                level={4}
                style={{
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    textAlign: "center",
                    padding: "8px 0",
                    marginBottom: 24,
                }}
            >
                Đơn hàng
            </Title>
            <Row gutter={[16, 16]}>
                {statusConfig.map(({ key, label }) => (
                    <StatCard
                        key={key}
                        title={label}
                        value={stats[key] || 0}
                        status={key}
                    />
                ))}
            </Row>
        </div>
    );
};

export default ManagerHomePage;
