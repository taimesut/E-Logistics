import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminAccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        role: "",
        phone:"",
        email:"",
        status: "",
        branchWorkId: "",
    });

    const fetchStaff = async () => {
        try{
            setIsLoading(true);

            const res = await MyApi.getAccountById(id);
            setForm(res.data.data)
            console.log(res.data.data)
        }catch(err){
            console.log(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStaff();
    },[id])



    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div className="container-fluid py-5">
            <div className="card shadow mx-auto" style={{ maxWidth: "700px" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h4 className="card-title mb-4 text-center fw-bold">Chi tiết nhân viên</h4>

                    <table className="table table-bordered table-striped">
                        <tbody>
                        <tr>
                            <th>Họ tên</th>
                            <td>{form.fullName || "—"}</td>
                        </tr>
                        <tr>
                            <th>Tên tài khoản</th>
                            <td>{form.username || "—"}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{form.email || "—"}</td>
                        </tr>
                        <tr>
                            <th>SĐT</th>
                            <td>{form.phone || "—"}</td>
                        </tr>
                        <tr>
                            <th>Role</th>
                            <td>{form.role || "—"}</td>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <td>
                                {form.status === "ACTIVE"
                                    ? "Hoạt động"
                                    : form.status === "LOCKED"
                                        ? "Khóa"
                                        : "—"}
                            </td>
                        </tr>
                        <tr>
                            <th>Mã chi nhánh hoạt động</th>
                            <td>{form.branchWorkId || "—"}</td>
                        </tr>
                        <tr>
                            <th>Ngày tạo</th>
                            <td>{form.createdAt ? new Date(form.createdAt).toLocaleString("vi-VN") : "—"}</td>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <td>{form.updateAt ? new Date(form.updateAt).toLocaleString("vi-VN") : "—"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default AdminAccountDetail;