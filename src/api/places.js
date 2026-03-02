import { getUnsplashImage } from './unsplash';

// Nominatim API (OpenStreetMap) - Free, no key required
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

// Curated list of major landmarks for popular cities to ensure "Must See" quality.
const MAJOR_CITY_LANDMARKS = {
    "mumbai": ["Gateway of India", "Marine Drive", "Chhatrapati Shivaji Maharaj Terminus", "Elephanta Caves", "Haji Ali Dargah", "Siddhivinayak Temple"],
    "delhi": ["Red Fort", "India Gate", "Qutub Minar", "Humayun's Tomb", "Lotus Temple", "Akshardham"],
    "new delhi": ["Red Fort", "India Gate", "Qutub Minar", "Humayun's Tomb", "Lotus Temple", "Akshardham"],
    "bengaluru": ["Bangalore Palace", "Lalbagh Botanical Garden", "Cubbon Park", "Tipu Sultan's Summer Palace", "ISKCON Temple"],
    "bangalore": ["Bangalore Palace", "Lalbagh Botanical Garden", "Cubbon Park", "Tipu Sultan's Summer Palace", "ISKCON Temple"],
    "hyderabad": ["Charminar", "Golconda Fort", "Ramoji Film City", "Hussain Sagar Lake", "Chowmahalla Palace"],
    "chennai": ["Marina Beach", "Kapaleeshwarar Temple", "Fort St. George", "San Thome Cathedral"],
    "kolkata": ["Victoria Memorial", "Howrah Bridge", "Dakshineswar Kali Temple", "Indian Museum"],
    "jaipur": ["Hawa Mahal", "Amber Palace", "City Palace", "Jantar Mantar", "Nahargarh Fort"],
    "udaipur": ["City Palace", "Lake Pichola", "Jag Mandir", "Saheliyon Ki Bari"],
    "agra": ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Tomb of Akbar the Great"],
    "paris": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Sacre-Coeur"],
    "london": ["Big Ben", "Tower of London", "London Eye", "Buckingham Palace", "British Museum"],
    "new york": ["Statue of Liberty", "Central Park", "Empire State Building", "Times Square", "Brooklyn Bridge"],
    "dubai": ["Burj Khalifa", "The Dubai Mall", "Palm Jumeirah", "Burj Al Arab", "Dubai Marina"]
};

/**
 * Fetches interesting places (tourist attractions, landmarks) for a specific city.
 * Uses OpenStreetMap for data and Unsplash for images.
 * @param {string} cityName 
 * @returns {Promise<Array>} Array of place objects
 */
export const fetchPlacesForCity = async (cityName) => {
    if (!cityName) return [];

    console.log(`Fetching dynamic places for ${cityName}...`);
    const normalizedCity = cityName.toLowerCase().trim();

    let candidates = [];

    // STRATEGY 1: Check Curated List
    // STRATEGY 1: Check Curated List
    if (MAJOR_CITY_LANDMARKS[normalizedCity]) {
        console.log(`Using curated landmarks for ${cityName}`);
        const curatedNames = MAJOR_CITY_LANDMARKS[normalizedCity];
        
        // Fetch coordinates for each curated place
        const curatedPromises = curatedNames.map(async (name) => {
            let lat = null, lon = null;
            try {
                 const res = await fetch(`${NOMINATIM_BASE_URL}?q=${encodeURIComponent(name + " " + cityName)}&format=json&limit=1`);
                 const data = await res.json();
                 if (data && data.length > 0) {
                     lat = data[0].lat;
                     lon = data[0].lon;
                 }
            } catch (e) {
                console.warn(`Could not fetch coords for ${name}`);
            }

            return {
                name: name,
                type: "attraction",
                descriptor: "Must Visit",
                lat: lat,
                lon: lon
            };
        });

        candidates = await Promise.all(curatedPromises);

    } else {
        // STRATEGY 2: Dynamic Search via Nominatim
        console.log(`Using Nominatim search for ${cityName}`);
        
        // More specific queries to avoid generic results
        const queries = [
            `tourism in ${cityName}`,
            `attractions in ${cityName}`,
            `landmark in ${cityName}`
        ];

        try {
            const fetchPromises = queries.map(q => 
                fetch(`${NOMINATIM_BASE_URL}?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=8&accept-language=en`)
                    .then(res => res.json())
            );

            const resultsArrays = await Promise.all(fetchPromises);
            
            // Flatten and Deduplicate
            const allResults = resultsArrays.flat();
            const seenNames = new Set();

            for (const place of allResults) {
                // Clean up name
                const rawName = place.name || "";
                if (!rawName) continue;
                
                // Remove city name from place name if present (e.g. "Museum of City")
                // but keep if it's part of a specific name
                if (rawName.toLowerCase() ===  normalizedCity) continue;

                const normalizedName = rawName.toLowerCase();

                // DEDUPLICATION
                if (seenNames.has(normalizedName)) continue;
                seenNames.add(normalizedName);

                // FILTERING BAD RESULTS
                const badKeywords = ['hotel', 'hostel', 'guest house', 'motel', 'road', 'street', 'way', 'lane', 'district', 'region'];
                if (badKeywords.some(kw => normalizedName.includes(kw))) continue;

                candidates.push({
                    name: rawName,
                    type: place.type, 
                    lat: place.lat, // Capture Latitude
                    lon: place.lon, // Capture Longitude
                    importance: place.importance || 0,
                    descriptor: formatDescriptor(place.type || place.category || "attraction") 
                });
            }
            
            // Limit to top 6 by importance
            candidates.sort((a, b) => b.importance - a.importance);
            candidates = candidates.slice(0, 6);

        } catch (error) {
            console.error("Nominatim search failed:", error);
        }
    }

    // Fallback if no candidates found
    if (candidates.length === 0) return [];

    // Enhance with Images (Unsplash)
    // We do this for both curated and dynamic results
    const enhancedPlaces = await Promise.all(candidates.map(async (place) => {
        // Construct a strong search query for Unsplash
        // For curated: "Gateway of India Mumbai"
        // For dynamic: "Museum Name City"
        const query = `${place.name} ${cityName}`;
        
        const image = await getUnsplashImage(query); // Unsplash handles caching/logic inside
        
        return {
            name: place.name,
            descriptor: place.descriptor,
            lat: place.lat,
            lon: place.lon,
            query: query,
            image: image || `https://loremflickr.com/800/600/${cityName},landmark,${place.name.replace(/\s+/g, ',')}` 
        };
    }));

    return enhancedPlaces;
};

const formatDescriptor = (type) => {
    if (!type) return "Must See";
    if (type === 'yes') return "Attraction";
    // Capitalize and clean
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
