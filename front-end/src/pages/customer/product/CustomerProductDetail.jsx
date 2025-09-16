import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Table, Image, Row, Col, Spin } from "antd";
import MyApi from "../../../services/MyApi.js";

const CustomerProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await MyApi.getProductById(id);
                setProduct(res.data.data);
            } catch (err) {
                console.error(err);
                navigate("/customer/products");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spin size="large" tip="Đang tải sản phẩm..." />
            </div>
        );
    if (!product) return null;

    const dataSource = [
        { key: "1", label: "Hình ảnh", value: <Image width={150} height={150} src={product.image || "/placeholder.png"} alt={product.name || "N/A"} style={{ objectFit: "cover", borderRadius: 8 }} /> },
        { key: "2", label: "Mã sản phẩm", value: product.code || "—" },
        { key: "3", label: "Tên sản phẩm", value: product.name || "—" },
        { key: "4", label: "Số lượng", value: product.quantity ?? "—" },
        { key: "5", label: "Trọng lượng", value: product.weight || "—" },
        { key: "6", label: "Giá", value: product.price ? product.price.toLocaleString("vi-VN") + " ₫" : "—" },
        { key: "7", label: "Quốc gia", value: product.country || "—" },
        { key: "8", label: "Mô tả", value: product.description || "—" },
        { key: "9", label: "Ngày tạo", value: product.createdAt ? new Date(product.createdAt).toLocaleString("vi-VN") : "—" },
        { key: "10", label: "Ngày cập nhật", value: product.updateAt ? new Date(product.updateAt).toLocaleString("vi-VN") : "—" },
    ];

    const columns = [
        { title: "Thuộc tính", dataIndex: "label", key: "label", width: 200 },
        { title: "Giá trị", dataIndex: "value", key: "value" },
    ];

    return (
        <div className="container-fluid py-5" style={{ minHeight: "100vh", background: "#f0f2f5" }}>
            <Card style={{ maxWidth: 900, margin: "0 auto" }}>
                <Row justify="start" className="mb-3">
                    <Button onClick={() => navigate(-1)}>← Quay lại</Button>
                </Row>

                <h3 className="text-center fw-bold mb-4">Chi tiết sản phẩm</h3>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered
                    rowKey="key"
                />
            </Card>
        </div>
    );
};

export default CustomerProductDetail;
