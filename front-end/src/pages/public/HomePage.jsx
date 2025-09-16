import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Card, Row, Col, Space } from "antd";
import { TruckOutlined, SearchOutlined, AppstoreOutlined, CustomerServiceOutlined, GlobalOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero Section */}
            <div style={{ backgroundColor: '#1890ff', color: '#fff', textAlign: 'center', padding: '80px 20px' }}>
                <Title style={{ color: '#fff', fontSize: '48px' }}>Mesut Logistics</Title>
                <Paragraph style={{ color: '#fff', fontSize: '18px', marginBottom: 32 }}>
                    Giải pháp giao hàng nhanh chóng, an toàn và tiện lợi cho bạn
                </Paragraph>
                <Space>
                    <Button type="default" size="large" onClick={() => navigate("/customer/create-parcel")}>
                        Tạo đơn ngay
                    </Button>
                    <Button type="primary" size="large" onClick={() => navigate("/tracking")}>
                        Tra cứu đơn hàng
                    </Button>
                </Space>
            </div>

            {/* Features Section */}
            <div style={{ backgroundColor: '#f0f2f5', padding: '60px 20px' }}>
                <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <TruckOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Giao hàng nhanh</Title>
                            <Paragraph>
                                Đảm bảo thời gian vận chuyển ngắn nhất với nhiều lựa chọn dịch vụ.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <SearchOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Theo dõi đơn hàng</Title>
                            <Paragraph>
                                Tra cứu trạng thái đơn hàng mọi lúc, mọi nơi trên hệ thống.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <AppstoreOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Quản lý kho</Title>
                            <Paragraph>
                                Tích hợp quản lý tồn kho và vận chuyển hiệu quả cho doanh nghiệp.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Why Choose Us Section */}
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <Title level={2} style={{ marginBottom: 48 }}>Tại sao chọn chúng tôi?</Title>
                <Row gutter={[24, 24]} justify="center">
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <CustomerServiceOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Hỗ trợ 24/7</Title>
                            <Paragraph>
                                Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <GlobalOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Mạng lưới rộng khắp</Title>
                            <Paragraph>
                                Phủ sóng giao hàng toàn quốc và quốc tế.
                            </Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card hoverable style={{ textAlign: 'center' }}>
                            <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                            <Title level={4}>Đảm bảo an toàn</Title>
                            <Paragraph>
                                Cam kết an toàn hàng hóa với chính sách bồi thường rõ ràng.
                            </Paragraph>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HomePage;
