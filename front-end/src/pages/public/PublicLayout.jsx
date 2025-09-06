import React from 'react';
import Header from "../../componets/Header.jsx";
import Footer from "../../componets/Footer.jsx";
import {Outlet} from "react-router-dom";

const PublicLayout = () => {
    document.title = "Trang chủ";

    return (
        <div>
            <Header />
                <Outlet />
            <Footer />
        </div>
    );
};

export default PublicLayout;