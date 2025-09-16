import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PublicApi from "../../public/PublicApi.js";
import Spinner from "../../../componets/Spinner.jsx";
import FormAddress from "../../../componets/FormAddress.jsx";
import MyApi from "../../../services/MyApi.js";
import { Card, Form, Input, InputNumber, Checkbox, Row, Col, Button, Select, List, Avatar, Space } from "antd";

const { Option } = Select;

const CustomerParcelCreate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const { state } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const [formValues, setFormValues] = useState({
        fromName: "",
        fromPhone: "",
        fromStreet: "",
        fromWard: "",
        fromDistrict: "",
        fromProvince: "",
        toName: "",
        toPhone: "",
        toStreet: "",
        toWard: "",
        toDistrict: "",
        toProvince: "",
        weight: 0.1,
        length: 1,
        width: 1,
        height: 1,
        products: [],
    });

    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [productsSend, setProductsSend] = useState([]);
    const [checkFeeData, setCheckFeeData] = useState({ shippingFee: 0, weightChargeable: 0 });
    const [minWeightSet, setMinWeightSet] = useState(0);

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await MyApi.getProducts();
                setProducts(res.data.data.data || []);
            } catch (err) {
                console.error("Lỗi lấy sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleFormChange = (name, value) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (value) => {
        setSelectedProducts(value);
    };

    const handleInputLimit = (value, min = 0, max = 50) => {
        if (value > max) return max;
        if (value < min) return min;
        return value;
    };

    const fetchCheckFee = useCallback(async () => {
        try {
            const data = {
                weight: formValues.weight,
                length: formValues.length,
                width: formValues.width,
                height: formValues.height,
                fromProvince: formValues.fromProvince,
                toProvince: formValues.toProvince,
            };
            const response = await PublicApi.check(data);
            setCheckFeeData(response.data.data);
        } catch (err) {
            console.error(err?.response?.data?.message || "Lỗi không xác định");
        }
    }, [
        formValues.weight,
        formValues.length,
        formValues.width,
        formValues.height,
        formValues.fromProvince,
        formValues.toProvince,
    ]);

    useEffect(() => {
        fetchCheckFee();
    }, [fetchCheckFee]);

    useEffect(() => {
        const totalWeight = productsSend.reduce((total, ps) => {
            const product = products.find((p) => p.id === ps.productId);
            return product ? total + parseFloat(product.weight) * ps.quantity : total;
        }, 0);
        setMinWeightSet(totalWeight);
        setFormValues((prev) => ({ ...prev, weight: parseFloat(totalWeight.toFixed(1)) }));
    }, [productsSend, products, selectedProducts]);

    const handleFormSubmit = async () => {
        let payload = { ...formValues };
        if (isAddressSaved) {
            if (!state.user.province) {
                toast.error("Vui lòng cập nhật thông tin đăng nhập");
                setIsAddressSaved(false);
                return;
            }
            payload = {
                ...payload,
                fromStreet: state.user.address,
                fromWard: state.user.ward,
                fromDistrict: state.user.district,
                fromProvince: state.user.province,
                fromName: state.user.fullName,
                fromPhone: state.user.phone,
            };
        }
        if (productsSend.length > 0) {
            payload.products = productsSend;
        } else {
            toast.error("Vui lòng chọn 1 sản phẩm");
            return;
        }

        try {
            setIsLoading(true);
            await MyApi.createParcel(payload);
            toast.success("Tạo thành công");
            setFormValues({
                fromName: "",
                fromPhone: "",
                fromStreet: "",
                fromWard: "",
                fromDistrict: "",
                fromProvince: "",
                toName: "",
                toPhone: "",
                toStreet: "",
                toWard: "",
                toDistrict: "",
                toProvince: "",
                weight: 0.1,
                length: 1,
                width: 1,
                height: 1,
                products: [],
            });
            setSelectedProducts([]);
            setProductsSend([]);
        } catch (err) {
            console.error(err?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <Card className="bg-light" title="Tạo đơn hàng">
            <Form layout="vertical" onFinish={handleFormSubmit}>
                <Row gutter={16}>
                    {/* Người gửi */}
                    <Col md={12}>
                        <Card type="inner" title="Thông tin người gửi">
                            <Form.Item>
                                <Checkbox checked={isAddressSaved} onChange={(e) => setIsAddressSaved(e.target.checked)}>
                                    Dùng thông tin đã lưu
                                </Checkbox>
                            </Form.Item>
                            {!isAddressSaved && (
                                <>
                                    <Form.Item label="Họ tên người gửi" required>
                                        <Input
                                            placeholder="Nguyễn Văn A"
                                            value={formValues.fromName}
                                            onChange={(e) => handleFormChange("fromName", e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Số điện thoại người gửi" required>
                                        <Input
                                            placeholder="0123456789"
                                            value={formValues.fromPhone}
                                            onChange={(e) => handleFormChange("fromPhone", e.target.value)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Địa chỉ cụ thể" required>
                                        <Input
                                            placeholder="123 đường ABC..."
                                            value={formValues.fromStreet}
                                            onChange={(e) => handleFormChange("fromStreet", e.target.value)}
                                        />
                                    </Form.Item>
                                    <FormAddress
                                        value={{
                                            ward: formValues.fromWard,
                                            district: formValues.fromDistrict,
                                            province: formValues.fromProvince,
                                        }}
                                        setValue={(val) =>
                                            setFormValues((prev) => ({
                                                ...prev,
                                                fromWard: val.ward,
                                                fromDistrict: val.district,
                                                fromProvince: val.province,
                                            }))
                                        }
                                    />
                                </>
                            )}
                        </Card>
                    </Col>

                    {/* Người nhận */}
                    <Col md={12}>
                        <Card type="inner" title="Thông tin người nhận">
                            <Form.Item label="Họ tên người nhận" required>
                                <Input
                                    placeholder="Nguyễn Văn B"
                                    value={formValues.toName}
                                    onChange={(e) => handleFormChange("toName", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Số điện thoại người nhận" required>
                                <Input
                                    placeholder="0123456789"
                                    value={formValues.toPhone}
                                    onChange={(e) => handleFormChange("toPhone", e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Địa chỉ cụ thể" required>
                                <Input
                                    placeholder="123 đường XYZ..."
                                    value={formValues.toStreet}
                                    onChange={(e) => handleFormChange("toStreet", e.target.value)}
                                />
                            </Form.Item>
                            <FormAddress
                                value={{
                                    ward: formValues.toWard,
                                    district: formValues.toDistrict,
                                    province: formValues.toProvince,
                                }}
                                setValue={(val) =>
                                    setFormValues((prev) => ({
                                        ...prev,
                                        toWard: val.ward,
                                        toDistrict: val.district,
                                        toProvince: val.province,
                                    }))
                                }
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 16 }}>
                    {/* Sản phẩm */}
                    <Col md={12}>
                        <Card type="inner" title="Sản phẩm">
                            <Button block type="dashed" onClick={() => navigate("/customer/create-product")}>
                                + Thêm sản phẩm
                            </Button>

                            <Form.Item label="Tìm kiếm sản phẩm">
                                <Input placeholder="Nhập tên sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </Form.Item>

                            <Form.Item label="Chọn sản phẩm">
                                <Select mode="multiple" value={selectedProducts} onChange={handleProductChange} style={{ width: "100%" }}>
                                    {products
                                        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((p) => (
                                            <Option key={p.id} value={p.id}>
                                                {p.name} - SL: {p.quantity}
                                            </Option>
                                        ))}
                                </Select>
                            </Form.Item>

                            {selectedProducts.length > 0 && (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={selectedProducts}
                                    renderItem={(id) => {
                                        const p = products.find((item) => item.id.toString() === id.toString());
                                        return (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={p.image} />}
                                                    title={p.name}
                                                    description={`Tồn: ${p.quantity}`}
                                                />
                                                <InputNumber
                                                    min={1}
                                                    max={p.quantity}
                                                    defaultValue={1}
                                                    onChange={(value) => {
                                                        let val = handleInputLimit(value, 1, p.quantity);
                                                        setProductsSend((prev) => {
                                                            const exists = prev.find((item) => item.productId === p.id);
                                                            if (exists) {
                                                                return prev.map((item) => (item.productId === p.id ? { ...item, quantity: val } : item));
                                                            }
                                                            return [...prev, { productId: p.id, quantity: val, price: p.price }];
                                                        });
                                                    }}
                                                />
                                            </List.Item>
                                        );
                                    }}
                                />
                            )}
                        </Card>
                    </Col>

                    {/* Kiện hàng */}
                    <Col md={12}>
                        <Card type="inner" title="Thông tin kiện hàng">
                            <Row gutter={8}>
                                <Col span={6}>
                                    <Form.Item label="Khối lượng (kg)" required>
                                        <InputNumber
                                            min={minWeightSet}
                                            max={minWeightSet + 50}
                                            step={0.1}
                                            value={formValues.weight}
                                            onChange={(value) => handleFormChange("weight", handleInputLimit(value, minWeightSet, minWeightSet + 50))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Chiều dài (cm)" required>
                                        <InputNumber
                                            min={1}
                                            max={150}
                                            step={1}
                                            value={formValues.length}
                                            onChange={(value) => handleFormChange("length", handleInputLimit(value, 1, 150))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Chiều rộng (cm)" required>
                                        <InputNumber
                                            min={1}
                                            max={150}
                                            step={1}
                                            value={formValues.width}
                                            onChange={(value) => handleFormChange("width", handleInputLimit(value, 1, 150))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label="Chiều cao (cm)" required>
                                        <InputNumber
                                            min={1}
                                            max={150}
                                            step={1}
                                            value={formValues.height}
                                            onChange={(value) => handleFormChange("height", handleInputLimit(value, 1, 150))}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Card type="inner" title="Ước tính chi phí">
                                <Space direction="vertical">
                                    <span>Khối lượng tính phí: {checkFeeData.weightChargeable} kg</span>
                                    <span>Tổng chi phí: {checkFeeData.shippingFee.toLocaleString()} đ</span>
                                </Space>
                            </Card>
                        </Card>
                    </Col>
                </Row>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" block>
                        Tạo đơn hàng
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CustomerParcelCreate;
