import React, {useEffect, useState} from 'react';
import ShipperApi from "./ShipperApi.js";
import Spinner from "../../componets/Spinner.jsx";
import {useLocation, useNavigate} from "react-router-dom";

const ShipperParcelPage = () => {
    const [parcels, setParcels] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchKw, setSearchKw] = React.useState("");

    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";

    const fetchParcels = async () => {
        try{
            setIsLoading(true);
            if(type==="PICKUP"){
                const res = await ShipperApi.getParcels(page,size,status,type,search);
                setParcels(res.data.data.data);
                setTotalPages(res.data.data.totalPages);
            } else if(type==="DELIVERY"){
                const res = await ShipperApi.getParcels(page,size,status,type,search);
                setParcels(res.data.data.data);
                setTotalPages(res.data.data.totalPages);
            }

        }catch(error){
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchParcels();
    }, [page,type,status,search]);

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "";
        const dt = new Date(dateTimeStr);
        return dt.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    if(isLoading){
        return <Spinner/>
    }

    return (
        <div className="container py-5">
            <h3 className="mb-4 text-center">Danh sách đơn hàng</h3>

            <div className="mb-3">
                <label htmlFor="search" className="form-label">Tìm kiếm</label>
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    name="search"
                    value={searchKw}
                    onChange={(e)=>setSearchKw(e.target.value)}
                />
                <button
                    type="button"
                    className="btn btn-primary mt-2"
                    onClick={()=>navigate(`/shipper/parcel?type=${type}&status=${status}&search=${searchKw}`)}
                >
                    Tìm
                </button>
            </div>

            {parcels.length > 0 && (status === "PICKUP_IN_PROGRESS"||status === "DELIVERY_IN_PROGRESS") &&
                <div className={"btn btn-primary m-2"}
                     onClick={() => navigate(`/shipper/map-markers?status=${status}&type=${status === "PICKUP_IN_PROGRESS"?"pickup":"delivery"}`)}>Xem tất cả trong bản đồ</div>
            }


            <div className="table-responsive shadow rounded bg-white">
                <table className="table table-striped table-bordered table-hover mb-0">
                    <thead className="table-light">
                    <tr>
                        <th>STT</th>
                        <th>Tracking</th>
                        <th>Người gửi</th>
                        <th>Người nhận</th>
                        <th>Trạng thái</th>
                        <th>Cập nhật</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {parcels.length === 0 &&
                        <tr>
                            <td colSpan={9} className="text-center py-3">
                                Không có đơn hàng
                            </td>
                        </tr>
                    }
                    {parcels.map((parcel, index) => (
                        <tr key={parcel.id}>
                            <td>{index + 1}</td>
                            <td>{parcel.id}</td>
                            <td style={{ minWidth: "160px" }}>
                                <div><strong>Tên:</strong> {parcel.fromName}</div>
                                <div><strong>SĐT:</strong> {parcel.fromPhone}</div>
                                <div>
                                    <strong>Địa chỉ:</strong>{" "}
                                    {parcel.fromStreet}, {parcel.fromWard}, {parcel.fromDistrict},{" "}
                                    {parcel.fromProvince}
                                </div>
                            </td>
                            <td style={{ minWidth: "160px" }}>
                                <div><strong>Tên:</strong> {parcel.toName}</div>
                                <div><strong>SĐT:</strong> {parcel.toPhone}</div>
                                <div>
                                    <strong>Địa chỉ:</strong>{" "}
                                    {parcel.toStreet}, {parcel.toWard}, {parcel.toDistrict},{" "}
                                    {parcel.toProvince}
                                </div>
                            </td>
                            <td>{parcel.status}</td>
                            <td>{formatDateTime(parcel.updateAt)}</td>
                            <td>
                                <div
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/shipper/parcel/${parcel.id}`)}
                                >
                                    Xem chi tiết
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {parcels.length > 0 &&
                    <div className="d-flex justify-content-between mt-3">
                        <button
                            className="btn btn-secondary"
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Trước
                        </button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <button
                            className="btn btn-secondary"
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Sau
                        </button>
                    </div>
                }

            </div>
        </div>
    );
};

export default ShipperParcelPage;