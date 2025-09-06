import React from 'react';
import {Link, NavLink, Outlet, useLocation} from "react-router-dom";


const SidebarItem = ({to, children}) => {
    const location = useLocation();

    const isActive = location.pathname + location.search === to;

    const handleClick = () => {
        const sidebarEl = document.getElementById("sidebar");
        if (sidebarEl && sidebarEl.classList.contains("show")) {
            const bsCollapse = bootstrap.Collapse.getInstance(sidebarEl);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    };

    return (
        <div className="accordion-body p-0">
            <Link
                to={to}
                className={"list-group-item list-group-item-action" + (isActive ? " active" : "")}
                onClick={handleClick}
            >
                {children}
            </Link>
        </div>
    );
};

const CustomerLayout = () => {
    document.title = "Trang Khách Hàng";
    return (
        <div className="container-fluid">
            <div className="row">

                <div className="d-md-none bg-light border-bottom p-2">
                    <button className="btn btn-outline-dark w-100" type="button" data-bs-toggle="collapse"
                            data-bs-target="#sidebar" aria-expanded="false" aria-controls="sidebar">
                        ☰ Menu
                    </button>
                </div>

                <div className="col-md-3 col-lg-2 collapse d-md-block bg-light border-end min-vh-100 p-0" id="sidebar">
                    <div className="accordion accordion-flush" id="accordionSidebar">
                        <SidebarItem to="/">
                            <img src="/logo2.png" alt="Mesut Logistics" style={{maxHeight: "50px", width: "auto"}}/>
                        </SidebarItem>
                        <SidebarItem to="/customer"><i className="bi bi-house-fill me-2"></i>Home</SidebarItem>

                        <div className="accordion-item bg-light">
                            <h2 className="accordion-header" id="headingParcel">
                                <button
                                    className="accordion-button collapsed bg-light text-dark fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseParcel"
                                    aria-expanded="false"
                                    aria-controls="collapseParcel"
                                >
                                    <i className="bi bi-box2-fill me-2"></i>Đơn hàng
                                </button>
                            </h2>
                            <div
                                id="collapseParcel"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingParcel"
                                data-bs-parent="#accordionSidebar"
                            >
                                <SidebarItem to="/customer/create-parcel">Tạo đơn hàng</SidebarItem>
                                <SidebarItem to="/customer/parcel">Tất cả đơn hàng</SidebarItem>
                                <SidebarItem to="/customer/parcel?status=CREATED">Đơn mới tạo</SidebarItem>
                                <SidebarItem to="/customer/parcel?status=PICKUP_IN_PROGRESS">Đang lấy hàng</SidebarItem>
                                <SidebarItem to="/customer/parcel?status=DELIVERY_IN_PROGRESS">Đang giao hàng</SidebarItem>
                                <SidebarItem to="/customer/parcel?status=CANCELLED">Đã hủy</SidebarItem>
                                <SidebarItem to="/customer/parcel?status=DELIVERED">Đã giao</SidebarItem>
                            </div>
                        </div>

                        <SidebarItem to="/customer/tracking"><i className="bi bi-geo-alt-fill me-2"></i>Tracking</SidebarItem>
                        <SidebarItem to="/customer/profile"><i className="bi bi-person-circle me-2"></i>Thông tin đăng
                            nhập</SidebarItem>
                        <SidebarItem to="/customer/stats"><i className="bi bi-bar-chart-fill me-2"></i>Thống kê</SidebarItem>
                        <SidebarItem to="/logout"><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</SidebarItem>
                    </div>
                </div>
                <div className="col-md-9 col-lg-10 p-4">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
