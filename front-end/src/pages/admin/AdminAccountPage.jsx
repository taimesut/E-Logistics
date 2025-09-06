import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import AdminApi from "./AdminApi.js";
import Spinner from "../../componets/Spinner.jsx";

const AdminAccountPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate();
    const [searchKw, setSearchKw] = useState("");

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const getAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await AdminApi.getStaffs(page, size, search,role);
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
    }, [size, search, page,role])

    if (isLoading) {
        return <Spinner/>
    }
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{maxWidth: "1200px", width: "100%"}}>
                <div className="mb-3">
                    <label htmlFor="search" className="form-label">Tìm kiếm</label>
                    <input
                        type="text"
                        className="form-control"
                        id="search"
                        name="search"
                        value={searchKw}
                        onChange={(e) => setSearchKw(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => navigate(`/admin/account?search=${searchKw}`)}
                    >
                        Tìm
                    </button>
                </div>
                <table className="table table-striped">
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
                    {accounts.length > 0 && accounts.map((staff, index) => (
                        <tr key={staff.id}>
                            <td>{index + 1}</td>
                            <td>{staff.username}</td>
                            <td>{staff.fullName}</td>
                            <td>{staff.role}</td>
                            <td>
                                <i
                                    className={`bi bi-circle-fill ${staff.status === "ACTIVE" ? "text-success" : "text-danger"}`}
                                    style={{marginRight: 8}}
                                ></i>
                                {staff.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                            </td>
                            <td>{staff.branchWorkId}</td>
                            <td>
                                <button className={"btn btn-primary"}
                                        onClick={() => navigate(`/admin/account/${staff.id}`)}> Chỉnh sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="d-flex justify-content-between mt-3">
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
            </div>
        </div>
    );
};

export default AdminAccountPage;
