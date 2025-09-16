import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import goongjs from "@goongmaps/goong-js";

const mapKey = import.meta.env.VITE_GOONG_MAP_KEY;
const apiKey = import.meta.env.VITE_GOONG_API_KEY;

const ShipperMapMarkerPage = () => {
    goongjs.accessToken = mapKey;
    const [searchParams] = useSearchParams();

    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));

    const navigate = useNavigate();


    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const [shipperLocation, setShipperLocation] = useState({
        lat: null,
        lng: null,
    });

    // lấy tọa độ shipper và gán marker
    useEffect(() => {
        if (!("geolocation" in navigator)) {
            console.error("Trình duyệt không hỗ trợ Geolocation");
            return;
        }

        let shipperMarker = null;

        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setShipperLocation({ lat: latitude, lng: longitude });

                    if (shipperMarker) {
                        shipperMarker.remove();
                    }

                    shipperMarker = new goongjs.Marker({ color: "red" })
                        .setLngLat([longitude, latitude])
                        .addTo(mapRef.current);
                },
                (error) => console.error("Lỗi lấy vị trí:", error),
                { enableHighAccuracy: true }
            );
        };

        updatePosition();

        // const intervalId = setInterval(updatePosition, 60000);
        //
        // return () => {
        //     clearInterval(intervalId);
        //     if (shipperMarker) shipperMarker.remove();
        // };
    }, []);



    if (!lat || !lng) {
        return <div>Không có tọa độ hợp lệ.</div>;
    }

    // tạo bản đồ
    useEffect(() => {
        if (!lat || !lng) return;

        mapRef.current = new goongjs.Map({
            container: mapContainer.current,
            style: 'https://tiles.goong.io/assets/goong_map_web.json',
            center: [lng, lat],
            zoom: 12
        });

        // gán marker vị trí đơn
        new goongjs.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current);
        mapRef.current.on('load', () => setMapLoaded(true));
    }, []);

    // chỉ đường
    const addRouteLayer = (origin, destination) => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        const layers = map.getStyle().layers;
        let firstSymbolId;
        for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === "symbol") {
                firstSymbolId = layers[i].id;
                break;
            }
        }

        const goongClient = goongSdk({accessToken: apiKey});
        goongClient.directions
            .getDirections({
                origin: origin, // "lat,lng"
                destination: destination, // "lat,lng"
                vehicle: "bike",
            })
            .send()
            .then((response) => {
                const directions = response.body;
                const route = directions.routes[0];
                const geometry_string = route.overview_polyline.points;
                const geoJSON = polyline.toGeoJSON(geometry_string);

                // Xóa route cũ nếu có
                if (map.getSource("route")) {
                    map.removeLayer("route");
                    map.removeSource("route");
                }

                map.addSource("route", {
                    type: "geojson",
                    data: geoJSON,
                });

                map.addLayer(
                    {
                        id: "route",
                        type: "line",
                        source: "route",
                        layout: {
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": "#1e88e5",
                            "line-width": 8,
                        },
                    },
                    firstSymbolId
                );
            });
    };

    const handleDirectionClick = () => {
        if (!mapLoaded) return;
        if (!shipperLocation.lng) return;
        if (!shipperLocation.lat) return;
        mapRef.current.flyTo({
            center: [
                shipperLocation.lng,
                shipperLocation.lat
            ],
            essential: true
        });
        addRouteLayer(`${shipperLocation.lat},${shipperLocation.lng}`, `${lat},${lng}`);
    };

    return (
        <>
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>
            <div style={{position: "relative", width: "100%", height: "100%"}}>
                <div ref={mapContainer} style={{width: "100%", height: "100%"}}/>
                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1,
                    }}
                >
                    <button
                        onClick={handleDirectionClick}
                        style={{
                            backgroundColor: "#1e88e5",
                            color: "white",
                            padding: "12px 20px",
                            borderRadius: "30px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        Chỉ đường
                    </button>
                </div>
            </div>
        </>
    );
};

export default ShipperMapMarkerPage;