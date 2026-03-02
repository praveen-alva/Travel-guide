import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { globalSearch } from "../api/search";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  
  const [results, setResults] = useState({ countries: [], cities: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      console.log("Searching for:", query);
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const data = await globalSearch(query);
      setResults(data);
      setLoading(false);
    };

    performSearch();
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500 mb-8">
            {loading 
                ? `Searching for "${query}"...` 
                : `Showing results for "${query}"`
            }
        </p>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
           </div>
        ) : (
           <div className="space-y-12">
             
             {/* COUNTRIES SECTION */}
             {results.countries.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                        Countries
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.countries.map(item => (
                            <Link to={item.link} key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{item.subtext}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
             )}

             {/* CITIES SECTION */}
             {results.cities.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-3m-1 0h7m-5 0v-3"></path></svg>
                        </span>
                        Cities
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.cities.map(item => (
                            <Link to={item.link} key={item.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{item.subtext}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
             )}

             {/* NO RESULTS */}
             {!loading && results.countries.length === 0 && results.cities.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                     <p className="text-gray-400 text-lg">No destinations found for "{query}".</p>
                     <p className="text-gray-400 text-sm mt-2">Try checking the spelling or searching for a major country/city.</p>
                 </div>
             )}

           </div>
        )}
      </div>
    </div>
  );
};

export default Search;
