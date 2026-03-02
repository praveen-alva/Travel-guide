import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAllCountries } from "../api/countries";
import { getUnsplashImage } from "../api/unsplash";
import CountryCard from "../components/CountryCard";
import SEO from "../components/SEO";
import { categories } from "../data/categories";

const Collection = () => {
  const { category } = useParams();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState(null);
  
  // Find category data or use fallback
  const normalizedCategory = category ? category.toLowerCase() : "";
  const categoryData = categories.find(c => c.title.toLowerCase() === normalizedCategory) || {
    title: category || "Collection",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
  };

  useEffect(() => {
    const loadContent = async () => {
       setLoading(true);
       try {
           // 1. Fetch Dynamic Hero Image
           let query = `${categoryData.title} travel`;
           if (normalizedCategory === 'cities') query = "beautiful city skyline architecture";
           if (normalizedCategory === 'nature') query = "breathtaking nature landscape";
           if (normalizedCategory === 'beaches') query = "tropical beach paradise turquoise water";
           if (normalizedCategory === 'culture') query = "cultural festival tradition travel";
           
           getUnsplashImage(query).then(img => {
               if (img) setHeroImage(img);
           });

           // 2. Load Countries
           const data = await fetchAllCountries();
           // Simulate filtering based on category for demo purposes
           // In a real app, data would have 'tags' or 'categories'
           // Here we just shuffle/slice to show "different" content for different collections
           
           let filtered = data;
           // Simple mock logic to show some variety
           if (normalizedCategory === 'cities') {
                filtered = data.filter((_, i) => i % 2 === 0);
           } else if (normalizedCategory === 'nature') {
                filtered = data.filter((_, i) => i % 3 === 0);
           } else if (normalizedCategory === 'beaches') {
               filtered = data.filter((c) => c.region === 'Oceania' || c.region === 'Americas');
           } else if (normalizedCategory === 'culture') {
               filtered = data.filter((c) => c.region === 'Asia' || c.region === 'Europe');
           }
           
           setCountries(filtered.slice(0, 12));
       } catch (error) {
           console.error("Failed to load collection items", error);
       } finally {
           setLoading(false);
       }
    };
    loadContent();
  }, [normalizedCategory, categoryData.title]);

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      <SEO 
        title={`${categoryData.title} Destinations - Travel Guide`}
        description={`Discover the best ${categoryData.title.toLowerCase()} destinations and unforgetable experiences.`}
        image={heroImage || categoryData.image}
      />
      
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage || categoryData.image}
            alt={categoryData.title}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center text-white flex flex-col items-center justify-center h-full pt-10">
          <span className="text-teal-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 animate-fade-in-up">
              Curated Collection
          </span>
          <h1 className="font-serif text-4xl md:text-8xl font-medium tracking-tight mb-6 drop-shadow-2xl animate-fade-in-up animation-delay-100">
            {categoryData.title}
          </h1>
          <p className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-medium drop-shadow-md animate-fade-in-up animation-delay-200">
            Discover the best destinations for {categoryData.title.toLowerCase()} and unforgettable experiences.
          </p>
        </div>
      </section>

      {/* DESTINATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Top Picks</h2>
            <span className="text-gray-500 text-sm hidden sm:block">Handpicked for you</span>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
                 <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {countries.length > 0 ? (
                    countries.map((country) => (
                        <CountryCard key={country.cca2} country={country} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No destinations found for this category.
                    </div>
                )}
             </div>
          )}
          
          <div className="mt-16 text-center border-t border-gray-100 pt-16">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Looking for something else?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                  {categories.filter(c => c.title !== categoryData.title).map(c => (
                      <Link 
                        key={c.title} 
                        to={`/explore/${c.title.toLowerCase()}`}
                        className="px-6 py-3 bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 font-medium rounded-full transition-colors"
                      >
                          Explore {c.title}
                      </Link>
                  ))}
                  <Link to="/explore" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-colors shadow-lg">
                      View All Destinations
                  </Link>
              </div>
          </div>
      </section>

    </div>
  );
};

export default Collection;
