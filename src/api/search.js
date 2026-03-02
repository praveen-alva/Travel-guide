import { getUnsplashImage } from "./unsplash";

const REST_COUNTRIES_BASE_URL = import.meta.env.VITE_REST_COUNTRIES_BASE_URL;
const GEODB_BASE_URL_ENV = import.meta.env.VITE_GEODB_BASE_URL;
const GEODB_API_KEY_ENV = import.meta.env.VITE_GEODB_API_KEY;
const GEODB_HOST_ENV = import.meta.env.VITE_GEODB_HOST;


export const globalSearch = async (query) => {
    if (!query || query.length < 2) return { countries: [], cities: [] };

    const cleanQuery = query.toLowerCase().trim();

    try {
        console.log("Fetching search results for:", cleanQuery);
        const [countries, cities] = await Promise.all([
            searchCountries(cleanQuery),
            searchCities(cleanQuery)
        ]);
        console.log("Search complete.", { countries, cities });
        return { countries, cities };
    } catch (error) {
        console.error("Global search failed:", error);
        return { countries: [], cities: [] };
    }
};

const searchCountries = async (query) => {
    try {
        const response = await fetch(`${REST_COUNTRIES_BASE_URL}/name/${query}`);
        if (!response.ok) return [];
        
        const data = await response.json();
        
        // Map and limit results
        const results = await Promise.all(data.slice(0, 5).map(async (country) => {
            const name = country.name.common;
            // Try to get a nice image, fallback to flags if needed or LoremFlickr
            const image = await getUnsplashImage(`${name} country landmark`) || `https://loremflickr.com/800/600/${name},landmark`;
            
            return {
                type: 'country',
                name: name,
                subtext: country.region,
                image: image,
                id: country.cca2, // unique ID
                link: `/country/${name.toLowerCase()}`
            };
        }));
        
        return results;
    } catch (error) {
        console.warn("Country search error:", error);
        return [];
    }
};

const searchCities = async (query) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': GEODB_API_KEY_ENV,
                'x-rapidapi-host': GEODB_HOST_ENV
            }
        };

        const response = await fetch(
            `${GEODB_BASE_URL_ENV}/cities?namePrefix=${query}&limit=5&sort=-population`,
            options
        );

        if (!response.ok) return [];

        const data = await response.json();
        
        if (!data.data) return [];

        const results = await Promise.all(data.data.map(async (city) => {
            const fullName = `${city.name}`;
            const image = await getUnsplashImage(`${fullName} city`) || `https://loremflickr.com/800/600/${fullName},city`;

            return {
                type: 'city',
                name: city.name,
                subtext: city.country,
                image: image,
                id: city.id,
                link: `/country/${city.country.toLowerCase()}/city/${city.name.toLowerCase()}` // Assuming this route structure
            };
        }));

        return results;

    } catch (error) {
        console.warn("City search error:", error);
        return [];
    }
};
