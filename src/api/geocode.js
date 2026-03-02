/**
 * Fetches coordinates for a specific city using Nominatim (OpenStreetMap).
 * @param {string} cityName
 * @returns {Promise<{lat: string, lon: string}|null>}
 */
export const getCityCoordinates = async (cityName) => {
    if (!cityName) return null;
    
    try {
        const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
        const response = await fetch(`${NOMINATIM_BASE_URL}?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
        
        if (!response.ok) {
            throw new Error(`Nominatim error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.warn("Error fetching city coordinates:", error);
    }
    return null;
};
