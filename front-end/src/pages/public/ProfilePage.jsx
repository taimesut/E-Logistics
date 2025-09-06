import React, {useState, useContext, useEffect} from "react";
import { AuthContext } from "../../contexts/auth/AuthContext.jsx";
import Spinner from "../../componets/Spinner.jsx";
import { toast } from "react-toastify";
import PublicApi from "./PublicApi.js";
import LocationApi from "../../services/LocationApi.js";

const ProfilePage = () => {
    const { state, dispatch } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(state.user.avatar || null);
    const [isUploading, setIsUploading] = useState(false);

    const [formAddress, setFormAddress] = useState({
        address:state.user.address || "",
        ward:state.user.ward || "",
        district:state.user.district || "",
        province:state.user.province || ""
    })

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    if (!state.isAuthenticated) {
        return <Spinner />;
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }
        try {
            const response = await PublicApi.ChangePassword(oldPassword, newPassword);
            toast.success(response.data.message);
        } catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message || "Lỗi server");
        } finally {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", avatarFile);

        try {
            const res = await PublicApi.UploadAvatar(formData);
            toast.success("Upload avatar thành công!");
            state.user.avatar = res.data.data.avatar;
            setAvatarPreview(res.data.data.avatar);
            setAvatarFile(null);
        } catch (err) {
            console.log(err);
            toast.error("Upload thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setIsLoading(true);
                const res = await LocationApi.getProvinces();
                const provs = res.data || res;
                setProvinces(provs);

                if (state.user.province) {
                    const provinceItem = provs.find(p => p.name === state.user.province);
                    if (provinceItem) {
                        const resDistricts = await LocationApi.getDistricts(provinceItem.id);
                        if (resDistricts.code === 'success') {
                            setDistricts(resDistricts.data);

                            if (state.user.district) {
                                const districtItem = resDistricts.data.find(d => d.name === state.user.district);
                                if (districtItem) {
                                    const resWards = await LocationApi.getWards(districtItem.id);
                                    if (resWards.code === 'success') {
                                        setWards(resWards.data);
                                    }
                                }
                            }
                        }
                    }
                }

            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

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
                setDistricts(res.data);
                setFormAddress((prevState) => ({
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
    const handleFromDistrictChange = async (e) => {
        const selectedOption = e.target.selectedOptions[0];
        const id = selectedOption.getAttribute('data-id');
        const name = e.target.name;
        const value = e.target.value;

        try {
            const res = await LocationApi.getWards(id);
            if (res.code === 'success') {
                setWards(res.data);
                setFormAddress((prevState) => ({
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
        setFormAddress((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeAddressSubmit = async (e) => {
        e.preventDefault();
        try{
            setIsLoading(true);
            const res = await PublicApi.updateAddress(formAddress.address,formAddress.ward,formAddress.district,formAddress.province);

            toast.success(res.data.message);

            dispatch({
                type: 'UPDATE_USER',
                payload: {
                    address: formAddress.address,
                    ward: formAddress.ward,
                    district: formAddress.district,
                    province: formAddress.province
                }
            });

        }catch(err){
            console.log(err);
            toast.error(err.response?.data?.message || "Lỗi server");
        }finally {
            setIsLoading(false);
        }
    }


    if(isLoading){
        return <Spinner />;
    }

    return (
        <div className="container mt-5 mb-5">
            {/* ----- User Info Card ----- */}
            <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-header bg-primary text-white rounded-top-4 py-3">
                    <h4 className="mb-0">
                        <i className="bi bi-person-circle me-2"></i>
                        Thông tin cá nhân
                    </h4>
                </div>
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4 gap-3 justify-content-between">
                        {/* User basic info */}
                        <div>
                            <h3 className="mb-1">{state.user.fullName}</h3>
                            <p className="text-muted mb-0">@{state.user.username}</p>
                        </div>

                        {/* Avatar */}
                        <div className="d-flex flex-column align-items-center">
                            <div
                                className="rounded-circle bg-light border d-flex justify-content-center align-items-center shadow-sm"
                                style={{ width: "90px", height: "90px", fontSize: "30px" }}
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="avatar"
                                        className="rounded-circle"
                                        style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                    />
                                ) : (
                                    state.user.fullName?.charAt(0).toUpperCase() || "U"
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="form-control form-control-sm mt-2"
                            />
                            <button
                                className="btn btn-sm btn-primary mt-1 w-100"
                                onClick={handleAvatarUpload}
                                disabled={isUploading || !avatarFile}
                            >
                                {isUploading ? "Đang thay đổi..." : "Đổi avatar"}
                            </button>
                        </div>
                    </div>


                    <div className="d-flex flex-column gap-3">
                        <div className="p-3 border rounded-3 bg-light">
                            <small className="text-muted">User ID</small>
                            <p className="mb-0 fw-semibold">{state.user.id}</p>
                        </div>

                        {state.user.role !== "ROLE_CUSTOMER" && (
                            <div className="p-3 border rounded-3 bg-light">
                                <small className="text-muted">Branch Work ID</small>
                                <p className="mb-0 fw-semibold">
                                    {state.user.branchWorkId || "Not provided"}
                                </p>
                            </div>
                        )}

                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center">
                            <i className="bi bi-envelope text-primary me-2"></i>
                            <div>
                                <small className="text-muted">Email</small>
                                <p className="mb-0 fw-semibold">
                                    {state.user.email || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="p-3 border rounded-3 bg-light d-flex align-items-center">
                            <i className="bi bi-telephone text-success me-2"></i>
                            <div>
                                <small className="text-muted">Phone</small>
                                <p className="mb-0 fw-semibold">
                                    {state.user.phone || "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-header bg-secondary text-white rounded-top-4 py-3">
                    <h5 className="mb-0">
                        <i className="bi bi-shield-lock me-2"></i>
                        Đổi địa chỉ
                    </h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleChangeAddressSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ cụ thể</label>
                            <input type="text" className="form-control" name="address" onChange={handleFormChange}
                                   value={formAddress.address} placeholder="123 đường ABC..." required/>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Tỉnh/Thành phố</label>
                                <select className="form-control" name="province"
                                        onChange={handleFromProvinceChange} value={formAddress.province} required>
                                    <option disabled value={""}>Chọn</option>
                                    {provinces.map((province) => (
                                        <option key={province.id} value={province.name}
                                                data-id={province.id}>{province.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Quận/Huyện</label>
                                <select className="form-control" name="district"
                                        onChange={handleFromDistrictChange} value={formAddress.district} required>
                                    <option disabled value={""}>Chọn</option>
                                    {districts.map((district) => (
                                        <option key={district.id} value={district.name}
                                                data-id={district.id}>{district.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Phường/Xã</label>
                                <select className="form-control" name="ward" onChange={handleFormChange}
                                        value={formAddress.ward} required>
                                    <option disabled value={""}>Chọn</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.name} data-id={ward.id}>{ward.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            <i className="bi bi-key me-2"></i>
                            Đổi địa chỉ
                        </button>
                    </form>
                </div>
            </div>

            {/* ----- Change Password Card ----- */}
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-header bg-secondary text-white rounded-top-4 py-3">
                    <h5 className="mb-0">

                        Đổi mật khẩu
                    </h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu cũ</label>
                            <input
                                type="password"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Nhập lại mật khẩu mới</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            <i className="bi bi-key me-2"></i>
                            Đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
