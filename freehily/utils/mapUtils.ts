import mapboxgl from "mapbox-gl";


export const addCrimeLayerToMap = (map: mapboxgl.Map, crimeData: Array<any>) => {
    const layerId = "crime-layer";
    const geoJson = {
        type: "FeatureCollection",
        features: crimeData.map((crime) => ({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [crime.longitude, crime.latitude],
            },
            properties: {
                crimeType: crime.crime_type,
                policeForce: crime.police_force,
                description: crime.location_description,
                monthYear: crime.month_year,
            },
        })),
    };

    // Remove existing layer and source if they exist
    if (map.getSource(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
    }

    // Add source and layer
    map.addSource(layerId, { type: "geojson", data: geoJson });
    map.addLayer({
        id: layerId,
        type: "circle",
        source: layerId,
        paint: {
            "circle-radius": 6,
            "circle-color": "#FF5733",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
        },
    });

    // Add hover effects
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    map.on("mouseenter", layerId, (e) => {
        const coordinates = e.features?.[0]?.geometry?.coordinates.slice();
        const properties = e.features?.[0]?.properties;

        if (coordinates && properties) {
            popup
                .setLngLat(coordinates)
                .setHTML(
                    `<strong>Crime Type:</strong> ${properties.crimeType}<br>
                     <strong>Police Force:</strong> ${properties.policeForce}<br>
                     <strong>Description:</strong> ${properties.description}<br>
                     <strong>Date:</strong> ${properties.monthYear}`
                )
                .addTo(map);
        }
    });

    map.on("mouseleave", layerId, () => {
        popup.remove();
    });
};


// utils/mapUtils.ts
export const addBoundaryLayerToMap = (map: mapboxgl.Map, geoJson: any) => {
    const layerId = "boundary-layer";

    if (map.getSource(layerId)) {
        map.removeLayer(layerId);
        map.removeSource(layerId);
    }

    map.addSource(layerId, { type: "geojson", data: geoJson });
    map.addLayer({
        id: layerId,
        type: "fill",
        source: layerId,
        paint: {
            "fill-color": "#3388FF",
            "fill-opacity": 0.4,
            "fill-outline-color": "#000000",
        },
    });
};
