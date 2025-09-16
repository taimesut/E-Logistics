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

const ManagerLayout = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    document.title = "Trang Quản Lý";

    const menuItems = [
        {
            key: "/manager",
            icon: <HomeOutlined />,
            label: <Link to="/manager">Home</Link>
        },
        {
            key: "/manager/parcel",
            icon: <BoxPlotFilled />,
            label: <Link to="/manager/parcel">Quản lý đơn hàng</Link>
        },
        {
            key: "/manager/profile",
            icon: <UserOutlined />,
            label: <Link to="/manager/profile">Thông tin đăng nhập</Link>
        },
        {
            key: "/manager/stats",
            icon: <BarChartOutlined />,
            label: <Link to="/manager/stats">Thống kê</Link>
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

export default ManagerLayout;
