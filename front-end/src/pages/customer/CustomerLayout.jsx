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

const CustomerLayout = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    document.title = "Trang Khách Hàng";

    const menuItems = [
        {
            key: "/customer",
            icon: <HomeOutlined />,
            label: <Link to="/customer">Home</Link>
        },
        {
            key: "/customer/parcel",
            icon: <BoxPlotFilled />,
            label: <Link to="/customer/parcel">Quản lý đơn hàng</Link>
        },
        {
            key: "/customer/tracking",
            icon: <EnvironmentOutlined />,
            label: <Link to="/customer/tracking">Tracking</Link>
        },
        {
            key: "/customer/profile",
            icon: <UserOutlined />,
            label: <Link to="/customer/profile">Thông tin đăng nhập</Link>
        },
        {
            key: "/customer/product",
            icon: <AppstoreFilled />,
            label: <Link to="/customer/product">Quản lý sản phẩm</Link>
        },
        {
            key: "/customer/stats",
            icon: <BarChartOutlined />,
            label: <Link to="/customer/stats">Thống kê</Link>
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

export default CustomerLayout;
