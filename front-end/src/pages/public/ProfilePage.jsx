import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth/AuthContext.jsx";
import { Card, Avatar, Upload, Button, Form, Input, Select, Row, Col } from "antd";
import { UploadOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import PublicApi from "./PublicApi.js";
import LocationApi from "../../services/LocationApi.js";

const { Option } = Select;

const ProfilePage = () => {
    const { state, dispatch } = useContext(AuthContext);

    const [avatarPreview, setAvatarPreview] = useState(state.user.avatar || null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formAddress] = Form.useForm();
    const [formPassword] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProvinces = async () => {
            setLoading(true);
            try {
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res);

                if (state.user.province) {
                    const provinceItem = (res.data || res).find(p => p.name === state.user.province);
                    if (provinceItem) {
                        const resDistricts = await LocationApi.getDistricts(provinceItem.id);
                        if (resDistricts.code === "success") setDistricts(resDistricts.data);

                        if (state.user.district) {
                            const districtItem = resDistricts.data.find(d => d.name === state.user.district);
                            if (districtItem) {
                                const resWards = await LocationApi.getWards(districtItem.id);
                                if (resWards.code === "success") setWards(resWards.data);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    const handleAvatarChange = info => {
        const file = info.file.originFileObj;
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", avatarFile);
        try {
            const res = await PublicApi.UploadAvatar(formData);
            toast.success("Upload avatar thành công!");
            state.user.avatar = res.data.data.avatar;
            setAvatarPreview(res.data.data.avatar);
            setAvatarFile(null);
        } catch (err) {
            console.log(err);
            toast.error("Upload thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddressChange = async values => {
        try {
            setLoading(true);
            const res = await PublicApi.updateAddress(values.address, values.ward, values.district, values.province);
            toast.success(res.data.message);
            dispatch({ type: "UPDATE_USER", payload: values });
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi server");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async values => {
        if (values.newPassword !== values.confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }
        try {
            const res = await PublicApi.ChangePassword(values.oldPassword, values.newPassword);
            toast.success(res.data.message);
            formPassword.resetFields();
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi server");
        }
    };

    const handleProvinceChange = async (value, option) => {
        const id = option.key;
        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === "success") setDistricts(res.data);
            setWards([]);
            formAddress.setFieldsValue({ district: "", ward: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDistrictChange = async (value, option) => {
        const id = option.key;
        try {
            const res = await LocationApi.getWards(id);
            if (res.code === "success") setWards(res.data);
            formAddress.setFieldsValue({ ward: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", display: "flex", flexDirection: "column", gap: "30px" }}>
            {/* User Info Card */}
            <Card loading={loading} style={{ borderRadius: 15, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
                <Row gutter={24} align="middle">
                    <Col flex="100px">
                        <Avatar size={100} src={avatarPreview} icon={!avatarPreview && <UserOutlined />} />
                        <Upload showUploadList={false} beforeUpload={() => false} onChange={handleAvatarChange}>
                            <Button type="primary" icon={<UploadOutlined />} style={{ marginTop: 10 }} loading={isUploading}>
                                Đổi Avatar
                            </Button>
                        </Upload>
                        <Button type="primary" style={{ marginTop: 10, width: "100%" }} onClick={handleAvatarUpload} disabled={!avatarFile || isUploading}>
                            Upload
                        </Button>
                    </Col>
                    <Col flex="auto">
                        <h2>{state.user.fullName}</h2>
                        <p style={{ color: "#666" }}>@{state.user.username}</p>
                        <p>ID: {state.user.id}</p>
                        {state.user.role !== "ROLE_CUSTOMER" && <p>Branch Work ID: {state.user.branchWorkId || "Not provided"}</p>}
                        <p>Email: {state.user.email}</p>
                        <p>Phone: {state.user.phone}</p>
                    </Col>
                </Row>
            </Card>

            {/* Change Address Card */}
            <Card title="Đổi địa chỉ" style={{ borderRadius: 15, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
                <Form form={formAddress} layout="vertical" onFinish={handleAddressChange} initialValues={{
                    address: state.user.address,
                    province: state.user.province,
                    district: state.user.district,
                    ward: state.user.ward
                }}>
                    <Form.Item name="address" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
                        <Input placeholder="123 đường ABC..." />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
                                <Select placeholder="Chọn" onChange={handleProvinceChange}>
                                    {provinces.map(p => <Option key={p.id} value={p.name}>{p.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true }]}>
                                <Select placeholder="Chọn" onChange={handleDistrictChange}>
                                    {districts.map(d => <Option key={d.id} value={d.name}>{d.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true }]}>
                                <Select placeholder="Chọn">
                                    {wards.map(w => <Option key={w.id} value={w.name}>{w.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Button type="primary" htmlType="submit" block>Đổi địa chỉ</Button>
                </Form>
            </Card>

            {/* Change Password Card */}
            <Card title="Đổi mật khẩu" style={{ borderRadius: 15, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
                <Form form={formPassword} layout="vertical" onFinish={handlePasswordChange}>
                    <Form.Item name="oldPassword" label="Mật khẩu cũ" rules={[{ required: true }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu cũ" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="Nhập lại mật khẩu mới" rules={[{ required: true }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Đổi mật khẩu</Button>
                </Form>
            </Card>
        </div>
    );
};

export default ProfilePage;
