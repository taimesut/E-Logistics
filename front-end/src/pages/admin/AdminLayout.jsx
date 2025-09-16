import React from 'react';
import {Link, Outlet, useLocation} from "react-router-dom";
import {Layout, Menu} from "antd";
import {
    HomeOutlined,
    BoxPlotFilled,
    EnvironmentOutlined,
    UserOutlined,
    AppstoreFilled,
    BarChartOutlined,
    LogoutOutlined
} from "@ant-design/icons";

const {Sider, Content} = Layout;

const AdminLayout = () => {
    const location = useLocation();
    const selectedKey = location.pathname;

    document.title = "Trang Shipper";

    const menuItems = [
        {
            key: "/admin",
            icon: <HomeOutlined/>,
            label: <Link to="/admin">Home</Link>
        },
        {
            key: "/admin/account",
            icon: <BoxPlotFilled/>,
            label: <Link to="/admin/account">Quản lý tài khoản</Link>
        },
        {
            key: "/admin/branch",
            icon: <BoxPlotFilled/>,
            label: <Link to="/admin/branch">Quản lý chi nhánh</Link>
        },
        {
            key: "/admin/stats",
            icon: <BarChartOutlined/>,
            label: <Link to="/admin/stats">Thống kê</Link>
        },
        {
            key: "/admin/profile",
            icon: <UserOutlined/>,
            label: <Link to="/admin/profile">Thông tin đăng nhập</Link>
        },
        {
            key: "/logout",
            icon: <LogoutOutlined/>,
            label: <Link to="/logout">Đăng xuất</Link>
        }
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider
                breakpoint="md"
                collapsedWidth="0"
                width={250}
                style={{background: "#fff"}}
            >
                <div style={{padding: "16px", textAlign: "center"}}>
                    <Link to="/customer">
                        <img src="/logo2.png" alt="Mesut Logistics" style={{maxHeight: "50px", width: "auto"}}/>
                    </Link>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    style={{borderRight: 0}}
                />
            </Sider>
            <Layout>
                <Content style={{padding: "24px"}}>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
