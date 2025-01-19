import React from "react";
import "../../styles/MapLegend.css"; // Add your own styling for the legend

const MapLegend: React.FC = () => {
    return (
        <div className="map-legend">
            <h4>Map Legend</h4>
            <ul>
                <li>
                    <span style={{ backgroundColor: "#FF5733" }}></span> Crime Data
                </li>
                <li>
                    <span style={{ backgroundColor: "#3388FF" }}></span> Admin Boundaries
                </li>
            </ul>
        </div>
    );
};

export default MapLegend;
