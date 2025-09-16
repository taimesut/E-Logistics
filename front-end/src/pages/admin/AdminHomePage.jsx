import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Spin } from "antd";
import DashboardApi from "../../services/DashboardApi.js";

const { Title, Text } = Typography;

const StatCard = ({ title, value, link }) => {
    const navigate = useNavigate();

    return (
        <Col xs={24} sm={12} md={8} lg={6} style={{ marginBottom: 16 }}>
            <Card
                hoverable
                onClick={() => navigate(link)}
                bordered
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

const AdminHomePage = () => {
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await DashboardApi.getAdmin();
                setStats(res?.data?.data);
                console.log(res?.data?.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, []);

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
            {/* Tài khoản */}
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
                Tài khoản
            </Title>
            <Row gutter={[16, 16]}>
                <StatCard
                    title={"Shipper"}
                    value={stats.SHIPPER}
                    link={"/admin/account?role=ROLE_SHIPPER"}
                />
                <StatCard
                    title={"Quản lý"}
                    value={stats.MANAGER}
                    link={"/admin/account?role=ROLE_MANAGER"}
                />
                <StatCard
                    title={"Khách hàng"}
                    value={stats.CUSTOMER}
                    link={"/admin/account?role=ROLE_CUSTOMER"}
                />
            </Row>

            {/* Chi nhánh */}
            <Title
                level={4}
                style={{
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    textAlign: "center",
                    padding: "8px 0",
                    margin: "32px 0 24px",
                }}
            >
                Chi nhánh
            </Title>
            <Row gutter={[16, 16]}>
                <StatCard
                    title={"Hoạt động"}
                    value={stats.BRANCHES_ACTIVE}
                    link={"/admin/branch?status=ACTIVE"}
                />
                <StatCard
                    title={"Không hoạt động"}
                    value={stats.BRANCHES_INACTIVE}
                    link={"/admin/branch?status=INACTIVE"}
                />
            </Row>
        </div>
    );
};

export default AdminHomePage;
