/**
 * Parses a WKT string into GeoJSON geometry.
 * Supports "POLYGON" and "MULTIPOLYGON" types.
 */
const parseWKTToGeoJson = (wkt: string) => {
    if (wkt.startsWith("POLYGON")) {
        const coordinates = wkt
            .replace("POLYGON((", "")
            .replace("))", "")
            .split(",")
            .map((pair) => pair.trim().split(" ").map(Number));
        return {
            type: "Polygon",
            coordinates: [coordinates],
        };
    }

    if (wkt.startsWith("MULTIPOLYGON")) {
        const polygons = wkt
            .replace("MULTIPOLYGON(((", "")
            .replace(")))", "")
            .split(")),((")
            .map((polygon) =>
                polygon.split(",").map((pair) => pair.trim().split(" ").map(Number))
            );
        return {
            type: "MultiPolygon",
            coordinates: polygons.map((coords) => [coords]),
        };
    }

    throw new Error("Unsupported WKT type");
};


export const transformBoundaryDataToGeoJson = (boundaryData: Array<any>) => {
    return {
        type: "FeatureCollection",
        features: boundaryData.map((boundary) => ({
            type: "Feature",
            geometry: parseWKTToGeoJson(boundary.geometry),
            properties: {
                name: boundary.name,
                source: boundary.source_table,
            },
        })),
    };
};

export const transformCrimeDataToGeoJson = (crimeData: Array<any>) => {
    return {
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
};

