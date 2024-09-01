import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapComponents.css';
import distance from '@turf/distance';
import { point } from '@turf/helpers';

mapboxgl.accessToken = 'pk.eyJ1IjoicHJlbXNpbmdocmFqcG9vdDIwMDAiLCJhIjoiY2x6dXlkMXNiMDF1aDJsc2F3eDV4a3E5bCJ9.nlfE7LVw5OBIqbiNQbtzng';

const MapComponent = ({ A_latitude_state, A_longitude_state, B_latitude_state, B_longitude_state, distanceText_timeText }) => {
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [distanceText, setDistanceText] = useState('00.00km');
    const [timeText, setTimeText] = useState('00 min 00 sec');

    useEffect(() => {
        if (!map) {
            const newMap = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [75.863617, 26.989818], // Default center
                zoom: 12,
            });

            newMap.on('load', () => {
                setMap(newMap);
            });
        }
    }, [map]);

    useEffect(() => {
        const createCustomMarker = (lngLat, htmlElement) => {
            const marker = new mapboxgl.Marker({ element: htmlElement })
                .setLngLat(lngLat)
                .addTo(map);
            setMarkers(prevMarkers => [...prevMarkers, marker]);
            map.setCenter(lngLat);
            return marker;
        };

        if (map && (A_latitude_state || B_latitude_state)) {
            const lngLatA = A_latitude_state && A_longitude_state
                ? [parseFloat(A_longitude_state), parseFloat(A_latitude_state)]
                : null;
            const lngLatB = B_latitude_state && B_longitude_state
                ? [parseFloat(B_longitude_state), parseFloat(B_latitude_state)]
                : null;

            // Remove previous route and markers if they exist
            if (map.getLayer('route')) {
                map.removeLayer('route');
                map.removeSource('route');
            }

            markers.forEach(marker => marker.remove()); // Remove all markers
            setMarkers([]);

            // Create a green circle for the start point
            if (lngLatA) {
                const startSymbol = document.createElement('div');
                startSymbol.className = 'start-marker';
                createCustomMarker(lngLatA, startSymbol);
            }

            // Create a red location symbol for the end point
            if (lngLatB) {
                const endMarker = new mapboxgl.Marker({ color: 'red' }) // Default marker with red color
                    .setLngLat(lngLatB)
                    .addTo(map);
                setMarkers(prevMarkers => [...prevMarkers, endMarker]);
            }

            if (lngLatA && lngLatB) {
                const routeRequest = `https://api.mapbox.com/directions/v5/mapbox/driving/${lngLatA.join(',')};${lngLatB.join(',')}` +
                    `?alternatives=false&geometries=geojson&access_token=${mapboxgl.accessToken}`;

                fetch(routeRequest)
                    .then(response => response.json())
                    .then(data => {
                        const route = data.routes[0].geometry;
                        const duration = data.routes[0].duration; // Duration in seconds

                        map.addSource('route', {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: [
                                    {
                                        type: 'Feature',
                                        geometry: route,
                                    },
                                ],
                            },
                        });

                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round',
                            },
                            paint: {
                                'line-color': '#3887be',
                                'line-width': 5,
                            },
                        });

                        // Fit map bounds to include both points
                        map.fitBounds([
                            [Math.min(lngLatA[0], lngLatB[0]), Math.min(lngLatA[1], lngLatB[1])],
                            [Math.max(lngLatA[0], lngLatB[0]), Math.max(lngLatA[1], lngLatB[1])]
                        ], {
                            padding: { top: 20, bottom: 20, left: 20, right: 20 }
                        });

                        const pointA = point(lngLatA);
                        const pointB = point(lngLatB);
                        const distanceKm = distance(pointA, pointB, { units: 'kilometers' });

                        setDistanceText(`${distanceKm.toFixed(2)} km`);

                        // Convert duration from seconds to a readable format
                        const minutes = Math.floor(duration / 60);
                        const seconds = Math.floor(duration % 60);
                        setTimeText(`${minutes} min ${seconds} sec`);
                    });
            }
        }
    }, [map, A_latitude_state, A_longitude_state, B_latitude_state, B_longitude_state]);

    useEffect(() => {
        const handleResize = () => {
            if (map && markers.length > 0) {
                map.fitBounds([
                    [markers[0].getLngLat().lng, markers[0].getLngLat().lat],
                    [markers[markers.length - 1].getLngLat().lng, markers[markers.length - 1].getLngLat().lat]
                ], {
                    padding: { top: 20, bottom: 20, left: 20, right: 20 }
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [map, markers]);

    useEffect(() => {
        distanceText_timeText(distanceText, timeText);
    }, [distanceText, timeText]);

    return (
        <div id='mapComponents_mainDiv'>
            <div className='Map_text'>Distance: <b>{distanceText}</b></div>
            <div className='Map_text'>Estimated Travel Time: <b>{timeText}</b></div>
            <div id="map"></div>
        </div>
    );
};

export default MapComponent;


