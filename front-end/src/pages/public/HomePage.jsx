import React from "react";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <div>
            {/* Hero Section */}
            <section className="bg-primary text-white text-center py-5">
                <div className="container">
                    <h1 className="display-4 fw-bold">Mesut Logistics</h1>
                    <p className="lead mb-4">
                        Giải pháp giao hàng nhanh chóng, an toàn và tiện lợi cho bạn
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-light text-primary fw-semibold px-4"
                        onClick={()=>navigate("/customer/create-parcel")}>
                            Tạo đơn ngay
                        </button>
                        <button className="btn btn-outline-light fw-semibold px-4"
                                onClick={()=>navigate("/tracking")}>
                            Tra cứu đơn hàng
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-truck fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Giao hàng nhanh</h5>
                                    <p className="card-text">
                                        Đảm bảo thời gian vận chuyển ngắn nhất với nhiều lựa chọn dịch vụ.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-search fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Theo dõi đơn hàng</h5>
                                    <p className="card-text">
                                        Tra cứu trạng thái đơn hàng mọi lúc, mọi nơi trên hệ thống.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-box-seam fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Quản lý kho</h5>
                                    <p className="card-text">
                                        Tích hợp quản lý tồn kho và vận chuyển hiệu quả cho doanh nghiệp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Advantages Section */}
            <section className="py-5">
                <div className="container text-center">
                    <h2 className="fw-bold mb-5">Tại sao chọn chúng tôi?</h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-headset fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Hỗ trợ 24/7</h5>
                                    <p className="card-text">
                                        Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-globe2 fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Mạng lưới rộng khắp</h5>
                                    <p className="card-text">
                                        Phủ sóng giao hàng toàn quốc và quốc tế.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body">
                                    <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                                    <h5 className="card-title">Đảm bảo an toàn</h5>
                                    <p className="card-text">
                                        Cam kết an toàn hàng hóa với chính sách bồi thường rõ ràng.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default HomePage;
