import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import LocationApi from "../../../services/LocationApi.js";
import {toast} from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminBranchUpdate = () => {
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
                const res = await MyApi.getBranchById(id);
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
            const res = await MyApi.updateBranch(id, form);
            toast.success("Cập nhật chi nhánh thành công");
            setForm(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi khi cập nhật chi nhánh");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        <Spinner/>
    }

    return (
        <div className="container-fluid py-5">
            <div className="card shadow mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-body">
                    <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                        ← Quay lại
                    </button>
                    <h4 className="card-title mb-4 text-center fw-bold">Cập nhật chi nhánh</h4>

                    <form onSubmit={handleFormSubmit}>
                        <table className="table table-bordered table-striped align-middle">
                            <tbody>
                            <tr>
                                <th className="w-25">Tên chi nhánh</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={form.name || ""}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Tỉnh/Thành phố</th>
                                <td>
                                    <select
                                        className="form-select"
                                        name="province"
                                        value={form.province || ""}
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
                                </td>
                            </tr>
                            <tr>
                                <th>Quận/Huyện</th>
                                <td>
                                    <select
                                        className="form-select"
                                        name="district"
                                        value={form.district || ""}
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
                                </td>
                            </tr>
                            <tr>
                                <th>Phường/Xã</th>
                                <td>
                                    <select
                                        className="form-select"
                                        name="ward"
                                        value={form.ward || ""}
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
                                </td>
                            </tr>
                            <tr>
                                <th>Tên đường</th>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="street"
                                        value={form.street || ""}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Trạng thái</th>
                                <td>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={form.status || ""}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="INACTIVE">Không hoạt động</option>
                                        <option value="ACTIVE">Hoạt động</option>
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <div className="d-flex flex-column gap-2 mt-3">
                            <button type="submit" className="btn btn-primary fw-semibold">
                                Lưu chi nhánh
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary fw-semibold"
                                onClick={() => navigate(-1)}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default AdminBranchUpdate;