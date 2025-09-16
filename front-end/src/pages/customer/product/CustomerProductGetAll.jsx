import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Input, Button, Select, Space, Image, Popconfirm, Card, Row, Col, Spin, Typography, message } from "antd";
import MyApi from "../../../services/MyApi.js";

const { Option } = Select;
const { Title } = Typography;

const CustomerProductGetAll = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await MyApi.getProducts(page, size, search);
            setProducts(res.data.data.data);
            setTotalPages(res.data.data.totalPages);
        } catch (e) {
            console.error(e);
            message.error("Lấy dữ liệu thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, size]);

    const deleteProduct = async (id) => {
        try {
            await MyApi.deleteProduct(id);
            message.success("Xóa sản phẩm thành công");
            fetchData();
        } catch (e) {
            console.error(e);
            message.error("Xảy ra lỗi khi xóa sản phẩm");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            render: (_, record) => (
                <Image
                    src={record.image || "/placeholder.png"}
                    alt={record.name}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                />
            ),
        },
        { title: "Mã SP", dataIndex: "code", key: "code" },
        { title: "Tên SP", dataIndex: "name", key: "name" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        { title: "Trọng lượng", dataIndex: "weight", key: "weight", render: (w) => w + " kg" },
        { title: "Giá", dataIndex: "price", key: "price", render: (p) => p.toLocaleString() + " đ" },
        { title: "Mô tả", dataIndex: "description", key: "description" },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => navigate(`/customer/product/${record.id}`)}>Xem</Button>
                    <Button size="default" onClick={() => navigate(`/customer/product/edit/${record.id}`)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => deleteProduct(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button type="primary" danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Danh sách sản phẩm</Title>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Input
                            placeholder="🔍 Nhập tên hoặc mã sản phẩm"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col>
                        <Select value={size} onChange={value => setSize(value)} style={{ width: 140 }}>
                            <Option value={5}>5 / trang</Option>
                            <Option value={10}>10 / trang</Option>
                            <Option value={20}>20 / trang</Option>
                            <Option value={50}>50 / trang</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Space>
                            <Button type="primary" onClick={fetchData}>Tìm</Button>
                            <Button type="primary" onClick={() => navigate('/customer/create-product')}>+ Thêm sản phẩm</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {isLoading ? (
                <Spin tip="Đang tải dữ liệu..." size="large" style={{ display: "block", marginTop: 50 }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                        current: page + 1,
                        pageSize: size,
                        total: totalPages * size,
                        onChange: (pageNum) => setPage(pageNum - 1),
                        showSizeChanger: false,
                    }}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            )}
        </div>
    );
};

export default CustomerProductGetAll;
