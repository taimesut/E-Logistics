import React, {useEffect, useRef, useState} from "react";
import goongjs from "@goongmaps/goong-js";

const mapKey = import.meta.env.VITE_GOONG_MAP_KEY;

const ShipperMapMarkers = ({parcels}) => {
    const [shipperLocation, setShipperLocation] = useState(null);
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
                {enableHighAccuracy: true}
            );
        } else {
            console.error("Trình duyệt không hỗ trợ Geolocation");
        }
    }, []);

    // Khởi tạo map 1 lần khi có vị trí shipper
    useEffect(() => {
        if (shipperLocation && !mapRef.current) {
            mapRef.current = new goongjs.Map({
                container: mapContainer.current,
                style: "https://tiles.goong.io/assets/goong_map_web.json",
                center: [shipperLocation.lng, shipperLocation.lat],
                zoom: 13,
            });

            // Marker shipper
            new goongjs.Marker({color: "blue"})
                .setLngLat([shipperLocation.lng, shipperLocation.lat])
                .setPopup(new goongjs.Popup().setText("Vị trí Shipper"))
                .addTo(mapRef.current);
        }
    }, [shipperLocation]);

    // Add markers parcels mỗi khi parcels thay đổi
    useEffect(() => {
        if (mapRef.current) {
            // Xoá markers cũ
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Add markers mới
            parcels?.forEach((parcel) => {
                const lat = Number(parcel.fromLat);
                const lng = Number(parcel.fromLng);
                if (!isNaN(lat) && !isNaN(lng)) {
                    const marker = new goongjs.Marker({color: "red"})
                        .setLngLat([lng, lat])
                        .setPopup(new goongjs.Popup().setHTML(`
                            <div>
                                <strong>Đơn:</strong> ${parcel.id}<br/>
                                <strong>Tên:</strong> ${parcel.fromName}<br/>
                                <strong>SĐT:</strong> ${parcel.fromPhone}
                            </div>
                        `))
                        .addTo(mapRef.current);
                    markersRef.current.push(marker);
                }
            });
        }
    }, [parcels]);

    return (
        <div style={{position: "relative", width: "100%", height: "100vh"}}>
            <div ref={mapContainer} style={{width: "100%", height: "100%"}}/>
        </div>
    );
};

export default ShipperMapMarkers;
