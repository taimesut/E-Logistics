import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminBranchDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        status: "ACTIVE",
        type:""
    });


    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await MyApi.getBranchById(id);
                const resData = res.data.data;
                setForm(resData);
            } catch (err) {
                console.error(err);
                toast.error("Không thể tải thông tin chi nhánh");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id]);



    if (isLoading) {
        return (
            <Spinner/>
        );
    }

    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="card shadow mx-auto" style={{ maxWidth: "900px" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h3 className="card-title mb-4 text-center fw-bold">Chi tiết chi nhánh</h3>

                    <table className="table table-bordered table-striped">
                        <tbody>
                        <tr>
                            <th className="w-25">Tên chi nhánh</th>
                            <td>{form.name || "—"}</td>
                        </tr>
                        <tr>
                            <th>Tỉnh/Thành phố</th>
                            <td>{form.province || "—"}</td>
                        </tr>
                        <tr>
                            <th>Quận/Huyện</th>
                            <td>{form.district || "—"}</td>
                        </tr>
                        <tr>
                            <th>Phường/Xã</th>
                            <td>{form.ward || "—"}</td>
                        </tr>
                        <tr>
                            <th>Tên đường</th>
                            <td>{form.street || "—"}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>{form.status || "—"}</td>
                        </tr>
                        <tr>
                            <th>Loại</th>
                            <td>{form.type || "—"}</td>
                        </tr>
                        <tr>
                            <th>Ngày tạo</th>
                            <td>
                                {form.createdAt
                                    ? new Date(form.createdAt).toLocaleString("vi-VN")
                                    : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <td>
                                {form.updateAt
                                    ? new Date(form.updateAt).toLocaleString("vi-VN")
                                    : "—"}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBranchDetail;