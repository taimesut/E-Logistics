import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {AuthContext} from "../contexts/auth/AuthContext.jsx";

const RequireNotAuthenticatied = () => {
    const {state} = React.useContext(AuthContext);

    if (state.isAuthenticated) {
        const role = state.user.role;
        if (role === 'ROLE_ADMIN') {
            return <Navigate to="/admin" replace/>;
        } else if (role === 'ROLE_MANAGER') {
            return <Navigate to="/manager" replace/>;
        } else if (role === 'ROLE_SHIPPER') {
            return <Navigate to="/shipper" replace/>;
        }else if (role === 'ROLE_CUSTOMER') {
            return <Navigate to="/customer" replace/>;
        } else {
            return <Navigate to="/" replace/>;
        }
    }
    return <Outlet/>;
};

export default RequireNotAuthenticatied;
