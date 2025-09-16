import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Table, Image, List, Button, Spin, Tag, Select } from "antd";
import { toast } from "react-toastify";
import MyApi from "../../../services/MyApi.js";
import { AuthContext } from "../../../contexts/auth/AuthContext.jsx";

const { Option } = Select;

const ManagerParcelDetail = () => {
    const { state } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [parcel, setParcel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [shipperPickup, setShipperPickup] = useState(null);
    const [shipperDelivery, setShipperDelivery] = useState(null);
    const [tracking, setTracking] = useState([]);
    const [imagesParcel, setImagesParcel] = useState([]);
    const [products, setProducts] = useState([]);
    const [pickupShippers, setPickupShippers] = useState([]);
    const [deliveryShippers, setDeliveryShippers] = useState([]);
    const [selectedShipperId, setSelectedShipperId] = useState("");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await MyApi.getParcel(id);
            setParcel(res.data.data);

            if (res.data.data?.pickupShipperId) {
                const pickup = await MyApi.getShipper(res.data.data.pickupShipperId);
                setShipperPickup(pickup.data.data);
            } else {
                const resPickup = await MyApi.getShippers();
                setPickupShippers(resPickup.data.data);
            }

            if (res.data.data?.deliveryShipperId) {
                const delivery = await MyApi.getShipper(res.data.data.deliveryShipperId);
                setShipperDelivery(delivery.data.data);
            } else {
                const resDelivery = await MyApi.getShippers();
                setDeliveryShippers(resDelivery.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTracking = async () => {
        try {
            const res = await MyApi.tracking(id);
            setTracking(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchImagesParcel = async () => {
        try {
            const res = await MyApi.getImagesForParcel(id);
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

    const handleAssignShipperPickup = async () => {
        if (!selectedShipperId) return toast.error("Vui lòng chọn shipper");
        try {
            setIsLoading(true);
            await MyApi.setShipperForParcel(id, selectedShipperId, "pickup");
            toast.success("Gán shipper lấy hàng thành công");
            setSelectedShipperId("");
            await fetchData();
            await fetchTracking();
        } catch (err) {
            console.error(err);
            toast.error("Gán shipper lấy hàng thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignShipperDelivery = async () => {
        if (!selectedShipperId) return toast.error("Vui lòng chọn shipper");
        try {
            setIsLoading(true);
            await MyApi.setShipperForParcel(id, selectedShipperId, "delivery");
            toast.success("Gán shipper giao hàng thành công");
            setSelectedShipperId("");
            await fetchData();
            await fetchTracking();
        } catch (err) {
            console.error(err);
            toast.error("Gán shipper giao hàng thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            setIsLoading(true);
            const response = await MyApi.updateStatusParcel(id, status);
            setParcel(response.data.data);
            await fetchTracking();
            toast.success("Cập nhật đơn hàng thành công");
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật đơn hàng thất bại");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        fetchTracking();
        fetchImagesParcel();
        fetchProducts();
    }, [id]);

    if (isLoading) return <Spin tip="Đang tải..." size="large" style={{ display: 'block', marginTop: 50 }} />;
    if (!parcel) return <p className="text-center">Không tìm thấy đơn hàng</p>;

    const productColumns = [
        { title: 'Ảnh', dataIndex: 'image', key: 'image', render: url => <Image width={60} src={url} /> },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
        { title: 'Giá (đ)', dataIndex: 'price', key: 'price', render: price => price.toLocaleString("vi-VN") },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Tổng (đ)', key: 'total', render: (_, record) => (record.price * record.quantity).toLocaleString("vi-VN") },
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
                        ) : (parcel.fromBranchId === state.user.branchWorkId && parcel.status==="CREATED") ? (
                            <>
                                <Select value={selectedShipperId} onChange={setSelectedShipperId} style={{ width: '100%', marginBottom: 8 }}>
                                    <Option value="">Chọn shipper</Option>
                                    {pickupShippers.map(s => (
                                        <Option key={s.id} value={s.id}>{s.fullName} - {s.phone}</Option>
                                    ))}
                                </Select>
                                <Button type="primary" block onClick={handleAssignShipperPickup}>Gán shipper lấy hàng</Button>
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
                        ) : (parcel.toBranchId === state.user.branchWorkId && parcel.status==="AT_TO_BRANCH" ) ? (
                            <>
                                <Select value={selectedShipperId} onChange={setSelectedShipperId} style={{ width: '100%', marginBottom: 8 }}>
                                    <Option value="">Chọn shipper</Option>
                                    {deliveryShippers.map(s => (
                                        <Option key={s.id} value={s.id}>{s.fullName} - {s.phone}</Option>
                                    ))}
                                </Select>
                                <Button type="primary" block onClick={handleAssignShipperDelivery}>Gán shipper giao hàng</Button>
                            </>
                        ) : <p>Chưa có</p>}
                    </Card>
                </Col>

                {/* Hang 4 */}
                <Col span={24}>
                    <Card title="Thông tin sản phẩm" bordered={false}>
                        {products.length > 0 ? (
                            <Table dataSource={products} columns={productColumns} rowKey="id" pagination={false} />
                        ) : <p>Chưa có sản phẩm nào trong đơn hàng</p>}
                    </Card>
                </Col>

                {/* Hang 5 */}
                {imagesParcel.length > 0 && (
                    <Col span={24}>
                        <Card title="Ảnh đơn hàng" bordered={false}>
                            {["PICKUP", "DELIVERY"].map(type => {
                                const imgs = imagesParcel.filter(img => img.type === type);
                                if (!imgs.length) return null;
                                return (
                                    <div key={type} style={{ marginBottom: 16 }}>
                                        <h6>{type === "PICKUP" ? "Ảnh lấy hàng" : "Ảnh giao hàng"}</h6>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                            {imgs.map(img => (
                                                <Image key={img.id} width={120} src={img.url} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </Card>
                    </Col>
                )}

                {/* Hang 6 */}
                <Col span={24}>
                    <Card title="Tracking" bordered={false}>
                        <List
                            dataSource={tracking}
                            renderItem={item => (
                                <List.Item key={item.id} actions={[<Tag color="blue">{new Date(item.updateAt).toLocaleString("vi-VN")}</Tag>]}>
                                    <List.Item.Meta
                                        title={<strong>{item.description}</strong>}
                                        description={`Trạng thái: ${item.status}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Buttons Status */}
                <Col span={24}>
                    {state.user?.branchWorkId?.toString() === parcel.fromBranchId && parcel.status === "IN_TRANSIT_TO_FROM_BRANCH" && (
                        <Button type="primary" block onClick={() => handleUpdateStatus("AT_FROM_BRANCH")}>Đã đến nơi lấy hàng</Button>
                    )}
                    {state.user?.branchWorkId?.toString() === parcel.fromBranchId && parcel.status === "AT_FROM_BRANCH" && (
                        <Button type="primary" block onClick={() => handleUpdateStatus("IN_TRANSIT_TO_TO_BRANCH")}>Vận chuyển tới nơi giao hàng</Button>
                    )}
                    {state.user?.branchWorkId?.toString() === parcel.toBranchId && parcel.status === "IN_TRANSIT_TO_TO_BRANCH" && (
                        <Button type="primary" block onClick={() => handleUpdateStatus("AT_TO_BRANCH")}>Đã đến nơi giao hàng</Button>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ManagerParcelDetail;
