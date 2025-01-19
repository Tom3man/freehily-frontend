export interface CrimeData {
    crime_id: string;
    month_year: string;
    police_force: string;
    longitude: number;
    latitude: number;
    lsoa_code: string;
    crime_type: string;
    location_description: string;
}

export interface BoundaryData {
    name: string;
    source_table: string;
    geometry: string;
}
