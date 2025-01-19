import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import "../../styles/map.css";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";

mapboxgl.accessToken = "pk.eyJ1Ijoiam9lZmVlaGlseSIsImEiOiJjbTFzYzh5Y2gwNDZnMmtzajg5dHFnMHlrIn0.mWOROLLhnxOPq6T7HZlvVg";

const INITIAL_CENTER = [-0.22753953483535444, 51.52102891078552];
const INITIAL_ZOOM = 14.12;

const Map: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            // Initialize the map
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v12", // Style with detailed building data
                center: INITIAL_CENTER,
                zoom: INITIAL_ZOOM,
            });

            // Add navigation controls
            mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

            // Highlight buildings on hover
            mapRef.current.on("mouseenter", "building", () => {
                if (mapRef.current) {
                    mapRef.current.getCanvas().style.cursor = "pointer"; // Change cursor to pointer
                }
            });

            mapRef.current.on("mouseleave", "building", () => {
                if (mapRef.current) {
                    mapRef.current.getCanvas().style.cursor = ""; // Reset cursor
                }
            });

            // Handle building clicks to display information
            mapRef.current.on("click", "building", (e) => {
                const feature = e.features?.[0];
                if (feature && mapRef.current) {
                    const { geometry, properties } = feature;
                    let lng, lat;

                    // Extract coordinates
                    if (geometry.type === "Point") {
                        [lng, lat] = geometry.coordinates;
                    } else if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
                        lng = geometry.coordinates[0][0][0];
                        lat = geometry.coordinates[0][0][1];
                    } else {
                        return;
                    }

                    // Prepare popup content
                    const popupContent = `
                        <strong>Building Info:</strong><br>
                        Longitude: ${lng.toFixed(6)}<br>
                        Latitude: ${lat.toFixed(6)}<br>
                        ${properties
                            ? `<strong>Additional Properties:</strong><pre>${JSON.stringify(properties, null, 2)}</pre>`
                            : ""}
                    `;

                    // Create and add popup
                    new mapboxgl.Popup()
                        .setLngLat([lng, lat])
                        .setHTML(popupContent)
                        .addTo(mapRef.current);
                }
            });
        }

        // Cleanup on unmount
        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <div ref={mapContainerRef} className="map" style={{ width: "100%", height: "100vh" }} />
                <MapLegend />
            </div>
            <MapControls mapRef={mapRef} />
        </div>
    );
};

export default Map;
