import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/public/HomePage.jsx";
import LoginPage from "../pages/public/LoginPage.jsx";
import RegisterPage from "../pages/public/RegisterPage.jsx";
import RequireRole from "./RequireRole.jsx";
import CustomerParcelNewPage from "../pages/customer/CustomerParcelNewPage.jsx";
import TrackingPage from "../pages/public/TrackingPage.jsx";
import PublicLayout from "../pages/public/PublicLayout.jsx";
import AdminHomePage from "../pages/admin/AdminHomePage.jsx";
import ManagerLayout from "../pages/manager/ManagerLayout.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import ManagerHomePage from "../pages/manager/ManagerHomePage.jsx";
import RequireNotAuthenticatied from "./RequireNotAuthenticatied.jsx";
import {ToastContainer} from "react-toastify";
import CustomerLayout from "../pages/customer/CustomerLayout.jsx";
import Logout from "../pages/public/Logout.jsx";
import CustomerHomePage from "../pages/customer/CustomerHomePage.jsx";
import NotFoundPage from "../pages/public/NotFoundPage.jsx";
import CustomerParcelPage from "../pages/customer/CustomerParcelPage.jsx";
import AdminBranchPage from "../pages/admin/AdminBranchPage.jsx";
import AdminCreateBranchPage from "../pages/admin/AdminCreateBranch.jsx";
import AdminDetailBranchPage from "../pages/admin/AdminDetailBranchPage.jsx";
import AdminAccountPage from "../pages/admin/AdminAccountPage.jsx";
import AdminCreateAccountPage from "../pages/admin/AdminCreateAccountPage.jsx";
import AdminDetailAccountPage from "../pages/admin/AdminDetailAccountPage.jsx";
import ShipperLayout from "../pages/shipper/ShipperLayout.jsx";
import ShipperHomePage from "../pages/shipper/ShipperHomePage.jsx";
import ShipperParcelPage from "../pages/shipper/ShipperParcelPage.jsx";

import MapDirections from "../componets/MapDirections.jsx";
import ShipperMapDirection from "../pages/shipper/ShipperMapDirection.jsx";
import ShipperMapMarkersPage from "../pages/shipper/ShipperMapMarkersPage.jsx";
import CustomerParcelDetailPage from "../pages/customer/CustomerParcelDetailPage.jsx";
import ShipperDetailParcelPage from "../pages/shipper/ShipperDetailParcelPage.jsx";
import ShipperMapMarkerPage from "../pages/shipper/ShipperMapMarkerPage.jsx";
import ManagerParcelPage from "../pages/manager/ManagerParcelPage.jsx";
import ManagerParcelDetailPage from "../pages/manager/ManagerParcelDetailPage.jsx";
import ResetPasswordPage from "../pages/public/ResetPasswordPage.jsx";
import ProfilePage from "../pages/public/ProfilePage.jsx";
import CheckFeePage from "../pages/public/CheckFeePage.jsx";
import AdminShippingRulePage from "../pages/admin/AdminShippingRulePage.jsx";
import ShippingRulePage from "../pages/public/ShippingRulePage.jsx";
import CustomerStatisticPage from "../pages/customer/CustomerStatisticPage.jsx";
import ShipperStatisticPage from "../pages/shipper/ShipperStatisticPage.jsx";
import AdminStatisticPage from "../pages/admin/AdminStatisticPage.jsx";
import ManagerStatisticPage from "../pages/manager/ManagerStatisticPage.jsx";

const AppRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/map" element={<MapDirections/>} />

                {/*guest*/}
                <Route element={<PublicLayout />}>

                    <Route element={<RequireNotAuthenticatied/>}>
                        <Route path="/login" element={<LoginPage/>} />
                        <Route path="/register" element={<RegisterPage/>} />
                        <Route path="/reset-password" element={<ResetPasswordPage/>} />
                    </Route>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/tracking" element={<TrackingPage/>} />
                    <Route path="/check-fee" element={<CheckFeePage/>} />
                    <Route path="/shipping-rule" element={<ShippingRulePage/>} />
                </Route>


                {/*customer*/}
                <Route element={<RequireRole role={"ROLE_CUSTOMER"}/>}>
                    <Route element={<CustomerLayout/>}>
                        <Route path="/customer/profile" element={<ProfilePage/>} />

                        <Route path="/customer" element={<CustomerHomePage/>} />

                        <Route path="/customer/parcel" element={<CustomerParcelPage/>} />
                        <Route path="/customer/create-parcel" element={<CustomerParcelNewPage/>} />
                        <Route path="/customer/parcel/:id" element={<CustomerParcelDetailPage/>} />

                        <Route path="/customer/tracking" element={<TrackingPage/>} />
                        <Route path="/customer/stats" element={<CustomerStatisticPage/>} />
                    </Route>
                </Route>

                {/*shipper*/}
                <Route element={<RequireRole role={"ROLE_SHIPPER"}/>}>
                    <Route element={<ShipperLayout/>}>
                        <Route path="/shipper/profile" element={<ProfilePage/>} />

                        <Route path="/shipper" element={<ShipperHomePage/>} />
                        <Route path="/shipper/parcel" element={<ShipperParcelPage/>} />
                        <Route path="/shipper/parcel/:id" element={<ShipperDetailParcelPage/>} />
                        <Route path="/shipper/map-direction" element={<ShipperMapDirection/>} />
                        <Route path="/shipper/map-markers" element={<ShipperMapMarkersPage/>} />
                        <Route path="/shipper/map-marker" element={<ShipperMapMarkerPage/>} />
                        <Route path="/shipper/stats" element={<ShipperStatisticPage/>} />

                    </Route>
                </Route>


                {/*admin*/}
                <Route element={<RequireRole role={"ROLE_ADMIN"}/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path="/admin/profile" element={<ProfilePage/>} />

                        <Route path="/admin" element={<AdminHomePage/>} />

                        {/*branch*/}
                        <Route path="/admin/branch" element={<AdminBranchPage/>} />
                        <Route path="/admin/branch/:id" element={<AdminDetailBranchPage/>} />
                        <Route path="/admin/create-branch" element={<AdminCreateBranchPage/>} />

                        {/*staff*/}
                        <Route path="/admin/account" element={<AdminAccountPage/>} />
                        <Route path="/admin/account/:id" element={<AdminDetailAccountPage/>} />
                        <Route path="/admin/create-account" element={<AdminCreateAccountPage/>} />

                        <Route path="/admin/shipping-rule" element={<AdminShippingRulePage/>} />
                        <Route path="/admin/stats" element={<AdminStatisticPage/>} />

                    </Route>
                </Route>


                {/*manager*/}
                <Route element={<RequireRole role={"ROLE_MANAGER"}/>}>
                    <Route element={<ManagerLayout/>}>
                        <Route path="/manager/profile" element={<ProfilePage/>} />

                        <Route path="/manager" element={<ManagerHomePage/>} />
                        <Route path="/manager/parcel/:id" element={<ManagerParcelDetailPage/>} />
                        <Route path="/manager/parcel" element={<ManagerParcelPage/>} />
                        <Route path="/manager/stats" element={<ManagerStatisticPage/>} />

                    </Route>
                </Route>

                {/*error*/}
                <Route path="/logout" element={<Logout/>} />
                <Route path="*" element={<NotFoundPage/>}/>

            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default AppRoutes;