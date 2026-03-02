import React from 'react'
import { useNavigate } from "react-router-dom";
const Card = ( {city}) => {
    const navigate = useNavigate();
    return (
    <div
      onClick={() => navigate(`/city/${city.name.toLowerCase()}`)}
      className="min-w-[220px] h-40 rounded-xl overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition"
    >
      <img
        src={city.image}
        alt={city.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute bottom-4 left-4 text-white font-medium text-lg">
        {city.name}
      </div>
    </div>
  );
}

export default Card