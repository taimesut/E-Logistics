import React, { useEffect, useState } from 'react';
import LocationApi from "../services/LocationApi.js";
import Spinner from "./Spinner.jsx";

const FormAddress = ({ value, setValue }) => {
    // value = { ward, district, province }
    // setValue = function để set state form

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Lấy tỉnh khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const res = await LocationApi.getProvinces();
                setProvinces(res.data || res || []);
            } catch (err) {
                console.error("Lỗi lấy tỉnh:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProvinces();
    }, []);

    // Khi chọn tỉnh
    const handleProvinceChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption?.getAttribute('data-id');

        try {
            setIsLoading(true);
            const res = await LocationApi.getDistricts(id);
            if (res?.code === 'success') {
                setDistricts(res.data || []);
                setWards([]);
                setValue({ ...value, province: e.target.value, district: '', ward: '' });
            }
        } catch (err) {
            console.error(err);
            setDistricts([]);
            setWards([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Khi chọn quận/huyện
    const handleDistrictChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption?.getAttribute('data-id');

        try {
            setIsLoading(true);
            const res = await LocationApi.getWards(id);
            if (res?.code === 'success') {
                setWards(res.data || []);
                setValue({ ...value, district: e.target.value, ward: '' });
            }
        } catch (err) {
            console.error(err);
            setWards([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="row mb-3">
            <div className="col-md-4">
                <label className="form-label">Tỉnh/Thành phố</label>
                <select
                    className="form-control"
                    value={value.province || ''}
                    onChange={handleProvinceChange}
                    required
                >
                    <option disabled value="">
                        Chọn
                    </option>
                    {provinces?.map((province) => (
                        <option key={province.id} value={province.name} data-id={province.id}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-4">
                <label className="form-label">Quận/Huyện</label>
                <select
                    className="form-control"
                    value={value.district || ''}
                    onChange={handleDistrictChange}
                    required
                >
                    <option disabled value="">
                        Chọn
                    </option>
                    {districts?.map((district) => (
                        <option key={district.id} value={district.name} data-id={district.id}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-4">
                <label className="form-label">Phường/Xã</label>
                <select
                    className="form-control"
                    value={value.ward || ''}
                    onChange={(e) => setValue({ ...value, ward: e.target.value })}
                    required
                >
                    <option disabled value="">
                        Chọn
                    </option>
                    {wards?.map((ward) => (
                        <option key={ward.id} value={ward.name}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default FormAddress;
