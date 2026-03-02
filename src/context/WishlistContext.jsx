import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('travelGuideWishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load wishlist", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('travelGuideWishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist]);

  const addToWishlist = (item) => {
    setWishlist((prev) => {
      if (prev.find((i) => i.id === item.id && i.type === item.type)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id, type) => {
    setWishlist((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
  };

  const isInWishlist = (id, type) => {
    return wishlist.some((item) => item.id === id && item.type === type);
  };

  const toggleWishlist = (item) => {
      if (isInWishlist(item.id, item.type)) {
          removeFromWishlist(item.id, item.type);
      } else {
          addToWishlist(item);
      }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
