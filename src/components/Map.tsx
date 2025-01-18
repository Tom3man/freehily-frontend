// src/components/Map.tsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/Map.css'; // Import the styles

// Add your Mapbox access token here
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lZmVlaGlseSIsImEiOiJjbTFzYzh5Y2gwNDZnMmtzajg5dHFnMHlrIn0.mWOROLLhnxOPq6T7HZlvVg';

const INITIAL_CENTER = [
    -0.22753953483535444,
    51.52102891078552
]
const INITIAL_ZOOM = 14.12

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [center, setCenter] = useState(INITIAL_CENTER)
    const [zoom, setZoom] = useState(INITIAL_ZOOM)

    //Removed as we don't need mousCoordinates for now
    //const [mouseCoordinates, setMouseCoordinates] = useState<[number, number] | null>(null);

    useEffect(() => {
        // Initialize the map
        console.log('Map initialized');
        const map = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center, // Longitude, Latitude
            zoom: zoom, // Default zoom level
        });

        //Removed as we don't need mousCoordinates for now
        // map.on('mousemove', (e) => {
        //     const { lng, lat } = e.lngLat;
        //     setMouseCoordinates([lng, lat]);
        //     // get the current center coordinates and zoom level from the map
        //     const mapCenter = map.getCenter()
        //     const mapZoom = map.getZoom()
        //     // update state
        //     setCenter([mapCenter.lng, mapCenter.lat])
        //     setZoom(mapZoom)
        // })

        map.on("click", async (e) => {
            const { lng, lat } = e.lngLat;
            console.log("Map clicked at:", lng, lat);

            // Fetch GeoJSON data from your API
            try {
                // console.log(`API: https://geo-api-608970134245.europe-west2.run.app/crimes/?longitude=${lng}&latitude=${lat}&radius=50`)
                // const response = await fetch(`/crimes/?longitude=${lng}&latitude=${lat}&radius=100`);
                // if (response.ok) {
                //     const data = await response.json();
                //     // Process the data
                // } else {
                //     console.error('Failed to fetch data:', response.status, response.statusText);
                // }

                const data = {
                    "results": [
                        {
                            "crime_id": "a0542b3b1f92dc1f1319ae54cc7f5e0cffcbb1e50578ad3dbbe50df3939ce327",
                            "month_year": "2022-09",
                            "police_force": "Metropolitan Police Service",
                            "longitude": -0.227135,
                            "latitude": 51.521262,
                            "lsoa_code": "E01002908",
                            "crime_type": "Violence and sexual offences",
                            "location_description": "On or near Brewster Gardens"
                        },
                        {
                            "crime_id": "73872b302e4f072845dc6f449e7995d23cb0d4eca797b7696b8f283258d3851f",
                            "month_year": "2023-12",
                            "police_force": "Metropolitan Police Service",
                            "longitude": -0.227135,
                            "latitude": 51.521262,
                            "lsoa_code": "E01002908",
                            "crime_type": "Vehicle crime",
                            "location_description": "On or near Brewster Gardens"
                        },
                        {
                            "crime_id": "933a5ad4ee72136405d7b9d8aacc0fcddf9833a9a0e37964eb33e7f4603aa29a",
                            "month_year": "2024-08",
                            "police_force": "Metropolitan Police Service",
                            "longitude": -0.227415,
                            "latitude": 51.520736,
                            "lsoa_code": "E01002908",
                            "crime_type": "Violence and sexual offences",
                            "location_description": "On or near Bracewell Road"
                        }
                    ]
                }

                const coordinates = data.results;

                console.log("coordinates here:", coordinates)


                // Transform individual coordinates into GeoJSON FeatureCollection
                const geoJsonData = transformToGeoJson(coordinates);

                console.log("converted to geojson")

                // Add the GeoJSON layer
                addGeoJsonLayer(map, geoJsonData);

                console.log("added layer")
            } catch (error) {
                console.error("Error fetching GeoJSON data:", error);
            }
        });

        // Add hover effect with a popup
        map.on('mousemove', 'crime-layer', (e: mapboxgl.MapMouseEvent) => {
            console.log(e.features[0])
            const coordinates = e.features[0].geometry.coordinates;
            const description = e.features[0].properties.crimeType;

            // Show popup
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        // Cleanup on unmount
        return () => {
            console.log('Map removed');
            map.remove();
        };
    }, []);

    // Example code
    // mapRef.current.addSource('places', {
    //     type: 'geojson',
    //     data: {
    //         type: 'FeatureCollection',
    //         features: [
    //             {
    //                 type: 'Feature',
    //                 geometry: {
    //                     type: 'Point',
    //                     coordinates: [-0.22700123839152941, 51.52103036344448],
    //                 },
    //                 properties: {
    //                     title: 'Location A',
    //                     description: 'This is Location A',
    //                 },
    //             },
    //             // Add other features...
    //         ],
    //     },
    // });

    // mapRef.current.addLayer({
    //     id: 'places-layer',
    //     type: 'circle',
    //     source: 'places',
    //     paint: {
    //         'circle-radius': 10,
    //         'circle-color': '#FF5733',
    //     },
    // });

    // Example code

    const transformToGeoJson = (coordinates: Array<{ longitude: number; latitude: number; crime_type: string }>) => {
        return {
            type: "FeatureCollection",
            features: coordinates.map((coord) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coord.longitude, coord.latitude],
                },
                properties: {
                    crimeType: coord.crime_type, // Add the crime type as a property
                },
            })),
        };
    };

    const addGeoJsonLayer = (map: mapboxgl.Map, geoJson: any) => {
        // Remove existing GeoJSON layer if it exists
        if (map.getSource("crime-layer-source")) {
            map.removeLayer("crime-layer");
            map.removeSource("crime-layer-source");
        }

        // Add GeoJSON source
        map.addSource("crime-layer-source", {
            type: "geojson",
            data: geoJson,
        });

        // Add GeoJSON layer
        map.addLayer({
            id: "crime-layer",
            type: "circle", // Use 'circle' for individual points
            source: "crime-layer-source",
            paint: {
                "circle-radius": 6,
                "circle-color": "#FF5733"
            },
        });
    };

    return (
        <>
            //<div className="sidebar">
            //    Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
            //</div>
            <div ref={mapContainerRef} className='map' />
        </>
    );
};

export default Map;
