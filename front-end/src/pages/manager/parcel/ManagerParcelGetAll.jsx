import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Table, Input, Select, Button, Space, Card, Row, Col, Spin, Typography, message } from "antd";
import MyApi from "../../../services/MyApi.js";
import GetStatusDescription from "../../../helpers/ConvertStatus.js";

const { Option } = Select;
const { Title } = Typography;

const ManagerParcelGetAll = () => {
    const [parcels, setParcels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await MyApi.getParcels(page, size, status, search);
            setParcels(response.data.data.data);
            setTotalPages(response.data.data.totalPages);
        } catch (err) {
            console.log(err);
            message.error("Lấy dữ liệu thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, status, size]);

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        const dt = new Date(dateTimeStr);
        return dt.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const columns = [
        { title: 'STT', render: (_, __, index) => index + 1, width: 60 },
        { title: 'Tracking', dataIndex: 'id', key: 'id' },
        {
            title: 'Người gửi',
            render: parcel => (
                <div>
                    <div><strong>Tên:</strong> {parcel.fromName}</div>
                    <div><strong>SĐT:</strong> {parcel.fromPhone}</div>
                    <div>
                        <strong>Địa chỉ:</strong> {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict}, {parcel.fromProvince}
                    </div>
                </div>
            )
        },
        {
            title: 'Người nhận',
            render: parcel => (
                <div>
                    <div><strong>Tên:</strong> {parcel.toName}</div>
                    <div><strong>SĐT:</strong> {parcel.toPhone}</div>
                    <div>
                        <strong>Địa chỉ:</strong> {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict}, {parcel.toProvince}
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => GetStatusDescription(status, "MANAGER")
        },
        {
            title: 'Cập nhật',
            dataIndex: 'updateAt',
            key: 'updateAt',
            render: date => formatDateTime(date)
        },
        {
            title: 'Hành động',
            render: parcel => (
                <Button type="primary" onClick={() => navigate(`/manager/parcel/${parcel.id}`)}>Xem</Button>
            )
        }
    ];

    return (
        <div>
            <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Danh sách đơn hàng</Title>

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={16} align="middle">
                    <Col flex="auto">
                        <Input
                            placeholder="🔍 Nhập tên, SĐT hoặc mã tracking"
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
                        <Select value={status} onChange={value => setStatus(value)} style={{ width: 180 }}>
                            <Option value="">-- Tất cả trạng thái --</Option>
                            <Option value="CREATED">Mới tạo</Option>
                            <Option value="CANCELLED">Đã hủy</Option>
                            <Option value="PICKUP_IN_PROGRESS">Đang lấy</Option>
                            <Option value="PICKUP_FAILED">Lấy thất bại</Option>
                            <Option value="PICKUP_SUCCESS">Lấy thành công</Option>
                            <Option value="IN_TRANSIT_TO_FROM_BRANCH">Đang chuyển tới nơi lấy</Option>
                            <Option value="AT_FROM_BRANCH">Đã tới nơi lấy</Option>
                            <Option value="IN_TRANSIT_TO_TO_BRANCH">Đang chuyển tới nơi giao</Option>
                            <Option value="AT_TO_BRANCH">Đã tới nơi giao</Option>
                            <Option value="DELIVERY_IN_PROGRESS">Đang giao</Option>
                            <Option value="DELIVERY_FAILED">Giao thất bại</Option>
                            <Option value="DELIVERED">Giao thành công</Option>
                            <Option value="RETURNED">Đã trả</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Space>
                            <Button type="primary" onClick={fetchData}>Tìm</Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {isLoading ? (
                <Spin tip="Đang tải dữ liệu..." size="large" style={{ display: "block", marginTop: 50 }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={parcels}
                    rowKey="id"
                    pagination={{
                        current: page + 1,
                        pageSize: size,
                        total: totalPages * size,
                        onChange: (pageNum) => setPage(pageNum - 1),
                        showSizeChanger: false
                    }}
                    bordered
                    scroll={{ x: 'max-content' }}
                />
            )}
        </div>
    );
};

export default ManagerParcelGetAll;
