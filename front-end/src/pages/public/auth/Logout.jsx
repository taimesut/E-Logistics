import { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
    }, [dispatch, navigate]);

    return null;
};

export default Logout;
