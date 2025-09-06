import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import AdminApi from "./AdminApi.js";
import Spinner from "../../componets/Spinner.jsx";

const AdminDetailAccountPage = () => {
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

            const res = await AdminApi.getStaffById(id);
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
            const res = await AdminApi.updateStaff(id, form);
            toast.success("Cập nhật staff thành công");
            setForm(res.data.data);
        } catch (err) {
            toast.error("Lỗi khi cập nhật staff");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner/>;
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h4 className="card-title mb-4 text-center fw-bold">Cập nhật nhân viên</h4>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Họ Tên</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fullName"
                                onChange={handleFormChange}
                                value={form.fullName}
                                placeholder="Nhập Họ tên"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tên tài khoản</label>
                            <input
                                type="text"
                                className="form-control"
                                name="username"
                                onChange={handleFormChange}
                                value={form.username}
                                placeholder="Nhập username"
                                required
                                readOnly={true}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Nhập địa chỉ email" required
                                   value={form.email} onChange={handleFormChange} name="email" readOnly={true}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">SĐT</label>
                            <input type="text" className="form-control" id="phone" placeholder="Nhập SĐT" required
                                   value={form.phone} onChange={handleFormChange} name="phone" readOnly={true}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={handleFormChange}
                                value={form.password}
                                placeholder="........"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Role</label>
                            <input
                                type="text"
                                className="form-control"
                                name="password"
                                onChange={handleFormChange}
                                value={form.role}
                                required
                                readOnly={true}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Trạng thái</label>
                            <select
                                className="form-select"
                                name="status"
                                onChange={handleFormChange}
                                value={form.status}
                                required
                            >
                                <option disabled value="">Chọn</option>
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="LOCKED">Khóa</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Mã chi nhánh hoạt động</label>
                            <input
                                type="text"
                                className="form-control"
                                name="branchWorkId"
                                onChange={handleFormChange}
                                value={form.branchWorkId}
                                placeholder="Nhập mã chi nhánh"
                                required
                                readOnly={true}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 fw-semibold">
                            Lưu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailAccountPage;