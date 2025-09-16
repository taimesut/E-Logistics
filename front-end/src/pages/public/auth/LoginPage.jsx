import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AuthApi from "../../../services/AuthApi.js";
import { AuthContext } from "../../../contexts/auth/AuthContext.jsx";
import Spinner from "../../../componets/Spinner.jsx";
import { toast } from "react-toastify";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate();
    const { state, dispatch } = useContext(AuthContext);

    const handleOnSubmit = async (values) => {
        try {
            setIsLoading(true);
            const response = await AuthApi.login(values);
            if (response.status === 200) {
                const accessToken = response.data.data.accessToken;
                const user = response.data.data.user;

                localStorage.setItem("accessToken", accessToken);

                dispatch({
                    type: 'LOGIN',
                    payload: { accessToken, user }
                });

                toast.success(response.data?.message);
                // navigate if needed, e.g., navigate("/");
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
            <Card style={{ width: 400, padding: '24px' }}>
                <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Đăng nhập</Title>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOnSubmit}
                    initialValues={{ username: '', password: '' }}
                >
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }, { min: 8, message: "Tối thiểu 8 ký tự" }]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }, { min: 8, message: "Tối thiểu 8 ký tự" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: 'right', marginBottom: 12 }}>
                    <Link to="/reset-password"><Text type="secondary">Quên mật khẩu?</Text></Link>
                </div>

                <hr />

                <div style={{ textAlign: 'center' }}>
                    <Text>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></Text>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
