import React, { useState } from 'react';
import { Card, Input, Button, List, Badge, Typography, Space, Spin } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import PublicApi from "./PublicApi.js";
import {toast} from "react-toastify";

const { Title, Text } = Typography;

const TrackingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [codeTracking, setCodeTracking] = useState("");
    const [steps, setSteps] = useState([]);
    const [isFirst, setIsFirst] = useState(true);

    const handleTrackingClick = async (e) => {
        e.preventDefault();
        if (!codeTracking.trim()) return;

        try {
            setIsLoading(true);
            const response = await PublicApi.tracking(codeTracking.trim());
            if (response.status === 200 && response.data.success) {
                setSteps(response.data.data);
            } else {
                setSteps([]);
                toast.warning("Không tìm thấy dữ liệu cho mã tracking này");
            }
        } catch (err) {
            console.error(err);
            setSteps([]);
            toast.error("Lỗi khi tra cứu vận đơn");
        } finally {
            setIsLoading(false);
            setIsFirst(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", backgroundColor: "#f0f2f5" }}>
            <Card style={{ width: "100%", maxWidth: 480 }} bordered>
                <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>TRA CỨU VẬN ĐƠN</Title>

                <form onSubmit={handleTrackingClick}>
                    <Space style={{ width: "100%" }} size="middle">
                        <Input
                            placeholder="Nhập mã tracking"
                            value={codeTracking}
                            onChange={e => setCodeTracking(e.target.value)}
                            allowClear
                            style={{ flex: 1 }}
                        />
                        <Button type="primary" htmlType="submit">Tra cứu</Button>
                    </Space>
                </form>

                <div style={{ marginTop: 32 }}>
                    {isLoading ? (
                        <Spin tip="Đang tải dữ liệu..." style={{ display: "block", textAlign: "center", marginTop: 50 }} />
                    ) : (
                        <List
                            bordered
                            dataSource={steps}
                            locale={{ emptyText: !isFirst ? "Chưa có dữ liệu" : "" }}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        <Badge
                                            color={item.status === "DELIVERED" ? "green" : "blue"}
                                            text={new Date(item.updateAt).toLocaleString("vi-VN")}
                                            key={item.id}
                                        />
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={item.status === "DELIVERED" ? <CheckCircleOutlined style={{ fontSize: 20, color: "green" }} /> : <ClockCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
                                        title={<Text strong>{item.description}</Text>}
                                        description={<Text type="secondary">Trạng thái: {item.status}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TrackingPage;
