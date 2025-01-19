import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import "../styles/Map.css"; // Import the styles

// Add your Mapbox access token here
mapboxgl.accessToken = "pk.eyJ1Ijoiam9lZmVlaGlseSIsImEiOiJjbTFzYzh5Y2gwNDZnMmtzajg5dHFnMHlrIn0.mWOROLLhnxOPq6T7HZlvVg";

const INITIAL_CENTER = [-0.22753953483535444, 51.52102891078552];
const INITIAL_ZOOM = 14.12;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null); // Store the Mapbox instance
    const popupRef = useRef<mapboxgl.Popup | null>(null); // Store the popup instance
    const [latitude, setLatitude] = useState<string>("51.52102891078552");
    const [longitude, setLongitude] = useState<string>("-0.22753953483535444");
    const [radius, setRadius] = useState<string>("100"); // New radius input
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize the map if it hasn't been created yet
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: INITIAL_CENTER,
                zoom: INITIAL_ZOOM,
            });
        }

        // Cleanup on unmount
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    const fetchCrimeData = async () => {
        setError(null); // Reset errors

        try {
            const apiUrl = `https://police-608970134245.europe-west2.run.app/crimes/?longitude=${longitude}&latitude=${latitude}&radius=${radius}`;
            console.log("Fetching crime data from:", apiUrl);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const coordinates = data.results;

            // Transform data into GeoJSON
            const geoJsonData = transformToGeoJson(coordinates);

            // Add GeoJSON layer to map
            if (mapRef.current) {
                addGeoJsonLayer(mapRef.current, geoJsonData);
            }

            console.log("Crime data successfully added to map.");
        } catch (err) {
            console.error("Error fetching crime data:", err);
            setError("Failed to fetch crime data. Please check the console for details.");
        }
    };

    const transformToGeoJson = (coordinates: Array<{ longitude: number; latitude: number; crime_type: string; police_force: string; location_description: string }>) => {
        return {
            type: "FeatureCollection",
            features: coordinates.map((coord) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [coord.longitude, coord.latitude],
                },
                properties: {
                    crimeType: coord.crime_type,
                    policeForce: coord.police_force,
                    locationDescription: coord.location_description,
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
            type: "circle",
            source: "crime-layer-source",
            paint: {
                "circle-radius": 6,
                "circle-color": "#FF5733",
            },
        });

        // Add hover effect with popup
        map.on("mouseenter", "crime-layer", (e) => {
            const coordinates = e.features?.[0]?.geometry?.coordinates.slice();
            const properties = e.features?.[0]?.properties;

            // Ensure the popup is anchored at the correct position
            if (coordinates && properties) {
                const { crimeType, policeForce, locationDescription } = properties;

                // Remove existing popup if any
                if (popupRef.current) {
                    popupRef.current.remove();
                }

                // Create a new popup
                popupRef.current = new mapboxgl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        `<strong>Crime Type:</strong> ${crimeType}<br>
                         <strong>Police Force:</strong> ${policeForce}<br>
                         <strong>Description:</strong> ${locationDescription}`
                    )
                    .addTo(map);
            }
        });

        // Remove popup on mouse leave
        map.on("mouseleave", "crime-layer", () => {
            if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
            }
        });
    };

    return (
        <div className="map-container">
            <div className="controls">
                <label>
                    Latitude:
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </label>
                <label>
                    Longitude:
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </label>
                <label>
                    Radius (meters):
                    <input
                        type="text"
                        value={radius}
                        onChange={(e) => setRadius(e.target.value)}
                    />
                </label>
                <button onClick={fetchCrimeData}>Fetch Crime Data</button>
                {error && <p className="error">{error}</p>}
            </div>
            <div ref={mapContainerRef} className="map" />
        </div>
    );
};

export default Map;
