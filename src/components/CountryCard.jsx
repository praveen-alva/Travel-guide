import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUnsplashImage } from '../api/unsplash';
import { useWishlist } from '../context/WishlistContext';

const CountryCard = ({ country }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      // 1. Try to get a scenic image
      // We append "landmark" or "travel" to get better results than just the name
      try {
        const url = await getUnsplashImage(`${country.name} iconic landmark, travel`);
        if (isMounted && url) {
            setImageUrl(url);
        }
      } catch (err) {
        console.warn(`Failed to fetch image for ${country.name}`, err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [country.name]);

  // Fallback: Use LoremFlickr if Unsplash fails (null), or Flag if all else fails
  const displayImage = imageUrl || `https://loremflickr.com/600/400/${country.name.replace(/\s+/g, ',')},travel/all`;

  return (
    <Link 
        to={`/country/${country.name.toLowerCase()}`}
        className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1 h-full"
    >
        {/* Simple Image Container - Fixed Aspect Ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
             <img 
                src={displayImage} 
                alt={country.name} 
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${loading ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
                onLoad={() => setLoading(false)}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = country.flag; 
                    e.target.style.objectFit = "cover";
                }}
            />
            {/* Region Label */}
            <div className="absolute top-3 left-3">
                 <span className="bg-white/90 backdrop-blur-sm text-teal-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    {country.region}
                </span>
            </div>
        </div>

        {/* Clean Content Area */}
        <div className="p-5 flex flex-col flex-grow">
            
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1">
                    {country.name}
                </h3>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-medium">
                 <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    {(country.population / 1000000).toFixed(1)}M
                 </span>
                 <span className="flex items-center gap-1 truncate max-w-[100px]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {country.capital}
                 </span>
            </div>

            {/* Description - Simplified */}
            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                 Discover the unique culture and beautiful landscapes of {country.name}.
            </p>

            {/* Action Footer */}
             <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium group-hover:text-teal-600 transition-colors">View Guide</span>
                
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist({
                            id: country.name,
                            type: 'country',
                            name: country.name,
                            image: displayImage,
                            region: country.region
                        });
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isInWishlist(country.name, 'country') 
                        ? 'bg-red-50 text-red-500' 
                        : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'
                    }`}
                >
                    <svg className="w-5 h-5" fill={isInWishlist(country.name, 'country') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </Link>
  );
};

export default CountryCard;
