import React from 'react';
import {Route, Routes} from "react-router-dom";
import HomePage from "../pages/public/HomePage.jsx";
import LoginPage from "../pages/public/auth/LoginPage.jsx";
import RegisterPage from "../pages/public/auth/RegisterPage.jsx";
import RequireRole from "./RequireRole.jsx";
import TrackingPage from "../pages/public/TrackingPage.jsx";
import PublicLayout from "../pages/public/PublicLayout.jsx";
import AdminHomePage from "../pages/admin/AdminHomePage.jsx";
import ManagerLayout from "../pages/manager/ManagerLayout.jsx";
import AdminLayout from "../pages/admin/AdminLayout.jsx";
import ManagerHomePage from "../pages/manager/ManagerHomePage.jsx";
import RequireNotAuthenticated from "./RequireNotAuthenticated.jsx";
import {ToastContainer} from "react-toastify";
import CustomerLayout from "../pages/customer/CustomerLayout.jsx";
import Logout from "../pages/public/auth/Logout.jsx";
import CustomerHomePage from "../pages/customer/CustomerHomePage.jsx";
import NotFoundPage from "../pages/public/page-direction/NotFoundPage.jsx";
import ShipperLayout from "../pages/shipper/ShipperLayout.jsx";
import ShipperHomePage from "../pages/shipper/ShipperHomePage.jsx";
import ShipperMapDirection from "../pages/shipper/map/ShipperMapDirection.jsx";
import ShipperMapMarkersPage from "../pages/shipper/map/ShipperMapMarkersPage.jsx";
import ShipperMapMarkerPage from "../pages/shipper/map/ShipperMapMarkerPage.jsx";
import ResetPasswordPage from "../pages/public/auth/ResetPasswordPage.jsx";
import ProfilePage from "../pages/public/ProfilePage.jsx";
import CheckFeePage from "../pages/public/CheckFeePage.jsx";
import AdminShippingRulePage from "../pages/admin/AdminShippingRulePage.jsx";
import ShippingRulePage from "../pages/public/ShippingRulePage.jsx";
import CustomerParcelGetAll from "../pages/customer/parcel/CustomerParcelGetAll.jsx";
import CustomerParcelCreate from "../pages/customer/parcel/CustomerParcelCreate.jsx";
import CustomerParcelDetail from "../pages/customer/parcel/CustomerParcelDetail.jsx";
import CustomerProductDetail from "../pages/customer/product/CustomerProductDetail.jsx";
import CustomerProductUpdate from "../pages/customer/product/CustomerProductUpdate.jsx";
import CustomerProductGetAll from "../pages/customer/product/CustomerProductGetAll.jsx";
import CustomerProductCreate from "../pages/customer/product/CustomerProductCreate.jsx";
import ManagerParcelGetAll from "../pages/manager/parcel/ManagerParcelGetAll.jsx";
import AdminBranchGetAll from "../pages/admin/branch/AdminBranchGetAll.jsx";
import AdminBranchDetail from "../pages/admin/branch/AdminBranchDetail.jsx";
import AdminBranchUpdate from "../pages/admin/branch/AdminBranchUpdate.jsx";
import AdminBranchCreate from "../pages/admin/branch/AdminBranchCreate.jsx";
import AdminAccountGetAll from "../pages/admin/account/AdminAccountGetAll.jsx";
import AdminAccountDetail from "../pages/admin/account/AdminAccountDetail.jsx";
import AdminAccountUpdate from "../pages/admin/account/AdminAccountUpdate.jsx";
import AdminAccountCreate from "../pages/admin/account/AdminAccountCreate.jsx";
import ManagerParcelDetail from "../pages/manager/parcel/ManagerParcelDetail.jsx";
import ShipperParcelGetAll from "../pages/shipper/parcel/ShipperParcelGetAll.jsx";
import ShipperParcelDetail from "../pages/shipper/parcel/ShipperParcelDetail.jsx";
import CustomerStats from "../pages/customer/CustomerStats.jsx";
import ShipperStats from "../pages/shipper/ShipperStats.jsx";
import AdminStats from "../pages/admin/AdminStats.jsx";
import ManagerStats from "../pages/manager/ManagerStats.jsx";
import ComingSoonPage from "../pages/public/page-direction/ComingSoonPage.jsx";



