import React, {useEffect, useState} from 'react';
import PublicApi from "./PublicApi.js";
import Spinner from "../../componets/Spinner.jsx";

const ShippingRulePage = () => {
    const [rules, setRules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await PublicApi.getShippingRule();
                setRules(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);
    if(isLoading){
        return <Spinner />;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Bảng Giá Vận Chuyển</h2>
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                <tr>
                    <th>Trọng lượng (Kg)</th>
                    <th>Nội tỉnh (VNĐ)</th>
                    <th>Liên tỉnh (VNĐ)</th>
                </tr>
                </thead>
                <tbody>
                {rules.map((rule, index) => {
                    const isExtra = index === rules.length - 1;
                    return (
                        <tr key={rule.id}>
                            <td>
                                {isExtra
                                    ? `Trên ${rule.minWeight} kg, thêm mỗi kg`
                                    : `${rule.minWeight} - ${rule.maxWeight} kg`}
                            </td>
                            <td>{rule.noiTinh.toLocaleString()} ₫</td>
                            <td>{rule.lienTinh.toLocaleString()} ₫</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default ShippingRulePage;