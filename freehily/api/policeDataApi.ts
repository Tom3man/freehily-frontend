const BASE_URL = "https://police-608970134245.europe-west2.run.app/";

export const fetchCrimeData = async (longitude: string, latitude: string, radius: string) => {
    try {
        const response = await fetch(`${BASE_URL}/crimes/?longitude=${longitude}&latitude=${latitude}&radius=${radius}`);
        if (!response.ok) {
            throw new Error(`Police Data API returned status ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching crime data:", error);
        throw error;
    }
};
