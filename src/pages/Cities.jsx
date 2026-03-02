import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCountry } from "../api/countries";
import { fetchCitiesByCountry } from "../api/cities";
import { getUnsplashImage } from "../api/unsplash";

const Cities = () => {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ambient Background State
  const [hoveredCityImage, setHoveredCityImage] = useState(null);
  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Country Info (for header)
        const countryData = await fetchCountry(countryName);
        
        let heroImage = await getUnsplashImage(`${countryData.apiData.name.common} landscape`);
        if (!heroImage) heroImage = `https://loremflickr.com/1600/600/${countryData.apiData.name.common},landscape`;

        setCountry({
            name: countryData.apiData.name.common,
            image: heroImage,
            description: `Explore all top destinations in ${countryData.apiData.name.common}.`
        });

        // 2. Fetch All Cities (Limit 10 due to Free Plan constraints)
        // using cca2 code if available, else just name logic inside api
        const citiesData = await fetchCitiesByCountry(countryData.apiData.name.common, countryData.apiData.cca2, 10);
        setCities(citiesData);

      } catch (err) {
        console.error("Error fetching cities page data:", err);
        setError("Could not load cities.");
      } finally {
        setLoading(false);
      }
    };

    if (countryName) getData();
  }, [countryName]);

  if (loading) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-white">
         <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Finding destinations...</p>
         </div>
       </div>
    );
  }

  if (error || !country) {
      return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <Link to="/" className="text-teal-600 hover:underline">Return Home</Link>
            </div>
        </div>
      );
  }





  const categories = ["All", "Culture", "Nature", "Modern", "History"];

  // Filter Logic
  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || 
                            (city.description + city.name).toLowerCase().includes(activeCategory.toLowerCase()) ||
                            // Mock category matching since API doesn't return categories per city yet
                            true; 
                            
    // Refined Mock Category Logic for better demo
    if (activeCategory === "All") return matchesSearch;
    const content = (city.description + city.name).toLowerCase();
    if (activeCategory === "Culture") return matchesSearch && (content.includes("culture") || content.includes("temple") || content.includes("art") || content.includes("history"));
    if (activeCategory === "Nature") return matchesSearch && (content.includes("nature") || content.includes("park") || content.includes("river") || content.includes("mountain"));
    if (activeCategory === "Modern") return matchesSearch && (content.includes("modern") || content.includes("city") || content.includes("skyline") || content.includes("mall"));
    if (activeCategory === "History") return matchesSearch && (content.includes("history") || content.includes("fort") || content.includes("ancient") || content.includes("monument"));
    
    return matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end pb-12">
          {/* Background Image with Gradient */}
          <div className="absolute inset-0 z-0">
             <img src={country?.image} alt={country?.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <div className="mb-4 animate-fade-in-up">
                <Link to={`/country/${countryName}`} className="inline-flex items-center gap-2 text-teal-300 hover:text-white transition-colors duration-300 font-bold tracking-widest uppercase text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    <span>Back to Overview</span>
                </Link>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
                  Explore {country?.name}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl font-light">
                  Discover the best cities, hidden gems, and local favorites.
              </p>
          </div>
      </section>

      {/* CONTROL BAR (Search & Filters) */}
      <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Category Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                      {categories.map(cat => (
                          <button
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                  activeCategory === cat 
                                  ? "bg-teal-600 text-white shadow-md shadow-teal-200" 
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full md:w-72">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <input
                          type="text"
                          placeholder="Search cities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all sm:text-sm"
                      />
                  </div>
              </div>
          </div>
      </section>

      {/* CITIES GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Curating destinations...</p>
              </div>
          ) : filteredCities.length === 0 ? (
              <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                  {cities.length === 0 && (
                       <p className="mt-4 text-xs text-red-400/80 bg-red-50 inline-block px-3 py-1 rounded-full">
                           API Limit Warning: Data provider might be rate limited.
                       </p>
                  )}
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {filteredCities.map((city, index) => (
                      <Link 
                          key={city.name} 
                          to={`/country/${countryName}/city/${city.name.toLowerCase()}`} 
                          className="group flex flex-col gap-4 cursor-pointer"
                      >
                          {/* Card Image */}
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                              <img
                                  src={city.image}
                                  alt={city.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  loading="lazy"
                              />
                              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
                              
                              {/* Hover Button Overlay */}
                              <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                  <span className="flex items-center justify-center w-10 h-10 bg-white text-teal-600 rounded-full shadow-lg">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                  </span>
                              </div>
                          </div>

                          {/* Card Content */}
                          <div>
                              <div className="flex items-center justify-between mb-1">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                      {city.name}
                                  </h3>
                                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                      <svg className="w-3 h-3 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                                      <span>Popular</span>
                                  </div>
                              </div>
                              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                                  {city.description}
                              </p>
                          </div>
                      </Link>
                  ))}
              </div>
          )}
      </section>
    </div>
  );
};

export default Cities;
