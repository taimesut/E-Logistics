import React, { useEffect, useRef, useState } from "react";
import goongjs from "@goongmaps/goong-js";
import Spinner from "../../../componets/Spinner.jsx";

const mapKey = import.meta.env.VITE_GOONG_MAP_KEY;

const ShipperMapMarkers = ({ parcels }) => {
    const [shipperLocation, setShipperLocation] = useState(null);
    const [mapReady, setMapReady] = useState(false); // cờ load map
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    goongjs.accessToken = mapKey;

    // Lấy vị trí shipper
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setShipperLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Lỗi lấy vị trí:", error);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Trình duyệt không hỗ trợ Geolocation");
        }
    }, []);

    // Khởi tạo map
    useEffect(() => {
        if (shipperLocation && !mapRef.current) {
            mapRef.current = new goongjs.Map({
                container: mapContainer.current,
                style: "https://tiles.goong.io/assets/goong_map_web.json",
                center: [shipperLocation.lng, shipperLocation.lat],
                zoom: 13,
            });

            mapRef.current.on("load", () => {
                // Đặt cờ map ready
                setMapReady(true);

                // Marker vị trí shipper
                new goongjs.Marker({ color: "blue" })
                    .setLngLat([shipperLocation.lng, shipperLocation.lat])
                    .setPopup(new goongjs.Popup().setText("Vị trí Shipper"))
                    .addTo(mapRef.current);
            });
        }
    }, [shipperLocation]);

    // Add markers parcels
    useEffect(() => {
        if (!mapRef.current || !mapReady) return;

        // Xoá markers cũ
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        parcels?.forEach((parcel) => {
            let lat, lng, name, phone;

            if (parcel.status === "PICKUP_IN_PROGRESS") {
                lat = Number(parcel.fromLat);
                lng = Number(parcel.fromLng);
                name = parcel.fromName;
                phone = parcel.fromPhone;
            } else {
                lat = Number(parcel.toLat);
                lng = Number(parcel.toLng);
                name = parcel.toName;
                phone = parcel.toPhone;
            }

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = new goongjs.Marker({ color: "red" })
                    .setLngLat([lng, lat])
                    .setPopup(
                        new goongjs.Popup().setHTML(`
              <div>
                <strong>Đơn:</strong> ${parcel.id}<br/>
                <strong>Tên:</strong> ${name}<br/>
                <strong>SĐT:</strong> ${phone}
              </div>
            `)
                    )
                    .addTo(mapRef.current);
                markersRef.current.push(marker);
            }
        });
    }, [parcels, mapReady]);

    if (!shipperLocation) {
        return <Spinner />;
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default ShipperMapMarkers;
