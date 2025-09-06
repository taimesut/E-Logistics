import React, {useEffect, useState} from "react";
import AdminApi from "./AdminApi.js";
import Spinner from "../../componets/Spinner.jsx";
import {toast} from "react-toastify";

const AdminShippingRulePage = () => {
    const [rules, setRules] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await AdminApi.getShippingRule();
                setRules(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (id, field, value) => {
        setRules(prevRules => {
            const updated = prevRules.map(r =>
                r.id === id ? { ...r, [field]: field.includes("Weight") ? Number(value) : value } : r
            );
            for (let i = 0; i < updated.length - 1; i++) {
                if (updated[i].id === id && field === "maxWeight") {
                    updated[i + 1] = {
                        ...updated[i + 1],
                        minWeight: Number(value),
                    };
                }
            }
            return updated;
        });
    };

    const handleDelete = (id) => {
        if (id === rules[rules.length - 1].id) return;
        setRules(rules.filter(r => r.id !== id));
    };

    const handleAdd = () => {
        const lastNormal = rules[rules.length - 2];
        const newId = rules.length + 1;
        const newRule = {
            id: newId,
            minWeight: lastNormal.maxWeight,
            maxWeight: lastNormal.maxWeight + 1,
            noiTinh: 0,
            lienTinh: 0,
        };
        setRules([...rules.slice(0, -1), newRule, rules[rules.length - 1]]);
    };

    const validateRules = (rules) => {
        if (rules.length <= 2) {
            return false;
        }
        for (let i = 0; i < rules.length - 1; i++) {
            const rule = rules[i];

            if (i === 0 && rule.minWeight < 0) {
                return false;
            }

            if (i > 0) {
                const prev = rules[i - 1];
                if (rule.minWeight !== prev.maxWeight) {
                    return false;
                }
            }

            if (rule.minWeight >= rule.maxWeight) {
                return false;
            }
        }

        return true;
    };

    const fixLastRule = (rules) => {
        if (rules.length < 2) return rules;

        const updated = [...rules];
        const secondLast = updated[updated.length - 2];
        const last = updated[updated.length - 1];

        updated[updated.length - 1] = {
            ...last,
            minWeight: secondLast.maxWeight,
        };

        return updated;
    };

    const handleSave = async () => {
        if (!validateRules(rules)) {
            return;
        }
        try {
            setIsLoading(true);

            const res = await AdminApi.setShippingRule(fixLastRule(rules));
            setRules(res.data.data);
            toast.success("Cập nhật thành công")
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Spinner/>;
    }


    return (
        <div className="container my-4">
            <h3 className="mb-3">Quản lý bảng phí vận chuyển</h3>
            <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                <tr>
                    <th>Từ (kg)</th>
                    <th>Đến (kg)</th>
                    <th>Nội tỉnh (VNĐ)</th>
                    <th>Liên tỉnh (VNĐ)</th>
                    <th>Hành động</th>
                </tr>
                </thead>
                <tbody>
                {rules.slice(0, -1).map(rule => (
                    <tr key={rule.id}>
                        <td>
                            <input type="number" className="form-control"
                                   value={rule.minWeight}
                                   onChange={e => handleChange(rule.id, "minWeight", +e.target.value)}/>
                        </td>
                        <td>
                            <input type="number" className="form-control"
                                   value={rule.maxWeight}
                                   onChange={e => handleChange(rule.id, "maxWeight", +e.target.value)}/>
                        </td>
                        <td>
                            <input type="number" className="form-control"
                                   value={rule.noiTinh}
                                   onChange={e => handleChange(rule.id, "noiTinh", +e.target.value)}/>
                        </td>
                        <td>
                            <input type="number" className="form-control"
                                   value={rule.lienTinh}
                                   onChange={e => handleChange(rule.id, "lienTinh", +e.target.value)}/>
                        </td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rule.id)}>Xóa</button>
                        </td>
                    </tr>
                ))}

                <tr>
                    <td colSpan="2"><b>Mỗi kg thêm</b></td>
                    <td>
                        <input type="number" className="form-control"
                               value={rules[rules.length - 1]?.noiTinh}
                               onChange={e => handleChange(rules[rules.length - 1].id, "noiTinh", +e.target.value)}/>
                    </td>
                    <td>
                        <input type="number" className="form-control"
                               value={rules[rules.length - 1]?.lienTinh}
                               onChange={e => handleChange(rules[rules.length - 1].id, "lienTinh", +e.target.value)}/>
                    </td>
                    <td></td>
                </tr>
                </tbody>
            </table>

            <div className="d-flex gap-2">
                <button className="btn btn-success" onClick={handleAdd}>Thêm dòng</button>
                <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
            </div>
        </div>
    );
};

export default AdminShippingRulePage;
