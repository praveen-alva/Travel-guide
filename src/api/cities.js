export const cityData = {
  "new delhi": {
    // ... (keep existing data)
    name: "New Delhi",
    identity: "The cultural and political heart of India",
    image:
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    quickFacts: {
      region: "North India",
      bestTime: "Oct – Mar",
      knownFor: "History & Food",
      duration: "2–3 Days",
      vibe: "Historic & Modern",
    },
    places: [
      {
        name: "India Gate",
        image:
          "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "War Memorial",
      },
      {
        name: "Qutub Minar",
        image:
          "https://images.unsplash.com/photo-1551932732-6ce805c262e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "UNESCO Heritage",
      },
      {
        name: "Red Fort",
        image:
          "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "Mughal Architecture",
      },
      {
        name: "Humayun's Tomb",
        image:
          "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "Garden Tomb",
      },
      {
        name: "Lotus Temple",
        image:
          "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "Bahá'í House of Worship",
      },
      {
        name: "Chandni Chowk",
        image:
          "https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        descriptor: "Old Delhi Market",
      },
    ],
    interests: [
      {
        name: "Culture & History",
        image:
          "https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Food & Markets",
        image:
          "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Nature & Outdoors",
        image:
          "https://images.unsplash.com/photo-1590050752117-9c6031142816?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Modern City",
        image:
          "https://images.unsplash.com/photo-1565509969663-38d7527a6da6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
      },
    ],
    tips: [
      "Use the Delhi Metro to explore efficiently; it's clean, safe, and connects most major spots.",
      "Dress modestly when visiting religious sites (cover shoulders and knees).",
      "Street food is delicious but stick to busy stalls; bottled water is recommended.",
    ],
  },
};

// 1. Primary API: GeoDB (Requires Key, Rate Limited)
const GEODB_BASE_URL = import.meta.env.VITE_GEODB_BASE_URL;
const GEODB_API_KEY = import.meta.env.VITE_GEODB_API_KEY;
const GEODB_HOST = import.meta.env.VITE_GEODB_HOST;

// 2. Backup API: CountriesNow (Free, No Key)
const COUNTRIESNOW_BASE_URL = "https://countriesnow.space/api/v0.1/countries/cities";

import { getUnsplashImage } from './unsplash';

export const fetchCitiesByCountry = async (countryName, countryCode, limit = 10) => {
  if (!countryName) return [];

  const CACHE_KEY = `cities_v2_${countryCode}_${limit}`;
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // 1. Check Cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
          console.log(`Using cached cities for ${countryName}`);
          return data;
      }
  }

  console.log(`Fetching cities for ${countryName} (${countryCode}) with limit ${limit}`);

  // --- STRATEGY 1: Try GeoDB (Best Quality: Sorts by Population) ---
  if (countryCode) {
      try {
        const options = {
            method: 'GET',
            headers: {
            'x-rapidapi-key': GEODB_API_KEY,
            'x-rapidapi-host': GEODB_HOST
            }
        };

        const response = await fetch(
            `${GEODB_BASE_URL}/cities?countryIds=${countryCode}&types=CITY&sort=-population&limit=${limit}&minPopulation=50000`,
            options
        );

        if (response.ok) {
           const data = await response.json();
           console.log("GeoDB Response:", data);

           if (data.data && data.data.length > 0) {
              const cityPromises = data.data.map(async (city, index) => {
                  let image = await getUnsplashImage(`${city.name} city landmark`);
                  
                  // If Unsplash returns null (error/limit), use fallback with lock
                  if (!image) {
                      image = `https://loremflickr.com/800/600/${city.name.replace(/\s+/g, ',')},city?lock=${index}`;
                  }

                  // Check for static data match first
                  const normalizedName = city.name.toLowerCase();
                  let customDescription = null;
                  
                  const majorCities = {
                    "mumbai": "The city of dreams, known for its vibrant nightlife, Bollywood, and colonial architecture.",
                    "bengaluru": "The Silicon Valley of India, famous for its parks, nightlife, and pleasant climate.",
                    "hyderabad": "A city of pearls and biryani, blending rich history with a booming tech industry.",
                    "chennai": "The cultural capital of South India, known for its temples, beaches, and classical arts.",
                    "kolkata": "The artistic and intellectual capital, famous for its literature, sweets, and colonial heritage.",
                    "jaipur": "The Pink City, known for its stunning palaces, forts, and vibrant bazaars.",
                    "udaipur": "The City of Lakes, famous for its romantic setting and lavish royal residences.",
                    "agra": "Home to the Taj Mahal, a symbol of eternal love and Mughal architectural brilliance.",
                    "varanasi": "The spiritual capital of India, one of the world's oldest living cities on the banks of the Ganges.",
                    "kochi": "Queen of the Arabian Sea, known for its Chinese fishing nets and colonial history.",
                    "pune": "The Oxford of the East, a vibrant hub of education, culture, and history."
                  };

                  if (majorCities[normalizedName]) {
                     customDescription = majorCities[normalizedName];
                  } else if (cityData[normalizedName]?.identity) {
                     customDescription = cityData[normalizedName].identity;
                  }

                  // Fallback Templates
                  const templates = [
                    `Discover the unique charm and vibrant streets of ${city.name}.`,
                    `A bustling hub in ${city.country}, offering a mix of history and modernity.`,
                    `Explore ${city.name}, known for its local culture and welcoming atmosphere.`,
                    `Experience the authentic lifestyle and landmarks of ${city.name}.`
                  ];
                  const randomTemplate = templates[index % templates.length];

                  return {
                    name: city.name,
                    image: image, 
                    description: customDescription || randomTemplate,
                    lat: city.latitude,
                    lon: city.longitude
                  };
              });
              
              const formatted = await Promise.all(cityPromises);
              console.log(`Successfully fetched ${formatted.length} cities.`);
              
              // 2. Save to Cache
              localStorage.setItem(CACHE_KEY, JSON.stringify({
                  timestamp: Date.now(),
                  data: formatted
              }));

              return formatted;
           } else {
               console.warn("GeoDB returned no cities.");
           }
        } else {
            console.error(`GeoDB Error: ${response.status} ${response.statusText}`);
            if (response.status === 429) {
                console.warn("Rate limit exceeded. Try again later.");
            }
        }
      } catch (error) {
        console.warn("GeoDB API failed:", error);
      }
  }

  // If we reach here, it means GeoDB failed or didn't return data.
  return [];
};

