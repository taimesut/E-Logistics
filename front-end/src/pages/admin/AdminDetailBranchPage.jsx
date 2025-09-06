import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationApi from "../../services/LocationApi.js";
import AdminApi from "./AdminApi.js";
import { toast } from "react-toastify";

const AdminDetailBranchPage = () => {
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

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res);
            } catch (err) {
                console.error("Lỗi lấy tỉnh:", err);
                toast.error("Không thể tải danh sách tỉnh/thành phố");
            }
        })();
    }, []);

    useEffect(() => {
        if (provinces.length === 0) return;

        (async () => {
            try {
                setIsLoading(true);
                const res = await AdminApi.getBranchById(id);
                const resData = res.data.data;

                let districtList = [];
                if (resData.province) {
                    const provinceId = provinces.find(p => p.name === resData.province)?.id;
                    if (provinceId) {
                        const districtRes = await LocationApi.getDistricts(provinceId);
                        if (districtRes.code === "success") districtList = districtRes.data;
                        setDistricts(districtList);
                    }
                }

                let wardList = [];
                if (resData.district && districtList.length > 0) {
                    const districtId = districtList.find(d => d.name === resData.district)?.id;
                    if (districtId) {
                        const wardRes = await LocationApi.getWards(districtId);
                        if (wardRes.code === "success") wardList = wardRes.data;
                        setWards(wardList);
                    }
                }
                setForm(resData);
            } catch (err) {
                console.error(err);
                toast.error("Không thể tải thông tin chi nhánh");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [id, provinces]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = async (e) => {
        const selectedId = e.target.selectedOptions[0]?.getAttribute("data-id");
        const provinceName = e.target.value;

        setForm((prev) => ({
            ...prev,
            province: provinceName,
            district: "",
            ward: "",
        }));
        setDistricts([]);
        setWards([]);

        if (!selectedId) return;

        try {
            const res = await LocationApi.getDistricts(selectedId);
            if (res.code === "success") setDistricts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDistrictChange = async (e) => {
        const selectedId = e.target.selectedOptions[0]?.getAttribute("data-id");
        const districtName = e.target.value;

        setForm((prev) => ({
            ...prev,
            district: districtName,
            ward: "",
        }));
        setWards([]);

        if (!selectedId) return;

        try {
            const res = await LocationApi.getWards(selectedId);
            if (res.code === "success") setWards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await AdminApi.updateBranch(id, form);
            toast.success("Cập nhật chi nhánh thành công");
            setForm(res.data.data);
        } catch (err) {
            toast.error("Lỗi khi cập nhật chi nhánh");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status"></div>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: "500px", width: "100%" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h4 className="card-title mb-4 text-center fw-bold">Cập nhật chi nhánh</h4>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tên chi nhánh</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tỉnh/Thành phố</label>
                            <select
                                className="form-select"
                                name="province"
                                value={form.province}
                                onChange={handleProvinceChange}
                                required
                            >
                                <option value="" disabled>Chọn</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.name} data-id={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Quận/Huyện</label>
                            <select
                                className="form-select"
                                name="district"
                                value={form.district}
                                onChange={handleDistrictChange}
                                required
                            >
                                <option value="" disabled>Chọn</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.name} data-id={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Phường/Xã</label>
                            <select
                                className="form-select"
                                name="ward"
                                value={form.ward}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="" disabled>Chọn</option>
                                {wards.map((w) => (
                                    <option key={w.id} value={w.name} data-id={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Tên đường</label>
                            <input
                                type="text"
                                className="form-control"
                                name="street"
                                value={form.street}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Trạng thái</label>
                            <select
                                className="form-select"
                                name="status"
                                value={form.status}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="INACTIVE">Không hoạt động</option>
                                <option value="ACTIVE">Hoạt động</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Loại</label>
                            <input
                                type="text"
                                className="form-control"
                                name="status"
                                value={form.type}
                                onChange={handleFormChange}
                                required
                                readOnly={true}
                            />

                        </div>

                        <button type="submit" className="btn btn-primary w-100 fw-semibold mb-2">
                            Lưu chi nhánh
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary w-100 fw-semibold"
                            onClick={() => navigate("/admin/branch")}
                        >
                            Hủy
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailBranchPage;
