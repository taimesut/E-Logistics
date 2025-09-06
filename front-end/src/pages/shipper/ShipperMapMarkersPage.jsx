import React, {useEffect} from 'react';
import ShipperApi from "./ShipperApi.js";
import ShipperMapMarkers from "./ShipperMapMarkers.jsx";
import {useLocation} from "react-router-dom";

const ShipperMapMarkersPage = () => {

    const [parcels, setParcels] = React.useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const fetchParcels = async () => {
        try{
            const res = await ShipperApi.getParcels(0,10,status,type);
            setParcels(res.data.data.data);
            console.log(res.data.data.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchParcels();
    }, []);

    return (
        <ShipperMapMarkers parcels={parcels} />
    );
};

export default ShipperMapMarkersPage;