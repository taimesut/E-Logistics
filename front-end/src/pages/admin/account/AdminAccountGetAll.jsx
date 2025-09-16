import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminAccountGetAll = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [role, setRole] = useState(searchParams.get("role")||"");
    const [status, setStatus] = useState("");

    const getAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await MyApi.getAllAccount(page, size, search, role,status);
            if (response.status === 200) {
                setAccounts(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
            }
            console.log(response);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAccounts();
    }, [size, page, role, status]);

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="">
            <div className="mx-auto" >
                <div className="card-body">
                    <h3 className="mb-4 text-center">Danh sách nhân viên</h3>

                    <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                        {/* Ô nhập tìm kiếm */}
                        <div className="flex-grow-1">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 Nhập tên, username, chi nhánh"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{width: "140px"}}
                            >
                                <option value={"ACTIVE"}>ACTIVE</option>
                                <option value={"LOCKED"}>LOCKED</option>
                            </select>
                        </div>
                        {/* Chọn size */}
                        <div>
                            <select
                                className="form-select"
                                value={size}
                                onChange={(e) => setSize(Number(e.target.value))}
                                style={{width: "140px"}}
                            >
                                <option value={5}>Hiển thị 5 / trang</option>
                                <option value={10}>Hiển thị 10 / trang</option>
                                <option value={20}>Hiển thị 20 / trang</option>
                                <option value={50}>Hiển thị 50 / trang</option>
                            </select>
                        </div>

                        {/* Chọn role */}
                        <div>
                            <select
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: "180px" }}
                            >
                                <option value="">-- Tất cả quyền --</option>
                                <option value="ROLE_ADMIN">Admin</option>
                                <option value="ROLE_SHIPPER">Shipper</option>
                                <option value="ROLE_MANAGER">Điều phối</option>
                                <option value="ROLE_CUSTOMER">Khách hàng</option>
                            </select>
                        </div>

                        {/* Nút tìm */}
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={getAccounts}
                        >
                            Tìm
                        </button>

                        {/* Nút tạo mới */}
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => navigate('/admin/create-account')}
                        >
                            Tạo tài khoản
                        </button>
                    </div>

                    <div className="table-responsive shadow rounded bg-white">
                        <table className="table table-striped table-bordered table-hover mb-0">
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên tài khoản</th>
                                <th>Họ tên</th>
                                <th>Quyền</th>
                                <th>Trạng thái</th>
                                <th>Mã chi nhánh</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {accounts.length > 0 ? (
                                accounts.map((staff, index) => (
                                    <tr key={staff.id}>
                                        <td>{index + 1}</td>
                                        <td>{staff.username}</td>
                                        <td>{staff.fullName}</td>
                                        <td>{staff.role}</td>
                                        <td>
                                            <i
                                                className={`bi bi-circle-fill ${staff.status === "ACTIVE" ? "text-success" : "text-danger"}`}
                                                style={{ marginRight: 8 }}
                                            ></i>
                                            {staff.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                                        </td>
                                        <td>{staff.branchWorkId || "—"}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary me-2"
                                                onClick={() => navigate(`/admin/account/${staff.id}`)}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => navigate(`/admin/account/edit/${staff.id}`)}
                                            >
                                                Sửa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center">Không có dữ liệu</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {accounts.length > 0 && (
                            <div className="d-flex justify-content-between m-3">
                                <button
                                    className="btn btn-secondary"
                                    disabled={page === 0}
                                    onClick={() => setPage(prev => prev - 1)}
                                >
                                    Trước
                                </button>
                                <span>Trang {page + 1} / {totalPages}</span>
                                <button
                                    className="btn btn-secondary"
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AdminAccountGetAll;