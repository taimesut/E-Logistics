import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminBranchGetAll = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);


    const getBranches = async () => {
        try {
            setIsLoading(true);
            const response = await MyApi.getAllBranch(page, size, search, status);
            if (response.status === 200) {
                setBranches(response.data.data.data);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getBranches();
    }, [size, page, status])


    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div>
            <h3 className="mb-4 text-center">Danh sách chi nhánh</h3>

            <div className="mb-3 d-flex align-items-center gap-2">
                {/* Ô nhập tìm kiếm */}
                <div className="flex-grow-1">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Nhập mã chi nhánh, tên, địa chỉ"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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

                {/* Chọn status */}
                <div>
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{width: "160px"}}
                    >
                        <option value="">-- Tất cả trạng thái --</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Không hoạt động</option>
                    </select>
                </div>

                {/* Nút tìm */}
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={getBranches}
                >
                    Tìm
                </button>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/admin/create-branch')}
                >
                    Tạo chi nhánh
                </button>
            </div>


            <div className="table-responsive shadow rounded bg-white">
                <table className="table table-striped table-bordered table-hover mb-0">
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã chi nhánh</th>
                        <th>Tên chi nhánh</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {branches.length > 0 && branches.map((branch, index) => (
                        <tr key={branch.id}>
                            <td>{index + 1}</td>
                            <td>{branch.id}</td>
                            <td>{branch.name}</td>
                            <td>{branch.street === "" ? '' : branch.street + ', '} {branch.ward === "" ? '' : branch.ward + ', '} {branch.district === "" ? "" : branch.district + ', '}{branch?.province}</td>
                            <td>
                                <i
                                    className={`bi bi-circle-fill ${branch.status === "ACTIVE" ? "text-success" : "text-danger"}`}
                                    style={{marginRight: 8}}
                                ></i>
                                {branch.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                            </td>
                            <td>
                                <button className={"btn btn-primary me-2"}
                                        onClick={() => navigate(`/admin/branch/${branch.id}`)}>xem
                                </button>
                                <button className={"btn btn-warning"}
                                        onClick={() => navigate(`/admin/branch/edit/${branch.id}`)}>sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {branches.length > 0 &&
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
                }

            </div>
        </div>
    );
};

export default AdminBranchGetAll;