const AppRoutes = () => {
    return (
        <>
            <Routes>
                {/*guest*/}
                <Route element={<PublicLayout />}>

                    <Route element={<RequireNotAuthenticated/>}>
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

                        <Route path="/customer/parcel" element={<CustomerParcelGetAll/>} />
                        <Route path="/customer/create-parcel" element={<CustomerParcelCreate/>} />
                        <Route path="/customer/parcel/:id" element={<CustomerParcelDetail/>} />

                        <Route path="/customer/product/:id" element={<CustomerProductDetail/>} />
                        <Route path="/customer/product/edit/:id" element={<CustomerProductUpdate/>} />
                        <Route path="/customer/product" element={<CustomerProductGetAll/>} />
                        <Route path="/customer/create-product" element={<CustomerProductCreate/>} />

                        <Route path="/customer/tracking" element={<TrackingPage/>} />
                        <Route path="/customer/stats" element={<CustomerStats/>} />
                    </Route>
                </Route>

                {/*shipper*/}
                <Route element={<RequireRole role={"ROLE_SHIPPER"}/>}>
                    <Route element={<ShipperLayout/>}>
                        <Route path="/shipper/profile" element={<ProfilePage/>} />

                        <Route path="/shipper" element={<ShipperHomePage/>} />

                        <Route path="/shipper/parcel" element={<ShipperParcelGetAll/>} />
                        <Route path="/shipper/parcel/:id" element={<ShipperParcelDetail/>} />

                        <Route path="/shipper/map-direction" element={<ShipperMapDirection/>} />
                        <Route path="/shipper/map-markers" element={<ShipperMapMarkersPage/>} />
                        <Route path="/shipper/map-marker" element={<ShipperMapMarkerPage/>} />
                        <Route path="/shipper/stats" element={<ComingSoonPage/>} />

                    </Route>
                </Route>


                {/*admin*/}
                <Route element={<RequireRole role={"ROLE_ADMIN"}/>}>
                    <Route element={<AdminLayout/>}>
                        <Route path="/admin/profile" element={<ProfilePage/>} />

                        <Route path="/admin" element={<AdminHomePage/>} />

                        {/*branch*/}
                        <Route path="/admin/create-branch" element={<AdminBranchCreate/>} />
                        <Route path="/admin/branch" element={<AdminBranchGetAll/>} />
                        <Route path="/admin/branch/:id" element={<AdminBranchDetail/>} />
                        <Route path="/admin/branch/edit/:id" element={<AdminBranchUpdate/>} />

                        {/*staff*/}
                        <Route path="/admin/account" element={<AdminAccountGetAll/>} />
                        <Route path="/admin/account/:id" element={<AdminAccountDetail/>} />
                        <Route path="/admin/account/edit/:id" element={<AdminAccountUpdate/>} />
                        <Route path="/admin/create-account" element={<AdminAccountCreate/>} />

                        <Route path="/admin/shipping-rule" element={<AdminShippingRulePage/>} />
                        <Route path="/admin/stats" element={<ComingSoonPage/>} />

                    </Route>
                </Route>


                {/*manager*/}
                <Route element={<RequireRole role={"ROLE_MANAGER"}/>}>
                    <Route element={<ManagerLayout/>}>
                        <Route path="/manager/profile" element={<ProfilePage/>} />

                        <Route path="/manager" element={<ManagerHomePage/>} />
                        <Route path="/manager/parcel/:id" element={<ManagerParcelDetail/>} />
                        <Route path="/manager/parcel" element={<ManagerParcelGetAll/>} />
                        <Route path="/manager/stats" element={<ComingSoonPage/>} />

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