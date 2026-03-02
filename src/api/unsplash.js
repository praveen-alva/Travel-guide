const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const BASE_URL = 'https://api.unsplash.com';

/**
 * Fetches a single photo from Unsplash based on a search query.
 * @param {string} query - The search term (e.g., "Paris", "France").
 * @param {string} orientation - 'landscape', 'portrait', or 'squarish'. Default 'landscape'.
 * @returns {Promise<string|null>} - The image URL or null if failed.
 */
export const getUnsplashImage = async (query, orientation = 'landscape') => {
  if (!ACCESS_KEY) {
    console.warn("Unsplash API Key is missing!");
    return null;
  }

  const cacheKey = `unsplash_${query}_${orientation}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { url, timestamp } = JSON.parse(cachedData);
      // Cache validity: 24 hours (1000 * 60 * 60 * 24)
      if (Date.now() - timestamp < 86400000) {
        return url;
      }
    } catch (e) {
      console.warn("Error parsing cached image data", e);
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;

      // Save to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          url: imageUrl,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn("Failed to save to localStorage (likely quota exceeded)", e);
      }

      return imageUrl;
    }

    return null;
  } catch (error) {
    if (error.message.includes("403")) {
      console.warn("Unsplash rate limit hit. Switching to fallback images.");
    } else {
      console.error("Error fetching Unsplash image:", error);
    }
    return null;
  }
};

/**
 * Fetches multiple photos from Unsplash.
 * @param {string} query - The search term.
 * @param {number} count - Number of images to fetch.
 * @returns {Promise<Array<string>>} - Array of image URLs.
 */
export const getUnsplashImages = async (query, count = 5) => {
  if (!ACCESS_KEY) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` }
      }
    );

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    return data.results ? data.results.map(img => img.urls.regular) : [];
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    return [];
  }
};
