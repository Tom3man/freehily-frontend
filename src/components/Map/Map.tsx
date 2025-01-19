import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import "../../styles/Map.css";
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
            mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: INITIAL_CENTER,
                zoom: INITIAL_ZOOM,
            });

            mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
        }

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <div ref={mapContainerRef} className="map" style={{ width: "100%", height: "100vh" }}/>
                <MapLegend />
            </div>
            <MapControls mapRef={mapRef} />
        </div>
    );
};

export default Map;
