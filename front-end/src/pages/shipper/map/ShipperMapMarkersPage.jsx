import React, {useEffect} from 'react';
import ShipperMapMarkers from "./ShipperMapMarkers.jsx";
import {useLocation} from "react-router-dom";
import Spinner from "../../../componets/Spinner.jsx";
import MyApi from "../../../services/MyApi.js";

const ShipperMapMarkersPage = () => {

    const [parcels, setParcels] = React.useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const fetchParcels = async () => {
        try{
            const res = await MyApi.getParcels(0,10,status, search);
            setParcels(res.data.data.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        fetchParcels();
    }, []);

    if(parcels.length === 0){
        return <Spinner/>;
    }

    return (
        <ShipperMapMarkers parcels={parcels} />
    );
};

export default ShipperMapMarkersPage;