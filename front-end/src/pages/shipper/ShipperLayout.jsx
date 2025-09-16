import React from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
    HomeOutlined,
    BoxPlotFilled,
    EnvironmentOutlined,
    UserOutlined,
    AppstoreFilled,
    BarChartOutlined,
    LogoutOutlined
} from "@ant-design/icons";

const { Sider, Content } = Layout;

const ShipperLayout = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    document.title = "Trang Shipper";

    const menuItems = [
        {
            key: "/shipper",
            icon: <HomeOutlined />,
            label: <Link to="/shipper">Home</Link>
        },
        {
            key: "/shipper/parcel",
            icon: <BoxPlotFilled />,
            label: <Link to="/shipper/parcel">Quản lý đơn hàng</Link>
        },
        {
            key: "/shipper/stats",
            icon: <BarChartOutlined />,
            label: <Link to="/shipper/stats">Thống kê</Link>
        },
        {
            key: "/shipper/profile",
            icon: <UserOutlined />,
            label: <Link to="/shipper/profile">Thông tin đăng nhập</Link>
        },
        {
            key: "/logout",
            icon: <LogoutOutlined />,
            label: <Link to="/logout">Đăng xuất</Link>
        }
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                breakpoint="md"
                collapsedWidth="0"
                width={250}
                style={{ background: "#fff" }}
            >
                <div style={{ padding: "16px", textAlign: "center" }}>
                    <Link to="/customer">
                        <img src="/logo2.png" alt="Mesut Logistics" style={{ maxHeight: "50px", width: "auto" }} />
                    </Link>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: "24px" }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default ShipperLayout;
