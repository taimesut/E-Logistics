import React, {useState} from 'react';
import {toast} from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminAccountCreate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        password: "",
        username: "",
        email:"",
        phone:"",
        role: "",
        status: "",
        branchWorkId: "",
    });

    const handleFormChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
             await MyApi.createAccount(form);
            toast.success("Tao staff thành công");
            setForm({
                fullName: "",
                password: "",
                username: "",
                email:"",
                phone:"",
                role: "",
                status: "",
                branchWorkId: "",
            })
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tạo khi tạo staff");
        } finally {
            setIsLoading(false);
        }
    }

    if(isLoading){
        return <Spinner/>;
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-body">
                    <h4 className="card-title mb-4 text-center fw-bold">Tạo tài khoản</h4>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Họ và tên</label>
                            <input type="text" className="form-control" id="fullName" placeholder="Nhập họ và tên" required
                                   value={form.fullName} onChange={handleFormChange} name="fullName"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Tên tài khoản</label>
                            <input type="text" className="form-control" id="username" placeholder="Nhập tên tài khoản" required
                                   value={form.username} onChange={handleFormChange} name="username" minLength={8}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Nhập địa chỉ email" required
                                   value={form.email} onChange={handleFormChange} name="email"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">SĐT</label>
                            <input type="text" className="form-control" id="phone" placeholder="Nhập SĐT" required
                                   value={form.phone} onChange={handleFormChange} name="phone"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input type="password" className="form-control" id="password" placeholder="Nhập mật khẩu" required
                                   value={form.password} onChange={handleFormChange} name="password" minLength={8}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Role</label>
                            <select
                                className="form-select"
                                name="role"
                                onChange={handleFormChange}
                                value={form.role}
                                required
                            >
                                <option disabled value="">Chọn</option>
                                <option value="ROLE_SHIPPER">Shipper</option>
                                <option value="ROLE_MANAGER">NV Điều phối</option>
                            </select>
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
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 fw-semibold">
                            Tạo
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default AdminAccountCreate;