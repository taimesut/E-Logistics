import React from 'react';
import {Link} from "react-router-dom";
import AuthApi from "../../services/AuthApi.js";
import {toast} from "react-toastify";
import Spinner from "../../componets/Spinner.jsx";

const RegisterPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [form, setForm] = React.useState({
        fullName: "",
        username: "",
        password: "",
        email:"",
        phone:"",
        confirmPassword: "",
    })

    const handleFormChange = (e) => {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            toast.error("Mật khẩu không trùng khớp");
            return;
        }

        try {
            setIsLoading(true);
            const response = await AuthApi.register(form);
            if (response.status === 201) {
                toast.success(response.data.message);
                setForm({
                    fullName: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                })
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '450px'}}>
                <h3 className="mb-3 text-center">Đăng ký tài khoản</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Họ và tên</label>
                        <input type="text" className="form-control" id="fullName" placeholder="Nhập họ và tên" required
                               value={form.fullName} onChange={handleFormChange} name="fullName"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên tài khoản</label>
                        <input type="text" className="form-control" id="username" placeholder="Nhập tên tài khoản" required
                               value={form.username} onChange={handleFormChange} name="username" minLength={8}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Nhập địa chỉ email" required
                               value={form.email} onChange={handleFormChange} name="email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">SĐT</label>
                        <input type="text" className="form-control" id="phone" placeholder="Nhập SĐT" required
                               value={form.phone} onChange={handleFormChange} name="phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input type="password" className="form-control" id="password" placeholder="Nhập mật khẩu" required
                               value={form.password} onChange={handleFormChange} name="password" minLength={8}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu</label>
                        <input type="password" className="form-control" id="confirmPassword"
                               placeholder="Nhập lại mật khẩu" required value={form.confirmPassword} onChange={handleFormChange}
                               name="confirmPassword" minLength={8}/>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">Đăng ký</button>
                    </div>
                </form>
                <div className="mt-3 text-center">
                    <small>
                        Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;