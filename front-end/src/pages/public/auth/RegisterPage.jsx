import React, { useState } from 'react';
import { Link } from "react-router-dom";
import AuthApi from "../../../services/AuthApi.js";
import { toast } from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        if (values.password !== values.confirmPassword) {
            toast.error("Mật khẩu không trùng khớp");
            return;
        }

        try {
            setIsLoading(true);
            const response = await AuthApi.register(values);
            if (response.status === 201) {
                toast.success(response.data.message);
                form.resetFields();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi không xác định");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <Spinner />;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', padding: '24px' }}>
            <Card style={{ width: 450, padding: '24px' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Đăng ký tài khoản</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        fullName: '',
                        username: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: ''
                    }}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Tên tài khoản"
                        name="username"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên tài khoản!" },
                            { min: 8, message: "Tối thiểu 8 ký tự" }
                        ]}
                    >
                        <Input placeholder="Nhập tên tài khoản" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: 'email', message: 'Email không hợp lệ' }]}
                    >
                        <Input placeholder="Nhập địa chỉ email" />
                    </Form.Item>

                    <Form.Item
                        label="SĐT"
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
                    >
                        <Input placeholder="Nhập SĐT" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 8, message: "Tối thiểu 8 ký tự" }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        label="Nhập lại mật khẩu"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                            { min: 8, message: "Tối thiểu 8 ký tự" }
                        ]}
                    >
                        <Input.Password placeholder="Nhập lại mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'center' }}>
                    <Text>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></Text>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;
