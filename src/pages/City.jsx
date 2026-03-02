import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUnsplashImage } from "../api/unsplash";
import { fetchPlacesForCity } from "../api/places";
import { fetchCitiesNearCity } from "../api/cities";
import { getCityCoordinates } from "../api/geocode";
import { useWishlist } from "../context/WishlistContext";
import CityMap from "../components/CityMap";
import SEO from "../components/SEO";

const City = () => {
  const { city, country } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  // Ensure country name is capitalized for display
  const countryName = country ? country.charAt(0).toUpperCase() + country.slice(1) : ""; 
  const displayName = city ? city.charAt(0).toUpperCase() + city.slice(1) : "Destination";

  const [cityInfo, setCityInfo] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadCityData = async () => {
      // 0. Prepare Initial Data immediately
      const initialData = {
          name: displayName,
          identity: `The heartbeat of ${countryName || "the region"}`,
          image: `https://loremflickr.com/1600/900/${city},city,landmark`,
          quickFacts: {
              region: countryName || "Local Region",
              bestTime: "Year-round",
              knownFor: "Culture & Sights",
              duration: "3–4 Days",
              vibe: "Vibrant & Welcoming"
          },
          places: [
              { name: "City Center", query: "downtown square", descriptor: "Heart of the City" },
              { name: "National Museum", query: "museum architecture", descriptor: "History & Art" },
              { name: "Central Park", query: "park garden", descriptor: "Nature & Relax" },
              { name: "Local Market", query: "market food", descriptor: "Shopping & Cuisine" },
              { name: "Historic Old Town", query: "old street", descriptor: "Heritage" },
              { name: "Waterfront / Viewpoint", query: "river view", descriptor: "Scenic Views" }
          ],
          interests: [
              { name: "History & Landmarks", query: "history landmark" },
              { name: "Food & Dining", query: "food restaurant" },
              { name: "Art & Culture", query: "art gallery" },
              { name: "Nightlife", query: "night city" }
          ],
          tips: [
              `Explore ${displayName} by walking to soak in the atmosphere.`,
              "Try the local street food for authentic flavors.",
              "Visit main attractions early to avoid crowds."
          ]
      };

      // 1. Render immediately with fallback data
      setCityInfo(initialData);
      setLoading(false);

      try {
        // 2. Background Fetch: Main Image & Coordinates
        getUnsplashImage(`${city} city landmark`).then(img => {
            if (img) {
                setCityInfo(prev => ({ ...prev, image: img }));
            }
        });
        
        getCityCoordinates(city).then(coords => {
            if (coords) {
                setMapCenter([coords.lat, coords.lon]);
            }
        });

        // 3. Background Fetch: Places (Dynamic or Fallback enrichment)
        fetchPlacesForCity(city).then(async (dynamicPlaces) => {
             let placesToUse = dynamicPlaces;
             
             // If no dynamic places, use initialData.places but fetch images for them
             if (!dynamicPlaces || dynamicPlaces.length === 0) {
                // We initially stick with what we have (fallbacks), but we can try to improve them
                const improvedPlacesPromises = initialData.places.map(async (place) => {
                     const img = await getUnsplashImage(`${city} ${place.query}`);
                     return img ? { ...place, image: img } : place; // Override only if we get a better image
                });
                placesToUse = await Promise.all(improvedPlacesPromises);
             } 
             
             setCityInfo(prev => ({ ...prev, places: placesToUse }));
        });

        // 4. Background Fetch: Interests Images
        const interestsPromises = initialData.interests.map(async (interest) => {
             const img = await getUnsplashImage(`${city} ${interest.query}`);
             return img ? { ...interest, image: img } : interest;
        });

        Promise.all(interestsPromises).then(resolvedInterests => {
             setCityInfo(prev => ({ ...prev, interests: resolvedInterests }));
        });

      } catch (error) {
        console.error("Error updating city data in background:", error);
      }
    };
    
    const loadNearbyCities = async () => {
         // Fetch nearby cities in parallel (dynamic)
         try {
             fetchCitiesNearCity(city).then(nearby => {
                 setNearbyCities(nearby);
             });
         } catch (e) {
             console.warn("Could not fetch nearby cities", e);
         }
    };

    if (city) {
        loadCityData();
        loadNearbyCities();
    }
  }, [city, countryName]);


  if (loading) {
     return (
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
             <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">Curating your guide to {displayName}...</p>
          </div>
        </div>
     );
  }

  if (!cityInfo) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-600">City not found. Try "New Delhi".</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex-grow">
      <SEO 
        title={`${displayName}, ${countryName} - City Guide`}
        description={`Explore the best of ${displayName}. Top attractions, food, culture, and travel tips for your ${displayName} adventure.`}
        image={cityInfo.image}
      />
      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img
            src={cityInfo.image}
            alt={cityInfo.name}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center text-white flex flex-col items-center justify-center h-full pt-10">
          
          <h1 className="font-serif text-4xl md:text-9xl font-medium tracking-tight mb-6 drop-shadow-2xl opacity-0 animate-fade-in-up">
            {cityInfo.name}
          </h1>
          
          <div className="h-px w-24 bg-white/50 mb-6 opacity-0 animate-fade-in-up animation-delay-300"></div>

          <p className="font-sans text-sm md:text-base uppercase tracking-[0.3em] text-white/90 font-medium drop-shadow-md opacity-0 animate-fade-in-up animation-delay-500">
            {cityInfo.identity}
          </p>

          {/* Scroll Cue */}
           <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/60 animate-bounce pointer-events-none opacity-0 animate-fade-in delay-1000">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Explore</span>
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
        </div>
      </section>



      {/* 2. SNAPSHOT (QUICK FACTS) */}
      {/* 2. SNAPSHOT (QUICK FACTS) */}
      {/* 2. CURATOR'S CHOICE EDITORIAL */}


      {/* 3. TOP PLACES TO VISIT */}
      <section className="max-w-7xl mx-auto px-4 mb-20 mt-24">
        <div className="text-center md:text-left mb-10 pl-2">
           <h2 className="text-3xl font-bold text-gray-900">Top places to visit</h2>
           <p className="text-gray-500 mt-2">Must-see attractions in {cityInfo.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {cityInfo.places.map((place) => (
               <Link to={`/attraction/${place.name.toLowerCase().replace(/ /g, '-')}`} key={place.name} className="group cursor-pointer block">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                     <img 
                        src={place.image} 
                        alt={place.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                  
                  {/* Content Below */}
                  <div className="px-1">
                     <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
                        {place.descriptor}
                     </span>
                     <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between group-hover:text-teal-700 transition-colors">
                        {place.name}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleWishlist({
                                        id: place.name,
                                        type: 'attraction',
                                        name: place.name,
                                        image: place.image,
                                        city: city,
                                        country: countryName
                                    });
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    isInWishlist(place.name, 'attraction')
                                        ? 'text-red-500 bg-red-50'
                                        : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill={isInWishlist(place.name, 'attraction') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                            </button>
                             <svg className="w-5 h-5 text-gray-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                     </h3>
                  </div>
               </Link>
           ))}
        </div>
      </section>

      {/* 4. EXPLORE BY INTEREST */}
      <section className="bg-gray-50 py-20">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center md:text-left mb-12">
               <h2 className="text-3xl font-bold text-gray-900">Explore by interest</h2>
               <p className="text-gray-500 mt-2">Curated experiences for every traveler type</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {cityInfo.interests.map((interest) => (
                  <div key={interest.name} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                     <img src={interest.image} alt={interest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />
                     
                     <div className="absolute bottom-0 left-0 p-5 w-full">
                        <span className="block text-xs text-teal-300 font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">Discover</span>
                        <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{interest.name} in {cityInfo.name}</h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>


       {/* NEW: EXPLORE NEARBY */}
       {nearbyCities.length > 0 && (
           <section className="py-20 bg-white border-t border-gray-100">
               <div className="max-w-7xl mx-auto px-4">
                   <div className="text-center md:text-left mb-12">
                       <h2 className="text-3xl font-bold text-gray-900">Explore Nearby</h2>
                       <p className="text-gray-500 mt-2">Discover destinations just a short trip away</p>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                       {nearbyCities.map((item) => (
                           <Link to={`/country/${countryName ? countryName.toLowerCase() : 'dest'}/city/${item.name.toLowerCase()}`} key={item.name} className="group block">
                               <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-sm group-hover:shadow-md transition-all">
                                   <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-teal-700 shadow-sm">
                                       {item.distance}
                                   </div>
                               </div>
                               <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                               <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                           </Link>
                       ))}
                   </div>
               </div>
           </section>
       )}

      {/* 5. CITY MAP */}
      <section className="max-w-7xl mx-auto px-4 py-20">
         
         {/* Map */}
         <div className="w-full">
            <div className="mb-6">
               <h3 className="text-2xl font-bold text-gray-900">Explore places on the map</h3>
               <p className="text-gray-500">View attractions geographically to plan your route</p>
            </div>
            
            <div className="relative w-full max-w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-gray-200 group min-h-[500px]">
               {/* Interactive Map */}
               <CityMap center={mapCenter} places={cityInfo.places} cityName={cityInfo.name} />
            </div>
         </div>

      </section>

    </div>
  );
};

export default City;