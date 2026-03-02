import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllCountries } from "../api/countries";
import CountryCard from "../components/CountryCard";

const ExploreBackup = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadCountries = async () => {
       const data = await fetchAllCountries();
       setCountries(data);
       setFilteredCountries(data);
       setVisibleCountries(data.slice(0, ITEMS_PER_PAGE));
       setLoading(false);
    };
    loadCountries();
  }, []);

  useEffect(() => {
     let result = countries;

     // 1. Search Filter
     if (searchTerm) {
         const lower = searchTerm.toLowerCase();
         result = result.filter(c => c.name.toLowerCase().includes(lower));
     }

     // 2. Region Filter
     if (regionFilter !== "All") {
         result = result.filter(c => c.region === regionFilter);
     }

     setFilteredCountries(result);
     setPage(1); // Reset page on filter change
     setVisibleCountries(result.slice(0, ITEMS_PER_PAGE));
  }, [searchTerm, regionFilter, countries]);

  const loadMore = () => {
      const nextPage = page + 1;
      const nextItems = filteredCountries.slice(0, nextPage * ITEMS_PER_PAGE);
      setVisibleCountries(nextItems);
      setPage(nextPage);
  };

  const regions = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* Header Section */}
      <section className="bg-teal-50 py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto text-center">
            <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">Discover the World</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">All Countries</h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Explore our comprehensive guide to every country in the world.
            </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-10 sticky top-[61px] z-30 bg-white/95 backdrop-blur-md py-4 shadow-sm rounded-xl transition-all border border-gray-100/50">
         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                 <input 
                    type="text" 
                    placeholder="Search countries..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                 />
                 <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>

             <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar">
                {regions.map(r => (
                    <button 
                        key={r}
                        onClick={() => setRegionFilter(r)}
                        className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${regionFilter === r ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {r}
                    </button>
                ))}
             </div>
         </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
          {loading ? (
             <div className="flex justify-center py-20">
                 <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {visibleCountries.map((country) => (
                    <CountryCard key={country.cca2} country={country} />
                ))}
              </div>
              
              {/* Load More Button */}
              {visibleCountries.length < filteredCountries.length && (
                  <div className="mt-12 text-center">
                      <button 
                        onClick={loadMore}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-full shadow-sm hover:bg-gray-50 hover:shadow-md transition-all active:scale-95"
                      >
                          Load More Destinations
                      </button>
                      <p className="mt-2 text-sm text-gray-400">
                          Showing {visibleCountries.length} of {filteredCountries.length} countries
                      </p>
                  </div>
              )}

              {filteredCountries.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                      <p className="text-xl">No countries found matching your search.</p>
                      <button onClick={() => {setSearchTerm(""); setRegionFilter("All")}} className="mt-4 text-teal-600 font-bold hover:underline">Clear Filters</button>
                  </div>
              )}
            </>
          )}
      </section>

    </div>
  );
};

export default ExploreBackup;
