import React from 'react';
import {Link} from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className="container text-center mt-5">
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập trang này.</p>
            <Link to="/">Quay về trang chủ</Link>
        </div>
    );
};

export default UnauthorizedPage;
