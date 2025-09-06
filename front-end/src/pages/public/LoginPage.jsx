import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import AuthApi from "../../services/AuthApi.js";
import {AuthContext} from "../../contexts/auth/AuthContext.jsx";
import Spinner from "../../componets/Spinner.jsx";
import {toast} from "react-toastify";

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = React.useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    const {state, dispatch} = useContext(AuthContext);

    const handleFormChange = (e) => {
        setForm((prev) => ({...prev, [e.target.name]: e.target.value}));
    }


    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await AuthApi.login(form);
            if (response.status === 200) {
                const accessToken = response.data.data.accessToken;
                const user = response.data.data.user;

                localStorage.setItem("accessToken", accessToken);

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        accessToken,
                        user
                    }
                });

                toast.success(response.data?.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="card p-4 shadow" style={{width: '100%', maxWidth: '400px'}}>
                <h3 className="mb-3 text-center">Đăng nhập</h3>
                <form onSubmit={handleOnSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input type="text" className="form-control" id="username" name={"username"}
                               onChange={handleFormChange} value={form.username} placeholder="Nhập tên đăng nhập"
                               minLength={8} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <input type="password" className="form-control" id="password" name={"password"}
                               onChange={handleFormChange} value={form.password} placeholder="Nhập mật khẩu" minLength={8}
                               required/>
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-primary">Đăng nhập</button>
                    </div>
                </form>
                <small>
                    <Link to={"/reset-password"}>Quên mật khẩu</Link>
                </small>
                <hr/>
                <div className="mt-3 text-center">
                    <small>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
                    </small>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;