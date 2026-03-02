import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
const Header = () => {
  const { wishlist } = useWishlist();
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-gray-900">
          TravelGuide
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          {/* Map / Country Icon */}
          <Link to="/explore" className="text-gray-900 hover:text-teal-600 transition p-2 hover:bg-gray-100 rounded-full" title="Explore Map">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {/* Simple Map Icon representing the 'Map Outline' request */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7"></path>
            </svg>
          </Link>

          {/* Heart / Wishlist Icon */}
          <Link to="/wishlist" className="relative text-gray-900 hover:text-teal-600 transition p-2 hover:bg-gray-100 rounded-full group" title="Wishlist">
            <svg className="w-6 h-6 group-hover:fill-teal-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
            )}
          </Link>

        </nav>
      </div>
    </header>
  );
}

export default Header