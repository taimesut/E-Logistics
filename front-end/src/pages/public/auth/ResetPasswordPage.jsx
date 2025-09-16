import React from 'react';
import { useSearchParams } from "react-router-dom";
import { Form, Input, Button, Card, Typography } from "antd";
import { toast } from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import PublicApi from "../PublicApi.js";

const { Title } = Typography;

const ResetPasswordPage = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmitEmail = async () => {
        try {
            setIsLoading(true);
            const response = await PublicApi.resetPassword(email);
            if (response.status === 200) {
                toast.success("Kiểm tra thư email");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmitNewPassword = async () => {
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không trùng khớp");
            return;
        }
        try {
            setIsLoading(true);
            const response = await PublicApi.NewPassword(token, password);
            if (response.status === 200) {
                toast.success("Đổi mật khẩu thành công");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <Spinner />;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', padding: '24px' }}>
            <Card style={{ width: 400, padding: '24px' }}>
                {token ? (
                    <>
                        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Mật khẩu mới</Title>
                        <Form layout="vertical" onFinish={handleSubmitNewPassword}>
                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                            >
                                <Input.Password
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nhập lại mật khẩu"
                                name="confirmPassword"
                                rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}
                            >
                                <Input.Password
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    <>
                        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>Khôi phục mật khẩu</Title>
                        <Form layout="vertical" onFinish={handleSubmitEmail}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input
                                    placeholder="Nhập địa chỉ email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
