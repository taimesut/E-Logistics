import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, InputNumber, Button, Upload, Card, Row, Col, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import MyApi from "../../../services/MyApi.js";

const { TextArea } = Input;

const CustomerProductUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await MyApi.getProductById(id);
                setProduct(res.data.data);
                setFilePreview(res.data.data.image);
            } catch (err) {
                console.error(err);
                navigate("/customer/products");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        if (!product) return;

        const formData = new FormData();
        formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
        if (file) formData.append("file", file);

        try {
            const res = await MyApi.updateProduct(id, formData);
            setProduct(res.data.data);
            setFilePreview(res.data.data.image); // update preview từ backend sau khi upload
            toast.success("Cập nhật sản phẩm thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại!");
        }
    };

    if (loading) return <Spin tip="Đang tải sản phẩm..." size="large" style={{ display: 'block', marginTop: 50 }} />;

    if (!product) return null;

    return (
        <Card title="Chỉnh sửa sản phẩm" className="shadow-lg" style={{ maxWidth: 900, margin: "20px auto" }}>
            <Form
                layout="vertical"
                onFinish={handleUpdate}
                initialValues={{
                    code: product.code,
                    name: product.name,
                    quantity: product.quantity,
                    weight: product.weight,
                    price: product.price,
                    description: product.description,
                }}
            >
                <Row gutter={24}>
                    {/* Ảnh sản phẩm */}
                    <Col md={8} className="text-center">
                        <img
                            src={filePreview || product.image}
                            alt={product.name}
                            style={{
                                width: 250,
                                height: 250,
                                objectFit: "cover",
                                borderRadius: 12,
                                border: "1px solid #ddd",
                                marginBottom: 16,
                            }}
                        />
                        <Upload
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={(f) => {
                                setFile(f);
                                setFilePreview(URL.createObjectURL(f)); // set preview ngay lập tức
                                return false; // chặn upload tự động
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
                        </Upload>
                    </Col>

                    {/* Thông tin sản phẩm */}
                    <Col md={16}>
                        <Form.Item label="Mã sản phẩm" name="code" rules={[{ required: true }]}>
                            <Input name="code" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true }]}>
                            <Input name="name" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                name="quantity"
                                onChange={(value) => setProduct({ ...product, quantity: value })}
                            />
                        </Form.Item>
                        <Form.Item label="Trọng lượng" name="weight">
                            <Input name="weight" onChange={handleChange} />
                        </Form.Item>
                        <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                name="price"
                                onChange={(value) => setProduct({ ...product, price: value })}
                            />
                        </Form.Item>
                        <Form.Item label="Mô tả" name="description">
                            <TextArea
                                rows={3}
                                name="description"
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Buttons */}
                <Form.Item>
                    <Row justify="space-between">
                        <Button type="default" onClick={() => navigate("/customer/product")}>
                            Quay lại
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Cập nhật sản phẩm
                        </Button>
                    </Row>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CustomerProductUpdate;
