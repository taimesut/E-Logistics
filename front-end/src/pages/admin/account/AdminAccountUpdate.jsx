import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminAccountUpdate = () => {
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



    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await MyApi.updateAccount(id, form);
            toast.success("Cập nhật nhân viên thành công");
            setForm(res.data.data);
        } catch (err) {
            toast.error(err?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div className="container-fluid min-vh-100 bg-light py-5">
            <div className="card shadow mx-auto" style={{ maxWidth: "700px" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h4 className="card-title mb-4 text-center fw-bold">Cập nhật nhân viên</h4>

                    <form onSubmit={handleFormSubmit}>
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <th className="w-25">Họ Tên</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        onChange={handleFormChange}
                                        value={form.fullName}
                                        placeholder="Nhập Họ tên"
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Tên tài khoản</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={form.username}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        placeholder="Nhập địa chỉ email"
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>SĐT</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleFormChange}
                                        placeholder="Nhập SĐT"
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Role</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="role"
                                        value={form.role}
                                        readOnly
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Trạng thái</th>
                                <td>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={form.status}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option disabled value="">Chọn</option>
                                        <option value="ACTIVE">Hoạt động</option>
                                        <option value="LOCKED">Khóa</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Mã chi nhánh hoạt động</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="branchWorkId"
                                        value={form.branchWorkId}
                                        onChange={handleFormChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <button type="submit" className="btn btn-primary w-100 fw-semibold">
                            Lưu
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default AdminAccountUpdate;