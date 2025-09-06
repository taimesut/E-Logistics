import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {AuthContext} from "../contexts/auth/AuthContext.jsx";
import UnauthorizedPage from "../pages/public/UnauthorizedPage.jsx";

const RequireRole = ({ role }) => {
    const {state} = React.useContext(AuthContext);

    if (!state.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if(state.user.role === role){
        return <Outlet/>;
    }
    else {
        return <UnauthorizedPage/>;
    }
};

export default RequireRole;
