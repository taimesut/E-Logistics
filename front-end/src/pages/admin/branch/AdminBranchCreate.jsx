import React, {useEffect, useState} from 'react';
import LocationApi from "../../../services/LocationApi.js";
import {toast} from "react-toastify";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const AdminBranchCreate = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({
        name: "",
        province: "",
        district: "",
        ward: "",
        street: "",
        status:"ACTIVE"
    })

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res);
            } catch (err) {
                console.error("Lỗi lấy tỉnh:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === 'success') {
                setDistricts(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    district: '',
                    ward: '',
                }))
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWards([]);
        }
    }

    const handleDistrictChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setWards(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    ward: '',
                }))
            }
        } catch (err) {
            console.error(err);
        }
    }

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
            await MyApi.createBranch(form);
            toast.success("Tao chi nhánh thành công");
            setForm({
                name: "",
                province: "",
                district: "",
                ward: "",
                street: "",
                status: "ACTIVE",
            })
        } catch (err) {
            console.error(err);
            toast.error("Lỗi tạo khi tạo chi nhánh");
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
                    <h4 className="card-title mb-4 text-center fw-bold">Tạo chi nhánh</h4>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tên chi nhánh</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                onChange={handleFormChange}
                                value={form.name}
                                placeholder="Nhập tên chi nhánh"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Tỉnh/Thành phố</label>
                            <select
                                className="form-select"
                                name="province"
                                onChange={handleProvinceChange}
                                value={form.province}
                                required
                            >
                                <option disabled value="">Chọn</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.name} data-id={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Quận/Huyện</label>
                            <select
                                className="form-select"
                                name="district"
                                onChange={handleDistrictChange}
                                value={form.district}
                                required
                            >
                                <option disabled value="">Chọn</option>
                                {districts.map((district) => (
                                    <option key={district.id} value={district.name} data-id={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Phường/Xã</label>
                            <select
                                className="form-select"
                                name="ward"
                                onChange={handleFormChange}
                                value={form.ward}
                                required
                            >
                                <option disabled value="">Chọn</option>
                                {wards.map((ward) => (
                                    <option key={ward.id} value={ward.name} data-id={ward.id}>
                                        {ward.name}
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
                                onChange={handleFormChange}
                                value={form.street}
                                placeholder="123 đường ABC..."
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 fw-semibold">
                            Tạo chi nhánh
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default AdminBranchCreate;