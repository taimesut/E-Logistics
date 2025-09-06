import React from 'react';
import PublicApi from "./PublicApi.js";
import Spinner from "../../componets/Spinner.jsx";

const TrackingPage = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [codeTracking, setCodeTracking] = React.useState("");
    const [steps, setSteps] = React.useState([]);
    const [isFirst, setIsFirst] = React.useState(true);


    const handleTrackingClick = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await PublicApi.tracking(codeTracking.trim());
            if (response.status === 200 && response.data.success) {
                setSteps(response.data.data);
            } else {
                setSteps([]);
            }
        } catch (err) {
            console.error(err);
            setSteps([]);
        }
        finally {
            setIsLoading(false);
            setIsFirst(false);
        }
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (

        <div className="d-flex align-items-center justify-content-center p-5 bg-light min-vh-100">
            <div className="card p-4 shadow"     style={{width: '100%', maxWidth: 480}}>
                <h3 className="mb-3 text-center">TRA CỨU VẬN ĐƠN</h3>

                <form onSubmit={handleTrackingClick}>
                    <div className="row g-2">
                        <div className="col">
                            <input
                                className="form-control"
                                id="codeTracking"
                                name="codeTracking"
                                required
                                placeholder="Nhập mã vận đơn..."
                                value={codeTracking}
                                onChange={(e) => setCodeTracking(e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-success w-100" type="submit">
                                Tra cứu
                            </button>
                        </div>
                    </div>
                </form>

                <div className="py-4">
                    <ul className="list-group">
                        {!isFirst && steps.length === 0 && (
                            <li className="list-group-item">Chưa có thông tin tracking</li>
                        )}
                        {steps.map((item) => (
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
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
