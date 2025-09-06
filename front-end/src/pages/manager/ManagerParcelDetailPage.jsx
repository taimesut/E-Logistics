import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import PublicApi from "../public/PublicApi.js";
import Spinner from "../../componets/Spinner.jsx";
import GetStatusDescription from "../../helpers/ConvertStatus.js";
import ManagerApi from "./ManagerApi.js";
import {toast} from "react-toastify";

const ManagerParcelDetailPage = () => {
    const {id} = useParams(); // lấy id từ URL
    const [parcel, setParcel] = useState();
    const [tracking, setTracking] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [shipperId, setShipperId] = useState("");
    const [pickupShippers, setPickupShippers] = useState([]);
    const [deliveryShippers, setDeliveryShippers] = useState([]);
    const [pickupShipper, setPickupShipper] = useState();
    const [deliveryShipper, setDeliveryShipper] = useState();
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
    const fetchParcel = async () => {
        try {
            setIsLoading(true);
            const response = await ManagerApi.getParcel(id);
            setParcel(response.data.data);
            if (response.data.data?.pickupShipperId?.length > 0) {
                try {
                    setIsLoading(true);
                    const response2 = await ManagerApi.getShipper(response.data.data.pickupShipperId);
                    setPickupShipper(response2.data.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                try {
                    setIsLoading(true);
                    const response3 = await ManagerApi.getShippers();
                    setPickupShippers(response3.data.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            }
            if (response.data.data?.deliveryShipperId?.length > 0) {
                try {
                    setIsLoading(true);
                    const response2 = await ManagerApi.getShipper(response.data.data.deliveryShipperId);
                    setDeliveryShipper(response2.data.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            } else {
                try {
                    setIsLoading(true);
                    const response3 = await ManagerApi.getShippers();
                    setDeliveryShippers(response3.data.data);
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


    useEffect(() => {
        fetchParcel();
        fetchTracking();
        fetchImagesParcel();
    }, [id]);


    if (isLoading) {
        return <Spinner/>;
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

    // const failedCount = tracking.filter(
    //     item => item.status === "PICKUP_FAILED" || item.status === "DELIVERY_FAILED"
    // ).length;

    const handleSetShipperPickup = async () => {
        try {
            setIsLoading(true);
            await ManagerApi.setShipper(id, shipperId, "pickup");
            await fetchParcel();
            await fetchTracking();
            toast.success("Gán shipper lấy hàng thành công")
        } catch (err) {
            console.error(err);
            toast.success("Gán shipper lấy hàng thất bại")
        } finally {
            setIsLoading(false);
        }
    }
    const handleSetShipperDelivery = async () => {
        try {
            setIsLoading(true);
            await ManagerApi.setShipper(id, shipperId, "delivery");
            await fetchParcel();
            await fetchTracking();
            toast.success("Gán shipper giao hàng thành công")
        } catch (err) {
            console.error(err);
            toast.success("Gán shipper giao hàng thất bại")
        } finally {
            setIsLoading(false);
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
                    <p><strong>Trạng thái:</strong> {GetStatusDescription(parcel.status)}</p>
                    <p><strong>Ngày cập nhật:</strong> {new Date(parcel.updateAt).toLocaleString("vi-VN")}</p>

                    <hr/>
                    <h6>Người gửi</h6>
                    <p><strong>Tên:</strong> {parcel.fromName}</p>
                    <p><strong>SĐT:</strong> {parcel.fromPhone}</p>
                    <p><strong>Địa
                        chỉ:</strong> {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict}, {parcel.fromProvince}
                    </p>
                    {/*<button className="btn btn-secondary mb-3"*/}
                    {/*        onClick={() => handleOpenMap(parcel.fromLat, parcel.fromLng)}>*/}
                    {/*    Xem vị trí*/}
                    {/*</button>*/}

                    <hr/>
                    <h6>Người nhận</h6>
                    <p><strong>Tên:</strong> {parcel.toName}</p>
                    <p><strong>SĐT:</strong> {parcel.toPhone}</p>
                    <p><strong>Địa
                        chỉ:</strong> {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict}, {parcel.toProvince} </p>
                    {/*<button className="btn btn-secondary mb-3"*/}
                    {/*        onClick={() => handleOpenMap(parcel.toLat, parcel.toLng)}>*/}
                    {/*    Xem vị trí*/}
                    {/*</button>*/}

                    <hr/>
                    <h6>Thông tin gói hàng</h6>
                    <p><strong>Kích thước:</strong> {parcel.length} x {parcel.width} x {parcel.height}</p>
                    <p><strong>Khối lượng:</strong> {parcel.weight} kg</p>
                    <p><strong>Khối lượng tính:</strong> {parcel.weightChargeable} kg</p>
                    <p><strong>Phí vận chuyển:</strong> {parcel.shippingFee.toLocaleString("vi-VN")} đ</p>

                    <hr/>
                    <h6>Thông tin shipper lấy hàng</h6>
                    {!parcel?.pickupShipperId && parcel?.status === "CREATED" ? (
                        <>
                            <div className="d-flex">
                                <select
                                    className="form-select w-auto"
                                    name="ward"
                                    value={shipperId || ""}
                                    onChange={(e) => setShipperId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn</option>
                                    {pickupShippers.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.id} - {w.fullName} - {w.phone}
                                        </option>
                                    ))}
                                </select>
                                <div className="btn btn-primary mx-1" onClick={handleSetShipperPickup}>Xác nhận</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Tên:</strong> {pickupShipper?.fullName}</p>
                            <p><strong>SĐT:</strong> {pickupShipper?.phone}</p>
                        </>
                    )}

                    <hr/>
                    <h6>Thông tin shipper giao hàng</h6>
                    {!parcel?.deliveryShipperId && parcel?.status === "AT_TO_BRANCH" ? (
                        <>
                            <div className="d-flex">
                                <select
                                    className="form-select w-auto"
                                    name="ward"
                                    value={shipperId || ""}
                                    onChange={(e) => setShipperId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn</option>
                                    {deliveryShippers.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            {w.id} - {w.fullName} - {w.phone}
                                        </option>
                                    ))}
                                </select>
                                <div className="btn btn-primary mx-1" onClick={handleSetShipperDelivery}>Xác nhận</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>Tên:</strong> {deliveryShipper?.fullName}</p>
                            <p><strong>SĐT:</strong> {deliveryShipper?.phone}</p>
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

                    {/*<hr/>*/}
                    {/*{parcel.status === "PICKUP_IN_PROGRESS" && <>*/}
                    {/*    <button className="btn btn-secondary mb-3" onClick={()=>handleUpdateStatus("PICKUP_SUCCESS")}>*/}
                    {/*        Lay thanh cong*/}
                    {/*    </button>*/}
                    {/*    <button className="btn btn-secondary mb-3" onClick={()=>handleUpdateStatus("PICKUP_FAILED")}>*/}
                    {/*        Lay that bai*/}
                    {/*    </button>*/}
                    {/*</>}*/}
                    {/*{parcel.status === "PICKUP_FAILED" && failedCount < 3 &&<>*/}
                    {/*    <button className="btn btn-secondary mb-3" onClick={()=>handleUpdateStatus("PICKUP_IN_PROGRESS")}>*/}
                    {/*        Lay lai*/}
                    {/*    </button>*/}
                    {/*</>}*/}
                </div>

            </div>
        </div>
    );
};

export default ManagerParcelDetailPage;