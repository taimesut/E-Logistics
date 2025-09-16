import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin } from 'antd';
import PublicApi from "./PublicApi.js";

const { Title } = Typography;

const ShippingRulePage = () => {
    const [rules, setRules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await PublicApi.getShippingRule();
                setRules(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Trọng lượng (Kg)',
            dataIndex: 'weightRange',
            key: 'weightRange',
            render: (_, record, index) => {
                const isExtra = index === rules.length - 1;
                return isExtra
                    ? `Trên ${record.minWeight} kg, thêm mỗi kg`
                    : `${record.minWeight} - ${record.maxWeight} kg`;
            }
        },
        {
            title: 'Nội tỉnh (VNĐ)',
            dataIndex: 'noiTinh',
            key: 'noiTinh',
            render: (value) => value.toLocaleString() + ' ₫'
        },
        {
            title: 'Liên tỉnh (VNĐ)',
            dataIndex: 'lienTinh',
            key: 'lienTinh',
            render: (value) => value.toLocaleString() + ' ₫'
        }
    ];

    return (
        <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', background: '#f5f5f5' }}>
            <Card style={{ width: '100%', maxWidth: 800 }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Bảng Giá Vận Chuyển</Title>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={rules}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                )}
            </Card>
        </div>
    );
};

export default ShippingRulePage;
