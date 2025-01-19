export interface GeoJsonFeature {
    type: "Feature";
    geometry: {
        type: "Point" | "Polygon" | "MultiPolygon";
        coordinates: any;
    };
    properties: Record<string, any>;
}

export interface GeoJson {
    type: "FeatureCollection";
    features: GeoJsonFeature[];
}
