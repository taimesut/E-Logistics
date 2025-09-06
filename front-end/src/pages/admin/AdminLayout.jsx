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
                to={to}
                onClick={handleClick}
                className={"list-group-item list-group-item-action" + (isActive ? " active" : "")}
            >
                {children}
            </Link>
        </div>
    );
};

const AdminLayout = () => {
    document.title = "Trang Admin";
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

                <div className="col-md-3 col-lg-2 collapse d-md-block bg-light border-end min-vh-100 p-0" id="sidebar">
                    <div className="accordion accordion-flush" id="accordionSidebar">
                        <SidebarItem to="/">
                            <img src="/logo2.png" alt="Mesut Logistics" style={{ maxHeight: "50px", width: "auto" }}/>
                        </SidebarItem>
                        <SidebarItem to="/admin"><i className="bi bi-house-fill me-2"></i>Home</SidebarItem>
                        <div className="accordion-item bg-light">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed bg-light text-dark fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseBranch"
                                >
                                    <i className="bi bi-buildings-fill me-2"></i>Chi nhánh
                                </button>
                            </h2>
                            <div id="collapseBranch" className="accordion-collapse collapse">
                                <div className="list-group list-group-flush">
                                    <SidebarItem to="/admin/branch?status=ACTIVE">Chi nhánh đang hoạt động</SidebarItem>
                                    <SidebarItem to="/admin/branch?status=INACTIVE">Chi nhánh không hoạt động</SidebarItem>
                                    <SidebarItem to="/admin/create-branch">Tạo chi nhánh</SidebarItem>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item bg-light">
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed bg-light text-dark fw-semibold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseManager"
                                >
                                    <i className="bi bi-people-fill me-2"></i>Tài khoản
                                </button>
                            </h2>
                            <div id="collapseManager" className="accordion-collapse collapse">
                                <div className="list-group list-group-flush">
                                    <SidebarItem to="/admin/account?role=ROLE_SHIPPER">Danh sách shipper</SidebarItem>
                                    <SidebarItem to="/admin/account?role=ROLE_MANAGER">Danh sách quản lý</SidebarItem>
                                    <SidebarItem to="/admin/account?role=ROLE_CUSTOMER">Danh sách khách hàng</SidebarItem>
                                    <SidebarItem to="/admin/create-account">Tạo nhân viên</SidebarItem>
                                </div>
                            </div>
                        </div>
                        <div className="list-group list-group-flush">
                            <SidebarItem to="/admin/shipping-rule"><i className="bi bi-cash-coin me-2"></i>Quy định giá cước</SidebarItem>
                            <SidebarItem to="/admin/profile"><i className="bi bi-person-circle me-2"></i>Thông tin đăng nhập</SidebarItem>
                            <SidebarItem to="/admin/stats"><i className="bi bi-bar-chart-fill me-2"></i>Thống kê</SidebarItem>
                            <SidebarItem to="/logout"><i className="bi bi-box-arrow-right me-2"></i>Đăng xuất</SidebarItem>
                        </div>
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

export default AdminLayout;
