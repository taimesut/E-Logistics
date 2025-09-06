import React, {useEffect, useState} from 'react';
import Spinner from "../../componets/Spinner.jsx";
import AdminApi from "./AdminApi.js";
import {useLocation, useNavigate} from "react-router-dom";

const AdminBranch = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();
    const [searchKw, setSearchKw] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const getBranches = async () => {
        try {
            setIsLoading(true);
            const response = await AdminApi.getBranches(page, size,search,status);
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
    }, [size, page, search,status])


    if (isLoading) {
        return <Spinner/>;
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
                        onChange={(e)=>setSearchKw(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={()=>navigate(`/admin/branch?search=${searchKw}`)}
                    >
                        Tìm
                    </button>
                </div>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã chi nhánh</th>
                        <th>Tên chi nhánh</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Loại</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {branches.length > 0 && branches.map((branch, index) => (
                        <tr key={branch.id}>
                            <td>{index + 1}</td>
                            <td>{branch.id}</td>
                            <td>{branch.name}</td>
                            <td>{branch.street}, {branch.ward}, {branch.district}, {branch.province}</td>
                            <td>
                                <i
                                    className={`bi bi-circle-fill ${branch.status === "ACTIVE" ? "text-success" : "text-danger"}`}
                                    style={{marginRight: 8}}
                                ></i>
                                {branch.status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động"}
                            </td>
                            <td>{branch.type}</td>
                            <td>
                                <button className={"btn btn-primary"}
                                        onClick={() => navigate(`/admin/branch/${branch.id}`)}> Chỉnh sửa
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

export default AdminBranch;
