import React, { useContext } from 'react';
import { Outlet, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth/AuthContext.jsx";
import { Layout, Menu, Button, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const PublicLayout = () => {
    document.title = "Trang chủ";
    const { state } = useContext(AuthContext);

    const menuItems = [
        { key: 'home', label: <Link to="/">Trang chủ</Link> },
        { key: 'tracking', label: <Link to="/tracking">Tra cứu đơn</Link> },
        { key: 'check-fee', label: <Link to="/check-fee">Tra giá</Link> },
        { key: 'shipping-rule', label: <Link to="/shipping-rule">Bảng giá cước</Link> },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: '0 24px', boxShadow: '0 2px 8px #f0f1f2' }}>
                <div className="logo">
                    <Link to="/">
                        <img src="/logo2.png" alt="Mesut Logistics" height={50} />
                    </Link>
                </div>
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{ flex: 1, marginLeft: 40 }}
                />
                <div>
                    {state.isAuthenticated ? (
                        <>
                            {state.user?.role === "ROLE_ADMIN" && <Link to="/admin"><Button type="link">Dashboard</Button></Link>}
                            {state.user?.role === "ROLE_CUSTOMER" && <Link to="/customer"><Button type="link">Dashboard</Button></Link>}
                            {state.user?.role === "ROLE_SHIPPER" && <Link to="/shipper"><Button type="link">Dashboard</Button></Link>}
                            {state.user?.role === "ROLE_MANAGER" && <Link to="/manager"><Button type="link">Dashboard</Button></Link>}
                            <Link to="/logout"><Button danger type="default">Đăng xuất</Button></Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login"><Button type="default" style={{ marginRight: 8 }}>Đăng nhập</Button></Link>
                            <Link to="/register"><Button type="primary">Đăng ký</Button></Link>
                        </>
                    )}
                </div>
            </Header>

            <Content style={{ padding: '24px', backgroundColor: '#f0f2f5', flex: 1 }}>
                <Outlet />
            </Content>

            <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
                <Title level={5} style={{ color: '#fff', marginBottom: 4 }}>&copy; 2025 Mesut Logistics. All rights reserved.</Title>
                <p style={{ margin: 0 }}>Liên hệ: contact@mesutelogistics.vn | 0328-805-839</p>
            </Footer>
        </Layout>
    );
};

export default PublicLayout;
