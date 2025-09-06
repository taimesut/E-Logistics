import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Spinner from "../../componets/Spinner.jsx";
import ShipperApi from "./ShipperApi.js";
import PublicApi from "../public/PublicApi.js";
import GetStatusDescription from "../../helpers/ConvertStatus.js";
import {toast} from "react-toastify";

const ShipperDetailParcelPage = () => {
    const { id } = useParams(); // lấy id từ URL
    const [parcel, setParcel] = useState();
    const [tracking, setTracking] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [imagesParcel, setImagesParcel] = useState([]);

    const fetchParcel = async () => {
        try {
            setIsLoading(true);
            const response = await ShipperApi.getParcel(id); // API lấy 1 đơn theo id
            setParcel(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchImagesParcel = async () => {
        try {
            setIsLoading(true);
            const response = await PublicApi.getImagesParcel(id);
            setImagesParcel(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }
    const fetchTracking = async () => {
        try {
            setIsLoading(true);
            const response = await PublicApi.tracking(id); // API lấy 1 đơn theo id
            setTracking(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchParcel();
        fetchTracking();
        fetchImagesParcel();
    }, [id]);
    const handleFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 3) {
            toast.error("Chỉ được upload tối đa 3 ảnh");
            return;
        }
        setFiles(selectedFiles);
        setPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
    };
    const handleUpload = async () => {
        if (!files.length) {
            toast.error("Vui lòng chọn file để upload");
            return;
        }

        const formData = new FormData();
        files.forEach(f => formData.append("files", f));
        formData.append("parcelId", id);
        if(parcel.status === "PICKUP_IN_PROGRESS") {
            formData.append("type", "PICKUP");
        }else if(parcel.status === "DELIVERY_IN_PROGRESS") {
            formData.append("type", "DELIVERY");
        }else{
            return;
        }

        try {
            setIsLoading(true);
            await ShipperApi.uploadImages(formData);
            setFiles([]);
            setPreviews([]);
        } catch (err) {
            console.error(err);
        }finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!parcel) {
        return (
            <div className="container py-5">
                <p className="text-center">Không tìm thấy đơn hàng</p>
            </div>
        );
    }

    const handleOpenMap = async (lat, lng) => {
        navigate(`/shipper/map-marker?lat=${lat}&lng=${lng}`)
    }

    const handleUpdateStatus = async (status) => {
        try {
            setIsLoading(true);
            if(status==="PICKUP_SUCCESS" || status==="DELIVERED"){
                if(files.length<=0){
                    toast.error("Chọn ảnh trước khi thực hiện thao tác");
                    return;
                }
            }
            handleUpload();
            const response = await ShipperApi.updateStatusParcel(id,status);
            setParcel(response.data.data);
            fetchTracking();
            toast.success("Cập nhật đơn hàng thành công")
        } catch (err) {
            console.error(err);
            toast.success("Cập nhật đơn hàng thất bại")
        } finally {
            setIsLoading(false);
        }
    }
    const failedCountPickup = tracking.filter(
        item => item.status === "PICKUP_FAILED"
    ).length;
    const failedCountDelivery = tracking.filter(
        item => item.status === item.status === "DELIVERY_FAILED"
    ).length;

    return (
        <div className="container py-5">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <h3 className="mb-4 text-center">Chi tiết đơn hàng</h3>

            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">Mã Tracking: {parcel.id}</h5>
                    <p><strong>Trạng thái:</strong> {GetStatusDescription(parcel.status)}</p>
                    <p><strong>Ngày cập nhật:</strong> {new Date(parcel.updateAt).toLocaleString("vi-VN")}</p>

                    <hr />
                    <h6>Người gửi</h6>
                    <p><strong>Tên:</strong> {parcel.fromName}</p>
                    <p><strong>SĐT:</strong> {parcel.fromPhone}</p>
                    <p><strong>Địa chỉ:</strong> {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict}, {parcel.fromProvince}</p>
                    <button className="btn btn-secondary mb-3" onClick={()=>handleOpenMap(parcel.fromLat,parcel.fromLng)}>
                        Xem vị trí
                    </button>

                    <hr />
                    <h6>Người nhận</h6>
                    <p><strong>Tên:</strong> {parcel.toName}</p>
                    <p><strong>SĐT:</strong> {parcel.toPhone}</p>
                    <p><strong>Địa chỉ:</strong> {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict}, {parcel.toProvince} </p>
                    <button className="btn btn-secondary mb-3" onClick={()=>handleOpenMap(parcel.toLat,parcel.toLng)}>
                        Xem vị trí
                    </button>

                    <hr />
                    <h6>Thông tin gói hàng</h6>
                    <p><strong>Kích thước:</strong> {parcel.length} x {parcel.width} x {parcel.height}</p>
                    <p><strong>Khối lượng:</strong> {parcel.weight} kg</p>
                    <p><strong>Khối lượng tính:</strong> {parcel.weightChargeable} kg</p>
                    <p><strong>Phí vận chuyển:</strong> {parcel.shippingFee.toLocaleString("vi-VN")} đ</p>

                    {(parcel.status === "PICKUP_IN_PROGRESS" || parcel.status === "DELIVERY_IN_PROGRESS") && (
                        <>
                            <hr/>
                            <h6>Upload hình ảnh</h6>
                            <div className="container">
                                <div className="mb-3">
                                    <input
                                        type="file"
                                        id="files"
                                        className="form-control"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFilesChange}
                                    />
                                </div>
                                {previews.length > 0 && (
                                    <div className="mb-3 d-flex gap-2 flex-wrap">
                                        {previews.map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt={`preview-${idx}`}
                                                style={{ width: 100, height: 100, objectFit: "cover", border: "1px solid #ccc", borderRadius: 4 }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {imagesParcel?.filter(img => img.type === "PICKUP").length > 0 && (
                        <>
                            <hr />
                            <h6>Ảnh lấy hàng</h6>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                {imagesParcel
                                    .filter(img => img.type === "PICKUP")
                                    .map(img => (
                                        <img
                                            key={img.id}
                                            src={img.url}
                                            alt={`pickup-${img.id}`}
                                            style={{ width: 100, height: 100, objectFit: "cover", border: "1px solid #ccc", borderRadius: 4 }}
                                        />
                                    ))}
                            </div>
                        </>
                    )}

                    {imagesParcel?.filter(img => img.type === "DELIVERY").length > 0 && (
                        <>
                            <hr />
                            <h6>Ảnh giao hàng</h6>
                            <div className="d-flex gap-2 flex-wrap mb-3">
                                {imagesParcel
                                    .filter(img => img.type === "DELIVERY")
                                    .map(img => (
                                        <img
                                            key={img.id}
                                            src={img.url}
                                            alt={`delivery-${img.id}`}
                                            style={{ width: 100, height: 100, objectFit: "cover", border: "1px solid #ccc", borderRadius: 4 }}
                                        />
                                    ))}
                            </div>
                        </>
                    )}


                    <hr/>
                    <h6>Tracking</h6>
                    {tracking.map(item => (
                        <li
                            key={item.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{item.description}</strong>
                                <div className="text-muted small">Trạng thái: {item.status}</div>
                            </div>
                            <span className="badge bg-primary rounded-pill">
                                        {new Date(item.updateAt).toLocaleString("vi-VN")}
                                    </span>
                        </li>
                    ))}
                    <hr/>
                    {parcel.status === "DELIVERY_IN_PROGRESS" && <>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("DELIVERED")}>
                            Giao thanh cong
                        </button>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("DELIVERY_FAILED")}>
                            Giao that bai
                        </button>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("RETURNED")}>
                            Hoan tra
                        </button>
                    </>}
                    {parcel.status === "PICKUP_IN_PROGRESS" && <>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("PICKUP_SUCCESS")}>
                            Lay thanh cong
                        </button>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("PICKUP_FAILED")}>
                            Lay that bai
                        </button>
                    </>}
                    {parcel.status === "PICKUP_FAILED" && failedCountPickup < 3 &&<>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("PICKUP_IN_PROGRESS")}>
                            Lay lai
                        </button>
                    </>}
                    {parcel.status === "DELIVERY_FAILED" && failedCountDelivery < 3 &&<>
                        <button className="btn btn-secondary mb-3 me-2" onClick={()=>handleUpdateStatus("DELIVERY_IN_PROGRESS")}>
                            Giao lai
                        </button>
                    </>}
                </div>

            </div>
        </div>
    );
};

export default ShipperDetailParcelPage;