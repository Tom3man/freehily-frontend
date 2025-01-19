import React, { useState } from "react";
import { fetchCrimeData, fetchAdminBoundaries } from "../../api";
import { transformBoundaryDataToGeoJson } from "../../utils/geoJsonUtils";
import { addBoundaryLayerToMap, addCrimeLayerToMap } from "../../utils/mapUtils";

interface MapControlsProps {
    mapRef: React.MutableRefObject<mapboxgl.Map | null>;
}

const MapControls: React.FC<MapControlsProps> = ({ mapRef }) => {
    const [latitude, setLatitude] = useState("51.509865");
    const [longitude, setLongitude] = useState("-0.118092");
    const [radius, setRadius] = useState("100");
    const [error, setError] = useState<string | null>(null);

    const fetchAndDisplayData = async () => {
        setError(null);
        try {
            // Fetch crime data and admin boundaries concurrently
            const [crimeData, adminBoundaries] = await Promise.all([
                fetchCrimeData(longitude, latitude, radius),
                fetchAdminBoundaries(longitude, latitude),
            ]);

            if (mapRef.current) {
                // Add crime data to map
                addCrimeLayerToMap(mapRef.current, crimeData.results);

                // Transform admin boundary data to GeoJSON and add to map
                const boundaryGeoJson = transformBoundaryDataToGeoJson(adminBoundaries.results);
                addBoundaryLayerToMap(mapRef.current, boundaryGeoJson);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please check the console for details.");
        }
    };

    return (
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
            <button onClick={fetchAndDisplayData}>Fetch Data</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default MapControls;
