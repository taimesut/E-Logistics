import React from 'react';
import {Link, useSearchParams} from "react-router-dom";
import Spinner from "../../componets/Spinner.jsx";
import PublicApi from "./PublicApi.js";
import {toast} from "react-toastify";

const ResetPasswordPage = () => {
    const [email, setEmail] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchParams] = useSearchParams();
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await PublicApi.resetPassword(email);
            if (response.status === 200) {
                toast.success("Check email sent");
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            try {
                setIsLoading(true);
                const response = await PublicApi.NewPassword(token,password);
                if (response.status === 200) {
                    toast.success("Đổi mật khẩu thành công");
                }
            } catch (err) {
                console.log(err);
                toast.error(err.response?.data?.message || "Có lỗi xảy ra");
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Mật khẩu không trùng khớp");
        }

    }

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '400px'}}>
                {token?.length > 0 ? (
                    <>
                        <h3 className="mb-3 text-center">Mật khẩu mới</h3>
                        <form onSubmit={handleSubmitNewPassword}>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    name="password"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    name="confirmPassword"
                                />
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary">Gửi</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h3 className="mb-3 text-center">Khôi phục mật khẩu</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    placeholder="nhập email"
                                    required
                                />
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-primary">Gửi</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );

};

export default ResetPasswordPage;