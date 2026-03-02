// Static data removed to force dynamic loading for all countries
export const countryData = {};

const BASE_URL = import.meta.env.VITE_REST_COUNTRIES_BASE_URL;

export const fetchCountry = async (name) => {
  try {
    // In api/countries.js
    const response = await fetch(`${BASE_URL}/name/${name}`); // Removed strict fullText=true for better matching
    if (!response.ok) {
      throw new Error(`Country not found: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Fuzzy search 'India' returns 'British Indian Ocean Territory' first. 
    // We must prioritize an exact match.
    const exactMatch = data.find(
      (country) => country.name.common.toLowerCase() === name.toLowerCase()
    );

    const apiData = exactMatch || data[0];
    
    // Return pure API data structure
    return {
      name: apiData.name.common,
      officialName: apiData.name.official,
      region: apiData.region,
      subregion: apiData.subregion,
      capital: apiData.capital ? apiData.capital[0] : "N/A",
      population: apiData.population,
      flags: apiData.flags,
      startOfWeek: apiData.startOfWeek,
      latlng: apiData.latlng, // Coordinate center
      apiData: apiData // raw data
    };
    
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

export const fetchAllCountries = async () => {
  try {
    // Check cache first to avoid slow 250+ item load
    const cached = localStorage.getItem("all_countries_cache");
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) { // 24 hour cache
         return data;
      }
    }

    const response = await fetch(`${BASE_URL}/all?fields=name,cca2,region,flags,population,capital`);
    if (!response.ok) {
       throw new Error(`Failed to fetch countries: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // transform for easier usage
    const formatted = data.map(c => ({
        name: c.name.common,
        cca2: c.cca2,
        region: c.region,
        flag: c.flags.svg || c.flags.png,
        population: c.population,
        capital: c.capital ? c.capital[0] : 'N/A'
    })).sort((a, b) => a.name.localeCompare(b.name));

    localStorage.setItem("all_countries_cache", JSON.stringify({
       timestamp: Date.now(),
       data: formatted
    }));

    return formatted;
  } catch (error) {
     console.error("Error fetching all countries:", error);
     return [];
  }
};
