import React from 'react';
import {Link, NavLink, Outlet, useLocation} from "react-router-dom";


const SidebarItem = ({ to, children }) => {
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
                onClick={handleClick}
                to={to}
                className={"list-group-item list-group-item-action" + (isActive ? " active" : "")}
            >
                {children}
            </Link>
        </div>
    );
};

const ShipperLayout = () => {
    document.title = "Trang Shipper";
    return (
        <div className="container-fluid">
            <div className="row">

                {/* Toggle button on mobile */}
                <div className="d-md-none bg-light border-bottom p-2">
                    <button className="btn btn-outline-dark w-100" type="button" data-bs-toggle="collapse"
                            data-bs-target="#sidebar" aria-expanded="false" aria-controls="sidebar">
                        ☰ Menu quản lý
                    </button>
                </div>

                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 collapse d-md-block bg-light border-end min-vh-100 p-0" id="sidebar">
                    <div className="accordion accordion-flush" id="accordionSidebar">
                        <SidebarItem to="/">
                            <img src="/logo2.png" alt="Mesut Logistics" style={{ maxHeight: "50px", width: "auto" }}/>
                        </SidebarItem>
                        <SidebarItem to="/shipper"><i className="bi bi-house-fill me-2"></i>Home</SidebarItem>
                        {/* Đơn lấy hàng */}
                        <div className="accordion-item bg-light">
                            <h2 className="accordion-header" id="headingPickup">
                                <button
                                    className="accordion-button collapsed bg-light text-dark fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapsePickup"
                                    aria-expanded="false"
                                    aria-controls="collapsePickup"
                                >
                                    <i className="bi bi-box2 me-2"></i>Đơn lấy hàng
                                </button>
                            </h2>
                            <div
                                id="collapsePickup"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingPickup"
                                data-bs-parent="#accordionSidebar"
                            >
                                <SidebarItem to="/shipper/parcel?type=PICKUP&status=PICKUP_IN_PROGRESS">Đang lấy</SidebarItem>
                                <SidebarItem to="/shipper/parcel?type=PICKUP&status=PICKUP_FAILED">Thất bại</SidebarItem>
                                <SidebarItem to="/shipper/parcel?type=PICKUP&status=PICKUP_SUCCESS">Thành công</SidebarItem>
                                {/*<SidebarItem to="/shipper/parcel/pickup/cancelled">Bị hủy</SidebarItem>*/}
                            </div>
                        </div>

                        {/* Đơn giao hàng */}
                        <div className="accordion-item bg-light">
                            <h2 className="accordion-header" id="headingDelivery">
                                <button
                                    className="accordion-button collapsed bg-light text-dark fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseDelivery"
                                    aria-expanded="false"
                                    aria-controls="collapseDelivery"
                                >
                                    <i className="bi bi-box2-fill me-2"></i>Đơn giao hàng
                                </button>
                            </h2>
                            <div
                                id="collapseDelivery"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingDelivery"
                                data-bs-parent="#accordionSidebar"
                            >
                                <SidebarItem to="/shipper/parcel?type=DELIVERY&status=DELIVERY_IN_PROGRESS">Đang giao</SidebarItem>
                                <SidebarItem to="/shipper/parcel?type=DELIVERY&status=DELIVERY_FAILED">Thất bại</SidebarItem>
                                <SidebarItem to="/shipper/parcel?type=DELIVERY&status=DELIVERED">Thành công</SidebarItem>
                            </div>
                        </div>
                        <SidebarItem to="/shipper/profile"><i className="bi bi-person-circle me-2"></i>Thông tin đăng nhập</SidebarItem>
                        <SidebarItem to="/shipper/stats"><i className="bi bi-bar-chart-fill me-2"></i>Thống kê</SidebarItem>
                        <SidebarItem to="/logout"><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</SidebarItem>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-md-9 col-lg-10 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ShipperLayout;