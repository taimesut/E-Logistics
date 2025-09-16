import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import PublicApi from "../../public/PublicApi.js";
import MyApi from "../../../services/MyApi.js";
import { toast } from "react-toastify";
import { Card, Row, Col, Table, Image, List, Button, Spin, Tag } from "antd";

const CustomerParcelDetail = () => {
    const { id } = useParams();
    const [parcel, setParcel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [shipperPickup, setShipperPickup] = useState(null);
    const [shipperDelivery, setShipperDelivery] = useState(null);
    const [tracking, setTracking] = useState([]);
    const [imagesParcel, setImagesParcel] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await MyApi.getParcelById(id);
            setParcel(res.data.data);

            if (res.data.data?.pickupShipperId) {
                const pickup = await MyApi.getShipper(res.data.data.pickupShipperId);
                setShipperPickup(pickup.data.data);
            }
            if (res.data.data?.deliveryShipperId) {
                const delivery = await MyApi.getShipper(res.data.data.deliveryShipperId);
                setShipperDelivery(delivery.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTracking = async () => {
        try {
            const res = await PublicApi.tracking(id);
            setTracking(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchImagesParcel = async () => {
        try {
            const res = await PublicApi.getImagesParcel(id);
            setImagesParcel(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await MyApi.getProductsInParcel(id);
            setProducts(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        fetchTracking();
        fetchImagesParcel();
        fetchProducts();
    }, [id]);

    const handleUpdateStatus = async (status) => {
        try {
            setIsLoading(true);
            const response = await MyApi.updateStatusParcel(id, status);
            setParcel(response.data.data);
            fetchTracking();
            toast.success("Hủy đơn hàng thành công");
        } catch (err) {
            console.error(err);
            toast.error("Hủy đơn hàng thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Spin tip="Đang tải..." size="large" style={{ display: 'block', marginTop: 50 }} />;
    if (!parcel) return <p className="text-center">Không tìm thấy đơn hàng</p>;

    const productColumns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (url) => <Image width={60} src={url} />
        },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá (đ)', dataIndex: 'price', key: 'price', render: (price) => price.toLocaleString("vi-VN") },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Tổng (đ)',
            key: 'total',
            render: (_, record) => (record.price * record.quantity).toLocaleString("vi-VN")
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>← Quay lại</Button>

            <h3 style={{ textAlign: 'center', marginBottom: 24 }}>Chi tiết đơn hàng</h3>

            <Row gutter={[16, 16]}>
                {/* Hang 1 */}
                <Col md={12}>
                    <Card title={`Mã Tracking: ${parcel.id}`} bordered={false}>
                        <p><strong>Trạng thái:</strong> <Tag color="blue">{parcel.status}</Tag></p>
                        <p><strong>Ngày cập nhật:</strong> {new Date(parcel.updateAt).toLocaleString("vi-VN")}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(parcel.createdAt).toLocaleString("vi-VN")}</p>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="Thông tin gói hàng" bordered={false}>
                        <p><strong>Kích thước:</strong> {parcel.length} x {parcel.width} x {parcel.height}</p>
                        <p><strong>Khối lượng:</strong> {parcel.weight} kg</p>
                        <p><strong>Khối lượng tính:</strong> {parcel.weightChargeable} kg</p>
                        <p><strong>Phí vận chuyển:</strong> {parcel.shippingFee.toLocaleString("vi-VN")} đ</p>
                    </Card>
                </Col>

                {/* Hang 2 */}
                <Col md={12}>
                    <Card title="Người nhận" bordered={false}>
                        <p><strong>Tên:</strong> {parcel.toName}</p>
                        <p><strong>SĐT:</strong> {parcel.toPhone}</p>
                        <p><strong>Địa chỉ:</strong> {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict}, {parcel.toProvince}</p>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="Người gửi" bordered={false}>
                        <p><strong>Tên:</strong> {parcel.fromName}</p>
                        <p><strong>SĐT:</strong> {parcel.fromPhone}</p>
                        <p><strong>Địa chỉ:</strong> {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict}, {parcel.fromProvince}</p>
                    </Card>
                </Col>

                {/* Hang 3 */}
                <Col md={12}>
                    <Card title="Shipper lấy hàng" bordered={false}>
                        {shipperPickup ? (
                            <>
                                <p><strong>Tên:</strong> {shipperPickup.fullName}</p>
                                <p><strong>SĐT:</strong> {shipperPickup.phone}</p>
                            </>
                        ) : <p>Chưa có</p>}
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="Shipper giao hàng" bordered={false}>
                        {shipperDelivery ? (
                            <>
                                <p><strong>Tên:</strong> {shipperDelivery.fullName}</p>
                                <p><strong>SĐT:</strong> {shipperDelivery.phone}</p>
                            </>
                        ) : <p>Chưa có</p>}
                    </Card>
                </Col>

                {/* Hang 4 */}
                <Col span={24}>
                    <Card title="Thông tin sản phẩm" bordered={false}>
                        {products.length > 0 ? (
                            <Table
                                dataSource={products}
                                columns={productColumns}
                                rowKey="id"
                                pagination={false}
                            />
                        ) : <p>Chưa có sản phẩm nào trong đơn hàng</p>}
                    </Card>
                </Col>

                {/* Hang 5 */}
                {imagesParcel.length > 0 && (
                    <Col span={24}>
                        <Card title="Ảnh đơn hàng" bordered={false}>
                            {imagesParcel.filter(img => img.type === "PICKUP").length > 0 && (
                                <>
                                    <h6>Ảnh lấy hàng</h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                                        {imagesParcel.filter(img => img.type === "PICKUP").map(img => (
                                            <Image key={img.id} width={120} src={img.url} />
                                        ))}
                                    </div>
                                </>
                            )}
                            {imagesParcel.filter(img => img.type === "DELIVERY").length > 0 && (
                                <>
                                    <h6>Ảnh giao hàng</h6>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                        {imagesParcel.filter(img => img.type === "DELIVERY").map(img => (
                                            <Image key={img.id} width={120} src={img.url} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </Card>
                    </Col>
                )}

                {/* Hang 6 */}
                <Col span={24}>
                    <Card title="Tracking" bordered={false}>
                        <List
                            dataSource={tracking}
                            renderItem={item => (
                                <List.Item
                                    key={item.id}
                                    actions={[<Tag color="blue">{new Date(item.updateAt).toLocaleString("vi-VN")}</Tag>]}
                                >
                                    <List.Item.Meta
                                        title={<strong>{item.description}</strong>}
                                        description={`Trạng thái: ${item.status}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {parcel.status === "PICKUP_IN_PROGRESS" && (
                    <Col span={24}>
                        <Button type="primary" danger onClick={() => handleUpdateStatus("CANCELLED")}>
                            Hủy đơn hàng
                        </Button>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default CustomerParcelDetail;
