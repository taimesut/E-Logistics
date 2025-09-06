import React, {useCallback, useContext, useEffect, useState} from 'react';
import LocationApi from "../../services/LocationApi.js";
import CustomerApi from "./CustomerApi.js";
import {toast} from "react-toastify";
import Spinner from "../../componets/Spinner.jsx";
import PublicApi from "../public/PublicApi.js";
import {AuthContext} from "../../contexts/auth/AuthContext.jsx";

const CustomerParcelNewPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAddressSaved, setIsAddressSaved] = useState(false);
    const {state} = useContext(AuthContext);
    const [form, setForm] = useState({
        fromName: "",
        fromPhone: "",
        fromStreet: "",
        fromWard: "",
        fromDistrict: "",
        fromProvince: "",
        
        toName: "",
        toPhone: "",
        toStreet: "",
        toWard: "",
        toDistrict: "",
        toProvince: "",
        
        weight: 0.1,
        length: 1,
        width: 1,
        height: 1,
    })
    const [provinces, setProvinces] = useState([]);

    const [fromDistricts, setFromDistricts] = useState([]);
    const [fromWards, setFromWards] = useState([]);

    const [toDistricts, setToDistricts] = useState([]);
    const [toWards, setToWards] = useState([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res);
            } catch (err) {
                console.error("Lỗi lấy tỉnh:", err);
            }
            finally {
                setIsLoading(false);
            }
        }
        fetchProvinces();
    }, []);

    const handleFromProvinceChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === 'success') {
                setFromDistricts(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    fromDistrict: '',
                    fromWard: '',
                }))
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFromWards([]);
        }
    }
    const handleFromDistrictChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setFromWards(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    fromWard: '',
                }))
            }
        } catch (err) {
            console.error(err);
        }
    }
    const handleToProvinceChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getDistricts(id);
            if (res.code === 'success') {
                setToDistricts(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    toDistrict: '',
                    toWard: '',
                }))
            }
        } catch (err) {
            console.error(err);
        } finally {
            setToWards([]);
        }
    }
    const handleToDistrictChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setToWards(res.data);
                setForm((prevState) => ({
                    ...prevState,
                    [name]: value,
                    toWard: '',
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


    const handleInputLimit = (e, min = 0, max = 50) => {
        let value = e.target.value;
        if (value > max) {
            e.target.value = max;
        }
        if (value < min) {
            e.target.value = min;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...form };

        if (isAddressSaved) {
            if (!state.user.province) {
                toast.error("Vui lòng cập nhật địa chỉ");
                setIsAddressSaved(false);
                return;
            }
            payload = {
                ...payload,
                fromStreet: state.user.address,
                fromWard: state.user.ward,
                fromDistrict: state.user.district,
                fromProvince: state.user.province,
            };
        }

        try {
            setIsLoading(true);
            const response = await CustomerApi.createParcel(payload);
            toast.success("Tạo thành công");
            setForm({
                fromName: "",
                fromPhone: "",
                fromStreet: "",
                fromWard: "",
                fromDistrict: "",
                fromProvince: "",

                toName: "",
                toPhone: "",
                toStreet: "",
                toWard: "",
                toDistrict: "",
                toProvince: "",

                weight: 0.1,
                length: 1,
                width: 1,
                height: 1,
            })
        } catch (err) {
            console.error(err?.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    }

    const [checkFeeData, setCheckFeeData] = useState({
        shippingFee: 0,
        weightChargeable: 0,
    });

    const fetchCheckFee = useCallback(async () => {
        try {

            const data = {
                weight: form.weight,
                length: form.length,
                width: form.width,
                height: form.height,
                fromProvince: form.fromProvince,
                toProvince: form.toProvince,
            };
            const response = await PublicApi.check(data);
            setCheckFeeData(response.data.data);
        } catch (err) {
            console.error(err?.response?.data?.message || "Lỗi không xác định");
        }
    }, [form.weight, form.length, form.width, form.height, form.fromProvince, form.toProvince]);

    useEffect(() => {
        fetchCheckFee();
    }, [fetchCheckFee])

    if (isLoading) {
        return <Spinner/>
    }

    return (
        <div className="d-flex align-items-center justify-content-center py-5 bg-light">
            <div className="card p-4 shadow" style={{maxWidth: '1200px'}}>
                <h3 className="mb-3 text-center">Tạo đơn</h3>
                <form className="p-4 border rounded bg-light" onSubmit={handleFormSubmit}>
                    <h5 className="mb-3">Thông tin người gửi</h5>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Họ tên người gửi</label>
                            <input type="text" className="form-control" name="fromName"
                                   onChange={handleFormChange} value={form.fromName} placeholder="Nguyễn Văn A"
                                   required/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Số điện thoại người gửi</label>
                            <input type="text" className="form-control" name="fromPhone"
                                   onChange={handleFormChange} value={form.fromPhone} placeholder="0123456789"
                                   required/>
                        </div>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={isAddressSaved}
                            onChange={(e)=>setIsAddressSaved(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                            Dùng địa chỉ đã lưu
                        </label>
                    </div>
                    {!isAddressSaved && <>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ cụ thể</label>
                            <input type="text" className="form-control" name="fromStreet" onChange={handleFormChange}
                                   value={form.fromStreet} placeholder="123 đường ABC..." required/>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Tỉnh/Thành phố</label>
                                <select className="form-control" name="fromProvince"
                                        onChange={handleFromProvinceChange} value={form.fromProvince} required>
                                    <option disabled value={""}>Chọn</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.name}
                                                data-id={province.id}>{province.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Quận/Huyện</label>
                                <select className="form-control" name="fromDistrict"
                                        onChange={handleFromDistrictChange} value={form.fromDistrict} required>
                                    <option disabled value={""}>Chọn</option>
                                    {fromDistricts.map((district) => (
                                        <option key={district.id} value={district.name}
                                                data-id={district.id}>{district.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Phường/Xã</label>
                                <select className="form-control" name="fromWard" onChange={handleFormChange}
                                        value={form.fromWard} required>
                                    <option disabled value={""}>Chọn</option>
                                    {fromWards.map((ward) => (
                                        <option key={ward.id} value={ward.name} data-id={ward.id}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </>}


                    <h5 className="mt-4 mb-3">Thông tin người nhận</h5>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Họ tên người nhận</label>
                            <input type="text" className="form-control" name="toName"
                                   onChange={handleFormChange} value={form.toName} required/>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Số điện thoại người nhận</label>
                            <input type="text" className="form-control" name="toPhone"
                                   onChange={handleFormChange} value={form.toPhone} required/>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ cụ thể</label>
                        <input type="text" className="form-control" name="toStreet"
                               onChange={handleFormChange} value={form.toStreet} required/>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Tỉnh/Thành phố</label>
                            <select className="form-control" name="toProvince"
                                    onChange={handleToProvinceChange} value={form.toProvince} required>
                                <option disabled value={""}>Chọn</option>
                                {provinces.map((province) => (
                                    <option key={province.id} value={province.name}
                                            data-id={province.id}>{province.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Quận/Huyện</label>
                            <select className="form-control" name="toDistrict"
                                    onChange={handleToDistrictChange} value={form.toDistrict} required>
                                <option disabled value={""}>Chọn</option>
                                {toDistricts.map((district) => (
                                    <option key={district.id} value={district.name}
                                            data-id={district.id}>{district.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Phường/Xã</label>
                            <select className="form-control" name="toWard" value={form.toWard}
                                    onChange={handleFormChange} required>
                                <option disabled value={""}>Chọn</option>
                                {toWards.map((ward) => (
                                    <option key={ward.id} value={ward.name} data-id={ward.id}>{ward.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <h5 className="mt-4 mb-3">Thông tin kiện hàng</h5>
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label className="form-label">Khối lượng (kg)</label>
                            <input type="number" step="0.1" className="form-control" name="weight"
                                   value={form.weight} required onChange={handleFormChange}
                                   onInput={(e) => handleInputLimit(e, 0.1, 20)}/>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Chiều dài (cm)</label>
                            <input type="number" step="1" className="form-control" name="length" value={form.length}
                                   required onChange={handleFormChange}
                                   onInput={(e) => handleInputLimit(e, 1, 30)}/>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Chiều rộng (cm)</label>
                            <input type="number" step="1" className="form-control" name="width" value={form.width}
                                   required onChange={handleFormChange}
                                   onInput={(e) => handleInputLimit(e, 1, 30)}/>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Chiều cao (cm)</label>
                            <input type="number" step="1" className="form-control" name="height" value={form.height}
                                   required onChange={handleFormChange}
                                   onInput={(e) => handleInputLimit(e, 1, 30)}/>
                        </div>
                    </div>
                    <h5 className="mt-4 mb-3">Ước tính chi phí</h5>
                    <div className="row mb-3">
                        <span>Khối lượng tính phí: {checkFeeData.weightChargeable}</span>
                        <span>Tổng chi phí: {checkFeeData.shippingFee}</span>
                    </div>

                    <div className="d-grid mt-4">
                        <button className="btn btn-primary">Gửi đơn hàng</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerParcelNewPage;