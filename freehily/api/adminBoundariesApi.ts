const BASE_URL = "https://administrative-boundaries-608970134245.europe-west2.run.app/";

export const fetchAdminBoundaries = async (longitude: string, latitude: string) => {
    try {
        const response = await fetch(`${BASE_URL}/geometries/?longitude=${longitude}&latitude=${latitude}`);
        if (!response.ok) {
            throw new Error(`Admin Boundaries API returned status ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching admin boundaries:", error);
        throw error;
    }
};
