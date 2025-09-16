import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Card, Row, Col, Table, Image, List, Button, Spin, Tag, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import MyApi from "../../../services/MyApi.js";
import { AuthContext } from "../../../contexts/auth/AuthContext.jsx";

const ShipperParcelDetail = () => {
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
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const failedCountPickup = tracking.filter(item => item.status === "PICKUP_FAILED").length;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await MyApi.getParcel(id);
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

    const handleFilesChange = ({ fileList }) => {
        const selectedFiles = fileList.map(f => f.originFileObj);
        if (selectedFiles.length > 3) {
            toast.error("Chỉ được upload tối đa 3 ảnh");
            return;
        }
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
    };

    const handleUpload = async (type) => {
        if (!files.length) {
            toast.error("Vui lòng chọn file để upload");
            return;
        }
        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("parcelId", id);
        formData.append("type", type);

        try {
            setIsLoading(true);
            await MyApi.uploadImages(formData);
            setFiles([]);
            setPreviews([]);
            await fetchImagesParcel();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            setIsLoading(true);
            if ((status === "PICKUP_SUCCESS" || status === "DELIVERED") && files.length <= 0) {
                toast.error("Chọn ảnh trước khi thực hiện thao tác");
                return;
            }
            if (status === "PICKUP_SUCCESS") await handleUpload("PICKUP");
            if (status === "DELIVERED") await handleUpload("DELIVERY");

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
    };

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
                {/* Parcel Info */}
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

                        {(parcel.status === "PICKUP_IN_PROGRESS" || parcel.status === "DELIVERY_IN_PROGRESS") && (
                            <Upload
                                multiple
                                accept="image/*"
                                fileList={files.map((f, idx) => ({ uid: idx, name: f.name, status: 'done', url: previews[idx] }))}
                                beforeUpload={() => false}
                                onChange={handleFilesChange}
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Chọn ảnh (max 3)</Button>
                            </Upload>
                        )}
                    </Card>
                </Col>

                {/* Receiver & Sender */}
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

                {/* Shippers */}
                <Col md={12}>
                    <Card title="Shipper lấy hàng" bordered={false}>
                        {shipperPickup ? (
                            <>
                                <p><strong>Tên:</strong> {shipperPickup.fullName}</p>
                                <p><strong>SĐT:</strong> {shipperPickup.phone}</p>
                            </>
                        ) : <p>Chưa có shipper</p>}
                    </Card>
                </Col>
                <Col md={12}>
                    <Card title="Shipper giao hàng" bordered={false}>
                        {shipperDelivery ? (
                            <>
                                <p><strong>Tên:</strong> {shipperDelivery.fullName}</p>
                                <p><strong>SĐT:</strong> {shipperDelivery.phone}</p>
                            </>
                        ) : <p>Chưa có shipper</p>}
                    </Card>
                </Col>

                {/* Products */}
                <Col span={24}>
                    <Card title="Thông tin sản phẩm" bordered={false}>
                        {products.length > 0 ? (
                            <Table dataSource={products} columns={productColumns} rowKey="id" pagination={false} />
                        ) : <p>Chưa có sản phẩm nào trong đơn hàng</p>}
                    </Card>
                </Col>

                {/* Images */}
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

                {/* Tracking */}
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

                {/* Action Buttons */}
                <Col span={24}>
                    {parcel.status === "PICKUP_IN_PROGRESS" && state.user.id.toString() === parcel.pickupShipperId && (
                        <>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("PICKUP_SUCCESS")} style={{ marginBottom: 8 }}>Lấy thành công</Button>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("PICKUP_FAILED")} style={{ marginBottom: 8 }}>Lấy thất bại</Button>
                        </>
                    )}
                    {parcel.status === "PICKUP_FAILED" && state.user.id.toString() === parcel.pickupShipperId && (
                        <>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("PICKUP_IN_PROGRESS")} style={{ marginBottom: 8 }}>Lấy lại</Button>
                            {failedCountPickup >= 3 && (
                                <Button type={"primary"} block onClick={() => handleUpdateStatus("CANCELLED")} style={{ marginBottom: 8 }}>Hủy đơn</Button>
                            )}
                        </>
                    )}
                    {parcel.status === "PICKUP_SUCCESS" && state.user.id.toString() === parcel.pickupShipperId && (
                        <Button type={"primary"} block onClick={() => handleUpdateStatus("IN_TRANSIT_TO_FROM_BRANCH")} style={{ marginBottom: 8 }}>Vận chuyển tới nơi lấy hàng</Button>
                    )}
                    {parcel.status === "DELIVERY_IN_PROGRESS" && state.user.id.toString() === parcel.deliveryShipperId && (
                        <>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("DELIVERED")} style={{ marginBottom: 8 }}>Giao thành công</Button>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("DELIVERY_FAILED")} style={{ marginBottom: 8 }}>Giao thất bại</Button>
                            <Button type={"primary"} block onClick={() => handleUpdateStatus("RETURNED")} style={{ marginBottom: 8 }}>Hoàn trả</Button>
                        </>
                    )}
                    {parcel.status === "DELIVERY_FAILED" && state.user.id.toString() === parcel.deliveryShipperId && (
                        <Button type={"primary"} block onClick={() => handleUpdateStatus("DELIVERY_IN_PROGRESS")} style={{ marginBottom: 8 }}>Giao lại</Button>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ShipperParcelDetail;
