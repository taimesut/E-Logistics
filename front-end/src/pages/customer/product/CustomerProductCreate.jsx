import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";
import { Card, Form, Input, InputNumber, Button, Upload } from "antd";
import { UploadOutlined, PlusCircleOutlined } from "@ant-design/icons";

const CustomerProductCreate = () => {
    const [product, setProduct] = useState({
        code: "",
        name: "",
        quantity: "",
        description: "",
        weight: "",
        price: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleChange = (name, value) => {
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = ({ file }) => {
        setFile(file.originFileObj || file);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
        if (file) {
            formData.append("file", file);
        }

        try {
            setIsLoading(true);
            await MyApi.createProduct(formData);
            toast.success("Tạo sản phẩm thành công");
            setProduct({ code: "", name: "", quantity: "", description: "", weight: "", price: "" });
            setFile(null);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Lỗi tạo sản phẩm");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <Card title="Thêm sản phẩm" style={{ maxWidth: 700, margin: "50px auto" }}>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Mã sản phẩm" required>
                    <Input
                        placeholder="Nhập mã sản phẩm"
                        value={product.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Tên sản phẩm" required>
                    <Input
                        placeholder="Nhập tên sản phẩm"
                        value={product.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Số lượng" required>
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Nhập số lượng"
                        value={product.quantity}
                        onChange={(value) => handleChange("quantity", value)}
                    />
                </Form.Item>

                <Form.Item label="Trọng lượng (kg)">
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Nhập trọng lượng (ví dụ: 1)"
                        value={product.weight}
                        onChange={(value) => handleChange("weight", value)}
                    />
                </Form.Item>

                <Form.Item label="Giá (VNĐ)" required>
                    <InputNumber
                        min={0}
                        style={{ width: "100%" }}
                        placeholder="Nhập giá"
                        value={product.price}
                        onChange={(value) => handleChange("price", value)}
                    />
                </Form.Item>

                <Form.Item label="Mô tả">
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả sản phẩm"
                        value={product.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Ảnh sản phẩm" required>
                    <Upload
                        beforeUpload={() => false} // prevent auto upload
                        onChange={handleFileChange}
                        accept="image/*"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<PlusCircleOutlined />} block size="large">
                        Tạo sản phẩm
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CustomerProductCreate;
