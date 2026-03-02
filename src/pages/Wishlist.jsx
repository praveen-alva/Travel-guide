import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const WishlistGrid = ({ items, removeFromWishlist }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                    {item.image ? (
                            <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=random&size=400`;
                                e.target.parentElement.classList.add("bg-gray-100");
                            }}
                            />
                    ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <button 
                        onClick={() => removeFromWishlist(item.id, item.type)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition shadow-sm"
                        title="Remove from wishlist"
                    >
                        <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                    <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-black/50 text-white text-[10px] font-bold uppercase rounded backdrop-blur-sm">
                                {item.type}
                            </span>
                    </div>
                    </div>
                    
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                        {item.region || item.country || item.city || "Saved Item"}
                        </p>
                        
                        <Link 
                        to={
                            item.type === 'country' ? `/country/${item.name.toLowerCase()}` : 
                            item.type === 'city' ? `/country/${item.country?.toLowerCase() || 'unknown'}/city/${item.name.toLowerCase()}` :
                            `/attraction/${item.name.toLowerCase().replace(/ /g, '-')}`
                        }
                        className="block w-full text-center py-2 bg-gray-50 text-gray-600 font-bold text-sm rounded-lg hover:bg-teal-50 hover:text-teal-600 transition"
                        >
                            View Details
                        </Link>
                    </div>
            </div>
        ))}
    </div>
);

const SectionHeader = ({ title, count, icon, colorClass, subtitle }) => (
    <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-8">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass} text-white shadow-md`}>
                {icon}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-none mb-1">{title}</h2>
                <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
            </div>
        </div>
        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {count} {count === 1 ? 'Item' : 'Items'}
        </div>
    </div>
);

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();

    const countries = wishlist.filter(item => item.type === 'country');
    const cities = wishlist.filter(item => item.type === 'city');
    const attractions = wishlist.filter(item => item.type === 'attraction');

    if (wishlist.length === 0) {
        return (
            <div className="flex-grow bg-gray-50 flex flex-col items-center justify-center p-4">
                 <div className="text-center max-w-md">
                     <div className="bg-white p-4 rounded-full shadow-md inline-block mb-6">
                        <svg className="w-12 h-12 text-teal-600 fill-teal-100" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                     </div>
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
                     <p className="text-gray-500 mb-8">Start exploring and save your favorite destinations here.</p>
                     <Link to="/" className="px-6 py-3 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 transition">Start Exploring</Link>
                 </div>
            </div>
        );
    }

    return (
        <div className="flex-grow bg-gray-50 py-20 px-4">
             <div className="max-w-7xl mx-auto space-y-20">
                 
                 {/* Header */}
                 <div className="text-center max-w-2xl mx-auto mb-16">
                     <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Your Travel Wishlist</h1>
                     <p className="text-gray-500 text-lg">Your personal collection of dream destinations and must-see spots.</p>
                 </div>

                 {countries.length > 0 && (
                     <section>
                         <SectionHeader 
                            title="Countries" 
                            subtitle="Nations you plan to explore"
                            count={countries.length}
                            colorClass="bg-indigo-600"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                         />
                         <WishlistGrid items={countries} removeFromWishlist={removeFromWishlist} />
                     </section>
                 )}

                 {cities.length > 0 && (
                     <section>
                         <SectionHeader 
                            title="Cities" 
                            subtitle="Urban adventures waiting for you"
                            count={cities.length}
                            colorClass="bg-rose-600"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                         />
                         <WishlistGrid items={cities} removeFromWishlist={removeFromWishlist} />
                     </section>
                 )}

                 {attractions.length > 0 && (
                     <section>
                         <SectionHeader 
                            title="Attractions" 
                            subtitle="Landmarks and hidden gems"
                            count={attractions.length}
                            colorClass="bg-amber-500"
                            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                         />
                         <WishlistGrid items={attractions} removeFromWishlist={removeFromWishlist} />
                     </section>
                 )}
             </div>
        </div>
    );
};

export default Wishlist;