// Helper to get City ID first (needed for nearby search)
const fetchCityId = async (cityName) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': GEODB_API_KEY,
                'x-rapidapi-host': GEODB_HOST
            }
        };
        const response = await fetch(
            `${GEODB_BASE_URL}/cities?namePrefix=${encodeURIComponent(cityName)}&limit=1&sort=-population`,
            options
        );
        const data = await response.json();
        return data.data && data.data.length > 0 ? data.data[0].id : null;
    } catch (e) {
        console.warn("Failed to fetch city ID:", e);
        return null;
    }
};

// In-memory request deduplication to prevent 429s
const pendingRequestMap = new Map();

export const fetchCitiesNearCity = async (cityName, limit = 5) => {
    if (!cityName) return [];

    const CACHE_KEY = `nearby_${cityName}_${limit}`;
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 Hours

    // 1. Check LocalStorage Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            console.log(`Using cached nearby cities for ${cityName}`);
            return data;
        }
    }

    // 2. Check In-Flight Pending Requests (Dedup)
    const requestKey = `req_${cityName}_${limit}`;
    if (pendingRequestMap.has(requestKey)) {
        console.log(`Using in-flight API request for ${cityName}`);
        return pendingRequestMap.get(requestKey);
    }

    // 3. Perform Fetch
    const fetchPromise = (async () => {
        try {
            const cityId = await fetchCityId(cityName);
            if (!cityId) throw new Error("City ID not found");

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': GEODB_API_KEY,
                    'x-rapidapi-host': GEODB_HOST
                }
            };

            // Radius: 300km
            const response = await fetch(
                `${GEODB_BASE_URL}/cities/${cityId}/nearbyCities?radius=300&limit=${limit}&minPopulation=50000&sort=-population`, 
                options
            );

            if (response.status === 429) {
                console.warn("GeoDB Rate Limit Exceeded (429)");
                return [];
            }

            if (!response.ok) throw new Error("GeoDB Nearby API failed");

            const data = await response.json();
            
            if (data.data) {
                 const cityPromises = data.data.map(async (city, index) => {
                      let image = await getUnsplashImage(`${city.name} city landmark`);
                      if (!image) {
                          image = `https://loremflickr.com/800/600/${city.name.replace(/\s+/g, ',')},city?lock=${index}`;
                      }
                      
                      return {
                        name: city.name,
                        image: image, 
                        distance: city.distance ? `${Math.round(city.distance * 1.609)} km` : "Nearby",
                        description: `Explore ${city.name}, a vibrant destination nearby.`
                      };
                  });
                  
                  const formatted = await Promise.all(cityPromises);
                  
                  // Save to Cache
                  localStorage.setItem(CACHE_KEY, JSON.stringify({
                      timestamp: Date.now(),
                      data: formatted
                  }));

                  return formatted;
            }
        } catch (error) {
            console.warn("Error fetching nearby cities:", error);
            return [];
        }
    })();

    // Store in map
    pendingRequestMap.set(requestKey, fetchPromise);

    // Cleanup map after completion
    return fetchPromise.finally(() => {
        pendingRequestMap.delete(requestKey);
    });
};

