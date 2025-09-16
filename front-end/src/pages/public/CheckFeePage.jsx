import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, Card, Row, Col, Divider, Spin, Typography } from 'antd';
import LocationApi from "../../services/LocationApi.js";
import PublicApi from "./PublicApi.js";
import Spinner from "../../componets/Spinner.jsx";
import { toast } from "react-toastify";

const { Option } = Select;
const { Title, Text } = Typography;

const CheckFeePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        fromStreet: "",
        fromWard: "",
        fromDistrict: "",
        fromProvince: "",

        toStreet: "",
        toWard: "",
        toDistrict: "",
        toProvince: "",

        weight: 0.1,
        length: 1,
        width: 1,
        height: 1,
    });
    const [formResponse, setFormResponse] = useState(null);
    const [provinces, setProvinces] = useState([]);

    const [fromDistricts, setFromDistricts] = useState([]);
    const [fromWards, setFromWards] = useState([]);

    const [toDistricts, setToDistricts] = useState([]);
    const [toWards, setToWards] = useState([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res);
            } catch (err) {
                console.error("Lỗi lấy tỉnh:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProvinces();
    }, []);

    const handleFromProvinceChange = async (value, option) => {
        const id = option['data-id'];
        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === 'success') {
                setFromDistricts(res.data);
                setFromWards([]);
                setForm(prev => ({ ...prev, fromProvince: value, fromDistrict: '', fromWard: '' }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleFromDistrictChange = async (value, option) => {
        const id = option['data-id'];
        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setFromWards(res.data);
                setForm(prev => ({ ...prev, fromDistrict: value, fromWard: '' }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleToProvinceChange = async (value, option) => {
        const id = option['data-id'];
        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === 'success') {
                setToDistricts(res.data);
                setToWards([]);
                setForm(prev => ({ ...prev, toProvince: value, toDistrict: '', toWard: '' }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleToDistrictChange = async (value, option) => {
        const id = option['data-id'];
        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setToWards(res.data);
                setForm(prev => ({ ...prev, toDistrict: value, toWard: '' }));
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleCheckFee = async () => {
        try {
            const data = {
                weight: form.weight,
                length: form.length,
                width: form.width,
                height: form.height,
                fromProvince: form.fromProvince,
                toProvince: form.toProvince,
            };
            const response = await PublicApi.check(data);
            setFormResponse(response.data.data);
        } catch (err) {
            console.error(err?.response?.data?.message || "Lỗi không xác định");
        }
    }

    if (isLoading) return <Spinner />

    return (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', background: '#f5f5f5' }}>
            <Card style={{ width: '100%', maxWidth: 1200 }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Tra Giá</Title>
                <Form layout="vertical" onFinish={handleCheckFee}>
                    <Divider>Địa chỉ gửi</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Địa chỉ cụ thể" required>
                                <Input
                                    name="fromStreet"
                                    placeholder="123 đường ABC..."
                                    value={form.fromStreet}
                                    onChange={(e) => setForm(prev => ({ ...prev, fromStreet: e.target.value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tỉnh/Thành phố" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.fromProvince || undefined}
                                    onChange={handleFromProvinceChange}
                                >
                                    {provinces.map(p => (
                                        <Option key={p.id} value={p.name} data-id={p.id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Quận/Huyện" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.fromDistrict || undefined}
                                    onChange={handleFromDistrictChange}
                                >
                                    {fromDistricts.map(d => (
                                        <Option key={d.id} value={d.name} data-id={d.id}>{d.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Phường/Xã" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.fromWard || undefined}
                                    onChange={(value) => setForm(prev => ({ ...prev, fromWard: value }))}
                                >
                                    {fromWards.map(w => (
                                        <Option key={w.id} value={w.name} data-id={w.id}>{w.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Địa chỉ nhận</Divider>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Địa chỉ cụ thể" required>
                                <Input
                                    name="toStreet"
                                    placeholder="123 đường ABC..."
                                    value={form.toStreet}
                                    onChange={(e) => setForm(prev => ({ ...prev, toStreet: e.target.value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Tỉnh/Thành phố" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.toProvince || undefined}
                                    onChange={handleToProvinceChange}
                                >
                                    {provinces.map(p => (
                                        <Option key={p.id} value={p.name} data-id={p.id}>{p.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Quận/Huyện" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.toDistrict || undefined}
                                    onChange={handleToDistrictChange}
                                >
                                    {toDistricts.map(d => (
                                        <Option key={d.id} value={d.name} data-id={d.id}>{d.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Phường/Xã" required>
                                <Select
                                    placeholder="Chọn"
                                    value={form.toWard || undefined}
                                    onChange={(value) => setForm(prev => ({ ...prev, toWard: value }))}
                                >
                                    {toWards.map(w => (
                                        <Option key={w.id} value={w.name} data-id={w.id}>{w.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider>Thông tin kiện hàng</Divider>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="Khối lượng (kg)" required>
                                <InputNumber
                                    min={0.1} max={50} step={0.1} style={{ width: '100%' }}
                                    value={form.weight}
                                    onChange={(value) => setForm(prev => ({ ...prev, weight: value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Chiều dài (cm)" required>
                                <InputNumber
                                    min={1} max={150} step={1} style={{ width: '100%' }}
                                    value={form.length}
                                    onChange={(value) => setForm(prev => ({ ...prev, length: value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Chiều rộng (cm)" required>
                                <InputNumber
                                    min={1} max={150} step={1} style={{ width: '100%' }}
                                    value={form.width}
                                    onChange={(value) => setForm(prev => ({ ...prev, width: value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Chiều cao (cm)" required>
                                <InputNumber
                                    min={1} max={150} step={1} style={{ width: '100%' }}
                                    value={form.height}
                                    onChange={(value) => setForm(prev => ({ ...prev, height: value }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Tra giá
                        </Button>
                    </Form.Item>
                </Form>

                {formResponse && (
                    <Card style={{ marginTop: 20, background: '#fafafa' }}>
                        <Text type="secondary">Ước tính chi phí</Text>
                        <p className="mb-0 fw-semibold">Khối lượng tính phí: {formResponse.weightChargeable} kg</p>
                        <p className="mb-0 fw-semibold">Tổng chi phí: {formResponse.shippingFee.toLocaleString()} đ</p>
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default CheckFeePage;
