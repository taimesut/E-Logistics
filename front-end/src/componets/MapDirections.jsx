import React, {useEffect, useRef} from "react";
import goongjs from '@goongmaps/goong-js';

const mapKey ='JAlgdrs19VFUldVR7TTl7G6gHqA3PhBUxjijeqgg';
const apiKey ='gTJQSu6Ifbgvy85dFzupzrbkp33NlckkY3yRHzJe';

const MapDirections = () => {
    goongjs.accessToken = mapKey;

    // ok
    // useEffect(() => {
    //     const map = new goongjs.Map({
    //         container: 'map',
    //         style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
    //         center: [ 107.991245,13.9374954], // starting position [lng, lat]
    //         zoom: 9 // starting zoom
    //     });
    //     new goongjs.Marker()
    //         .setLngLat([ 107.991245, 13.9374954])
    //         .addTo(map);
    // },[])

    useEffect(() => {
        const map = new goongjs.Map({
            container: 'map',
            style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
            center: [105.86432, 20.981971], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });
        new goongjs.Marker()
            .setLngLat([105.86432, 20.981971])
            .addTo(map);


        map.on('load', function () {
            var layers = map.getStyle().layers;
// Find the index of the first symbol layer in the map style
            var firstSymbolId;
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    firstSymbolId = layers[i].id;
                    break;
                }
            }
// Initialize goongClient with an API KEY
            var goongClient = goongSdk({
                accessToken: apiKey
            });
// Get Directions
            goongClient.directions
                .getDirections({
                    origin: '20.981971,105.864323',
                    destination: '21.031011,105.783206',
                    vehicle: 'car'
                })
                .send()
                .then(function (response) {
                    var directions = response.body;
                    var route = directions.routes[0];

                    var geometry_string = route.overview_polyline.points;
                    var geoJSON = polyline.toGeoJSON(geometry_string);
                    map.addSource('route', {
                        'type': 'geojson',
                        'data': geoJSON
                    });
// Add route layer below symbol layers
                    map.addLayer(
                        {
                            'id': 'route',
                            'type': 'line',
                            'source': 'route',
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            'paint': {
                                'line-color': '#1e88e5',
                                'line-width': 8
                            }
                        },
                        firstSymbolId
                    );

                });
        });


    }, [])

    return (
        <div id={'map'} style={{width: "100vw", height: "100vh"}}></div>
    )
};

export default MapDirections;
