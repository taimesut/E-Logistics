import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerApi from "./CustomerApi.js";
import Spinner from "../../componets/Spinner.jsx"
import ManagerApi from "../manager/ManagerApi.js";
import {toast} from "react-toastify";
import PublicApi from "../public/PublicApi.js";

const CustomerParcelDetailPage = () => {
    const { id } = useParams(); // lấy id từ URL
    const [parcel, setParcel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [shipperPickup, setShipperPickup] = useState(null);
    const [shipperDelivery, setShipperDelivery] = useState(null);
    const [tracking,setTracking] = useState([]);
    const [imagesParcel, setImagesParcel] = useState([]);
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
            const response = await PublicApi.tracking(id);
            setTracking(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await CustomerApi.getParcelById(id); // API lấy 1 đơn theo id
            setParcel(response.data.data);
            if (response.data.data?.pickupShipperId?.length > 0) {
                try {
                    setIsLoading(true);
                    const response2 = await CustomerApi.getShipper(response.data.data.pickupShipperId);
                    setShipperPickup(response2.data.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
            if (response.data.data?.deliveryShipperId?.length > 0) {
                try {
                    setIsLoading(true);
                    const response2 = await CustomerApi.getShipper(response.data.data.deliveryShipperId);
                    setShipperDelivery(response2.data.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchTracking();
        fetchImagesParcel();
    }, [id]);

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
    const handleHuyDon = async () => {
        if(parcel.status === "CREATED" ||parcel.status === "DELIVERY_IN_PROGRESS") {
            try {
                setIsLoading(true);
                const response2 = await CustomerApi.cancelParcel(id);
                setParcel(response2.data.data);
                toast.success("Huy don hang thanh cong");
                fetchTracking();
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        else if (parcel.status === "CANCELLED") {
            toast.success("Don hang da duoc huy");
        }else{
            toast.error("Khong the huy don hang");
        }
    }

    return (
        <div className="container py-5">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <h3 className="mb-4 text-center">Chi tiết đơn hàng</h3>

            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">Mã Tracking: {parcel.id}</h5>
                    <p><strong>Trạng thái:</strong> {parcel.status}</p>
                    <p><strong>Ngày cập nhật:</strong> {new Date(parcel.updateAt).toLocaleString("vi-VN")}</p>

                    <hr />
                    <h6>Người gửi</h6>
                    <p><strong>Tên:</strong> {parcel.fromName}</p>
                    <p><strong>SĐT:</strong> {parcel.fromPhone}</p>
                    <p><strong>Địa chỉ:</strong> {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict}, {parcel.fromProvince}</p>

                    <hr />
                    <h6>Người nhận</h6>
                    <p><strong>Tên:</strong> {parcel.toName}</p>
                    <p><strong>SĐT:</strong> {parcel.toPhone}</p>
                    <p><strong>Địa chỉ:</strong> {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict}, {parcel.toProvince}</p>

                    <hr />
                    <h6>Thông tin gói hàng</h6>
                    <p><strong>Kích thước:</strong> {parcel.length} x {parcel.width} x {parcel.height}</p>
                    <p><strong>Khối lượng:</strong> {parcel.weight} kg</p>
                    <p><strong>Khối lượng tính:</strong> {parcel.weightChargeable} kg</p>
                    <p><strong>Phí vận chuyển:</strong> {parcel.shippingFee.toLocaleString("vi-VN")} đ</p>
                    <hr/>
                    <h6>Thông tin shipper lấy hàng</h6>
                    {!parcel?.pickupShipperId ? (
                        <></>
                    ) : (
                        <>
                            <p><strong>Tên:</strong> {shipperPickup?.fullName}</p>
                            <p><strong>SĐT:</strong> {shipperPickup?.phone}</p>
                        </>
                    )}
                    <hr/>
                    <h6>Thông tin shipper giao hàng</h6>
                    {!parcel?.deliveryShipperId ? (
                        <></>
                    ) : (
                        <>
                            <p><strong>Tên:</strong> {shipperDelivery?.fullName}</p>
                            <p><strong>SĐT:</strong> {shipperDelivery?.phone}</p>
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
                    {
                        parcel.status === "CREATED" ||parcel.status === "DELIVERY_IN_PROGRESS" &&<button className="btn btn-secondary mb-3" onClick={handleHuyDon}>
                            Huy don dang
                        </button>
                    }

                </div>

            </div>
        </div>
    );
};

export default CustomerParcelDetailPage;