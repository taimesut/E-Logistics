import React, {useContext} from 'react';
import {Link, Navigate} from "react-router-dom";
import {AuthContext} from "../contexts/auth/AuthContext.jsx";

const Header = () => {
    const {state} = useContext(AuthContext);
    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src="/logo2.png" alt="Mesut Logistics" height={"50"} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold fs-6 text-uppercase">
                            <li className="nav-item">
                                <Link to="/" className="nav-link link-primary px-3">Trang chủ</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/tracking" className="nav-link link-primary px-3">Tra cứu đơn</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/check-fee" className="nav-link link-primary px-3">Tra giá</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/shipping-rule" className="nav-link link-primary px-3">Bảng giá cước</Link>
                            </li>
                        </ul>
                        <div className="d-flex gap-2">
                            {state.isAuthenticated ? (

                                <>
                                    {state.user?.role === "ROLE_ADMIN" ? (
                                        <Link to="/admin" className="nav-link active">Dashboard</Link>
                                    ) : null}
                                    {state.user?.role === "ROLE_CUSTOMER" ? (
                                        <Link to="/customer" className="nav-link active">Dashboard</Link>
                                    ) : null}
                                    {state.user?.role === "ROLE_SHIPPER" ? (
                                        <Link to="/shipper" className="nav-link active">Dashboard</Link>
                                    ) : null}
                                    {state.user?.role === "ROLE_MANAGER" ? (
                                        <Link to="/manager" className="nav-link active">Dashboard</Link>
                                    ) : null}
                                    <Link to={"/logout"} className="nav-link active btn btn-outline-danger">Đăng xuất</Link>
                                </>


                            ) : (
                                <>
                                    <Link to="/login" className="me-2">
                                        <button className="btn btn-outline-primary" type="button">Đăng nhập</button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="btn btn-outline-success" type="button">Đăng ký</button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;