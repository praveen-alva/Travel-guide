import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUnsplashImage } from "../api/unsplash";
import SEO from "../components/SEO";

const Attraction = () => {
  const { id } = useParams();
  const attractionName = id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Attraction";
  
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttractionData = async () => {
      setLoading(true);
      try {
        // Fetch specific images
        const mainImage = await getUnsplashImage(`${attractionName} landmark architecture`);
        const gallery1 = await getUnsplashImage(`${attractionName} detail`);
        const gallery2 = await getUnsplashImage(`${attractionName} view`);
        const gallery3 = await getUnsplashImage(`${attractionName} inside`);

        // Generate dynamic data structure
        const data = {
          name: attractionName,
          identity: `A timeless symbol of heritage and beauty`,
          image: mainImage || `https://loremflickr.com/1600/900/${id},landmark`,
          description: `Experience the magnificence of ${attractionName}. This iconic destination stands as a testament to the region's rich history and architectural grandeur. Visitors are greeted by stunning vistas and intricate details that tell the stories of a bygone era. Whether you are a history buff, an architecture enthusiast, or simply seeking a breathtaking view, ${attractionName} offers an unforgettable journey.`,
          essentials: {
            open: "09:00 AM - 06:00 PM",
            closed: "None",
            type: "Must-Visit Landmark",
            duration: "1.5 - 2 Hours",
            entry: "Ticket Required",
          },
          highlights: [
            {
              name: "Main Architecture",
              description: "Marvel at the stunning structural design and intricate craftsmanship that defines this landmark.",
              image: gallery1 || `https://loremflickr.com/800/600/${id},architecture`
            },
            {
              name: "Scenic Views",
              description: "Enjoy panoramic views of the surroundings, offering perfect photo opportunities.",
              image: gallery2 || `https://loremflickr.com/800/600/${id},view`
            }
          ],
          gallery: [
             gallery1 || `https://loremflickr.com/800/600/${id},detail`,
             gallery2 || `https://loremflickr.com/800/600/${id},view`,
             gallery3 || `https://loremflickr.com/800/600/${id},inside`
          ],
          nearby: [
            { name: "City Center", dist: "1.5 km", image: `https://loremflickr.com/400/300/city,street` },
            { name: "Local Market", dist: "0.8 km", image: `https://loremflickr.com/400/300/market,food` },
            { name: "Riverside Walk", dist: "2.0 km", image: `https://loremflickr.com/400/300/river,park` },
            { name: "Museum", dist: "1.2 km", image: `https://loremflickr.com/400/300/museum,art` }
          ]
        };

        setAttraction(data);
      } catch (error) {
        console.error("Error loading attraction:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttractionData();
  }, [id, attractionName]);

  if (loading) {
     return (
        <div className="flex-grow flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
             <div className="h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-500 font-medium">Loading details for {attractionName}...</p>
          </div>
        </div>
     );
  }

  if (!attraction) {
    return <div className="flex-grow flex items-center justify-center text-gray-500">Attraction not found</div>;
  }

  return (
    <div className="bg-white flex-grow font-sans text-gray-900">
      <SEO 
        title={`${attraction.name} - Travel Guide`}
        description={attraction.description}
        image={attraction.image}
      />
      
      {/* 1. HERO SECTION (Consistent with City/Country) */}
      <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={attraction.image}
            alt={attraction.name}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center text-white flex flex-col items-center justify-center h-full pt-10 pb-20">
          <h1 className="font-serif text-3xl md:text-8xl font-medium tracking-tight mb-6 drop-shadow-2xl">
            {attraction.name}
          </h1>
           <div className="h-px w-24 bg-white/50 mb-6"></div>
          <p className="font-sans text-sm md:text-base uppercase tracking-[0.3em] text-white/90 font-medium drop-shadow-md">
            {attraction.identity}
          </p>
        </div>
      </section>

      {/* 2. THE ESSENTIALS (Info Grid) */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 -mt-10 sm:-mt-16 mb-20">
         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:divide-x divide-gray-100">
               
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</span>
                  <span className="font-bold text-gray-900 text-sm">{attraction.essentials.type}</span>
               </div>
               
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timing</span>
                  <span className="font-bold text-gray-900 text-sm">{attraction.essentials.open}</span>
               </div>

               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Closed</span>
                  <span className="font-bold text-gray-900 text-sm">{attraction.essentials.closed}</span>
               </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                  <span className="font-bold text-gray-900 text-sm">{attraction.essentials.duration}</span>
               </div>

               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry</span>
                  <span className="font-bold text-gray-900 text-sm">{attraction.essentials.entry}</span>
               </div>

            </div>
         </div>
      </section>

      {/* 3. THE EXPERIENCE (Narrative & Highlights) */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
         <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left: Narrative */}
            <div className="md:col-span-7">
               <h2 className="text-3xl font-bold text-gray-900 mb-6 font-serif">The Experience</h2>
               <p className="text-lg text-gray-600 leading-relaxed mb-8 text-justify">
                  {attraction.description}
               </p>
               <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  As you explore the grounds, you will discover a harmonious blend of nature and design. The atmosphere is serene, punctuated by the soft sounds of nature and the awe-inspiring presence of the structure itself. It's a place where history feels alive, inviting you to pause and reflect on the artistry of the past.
               </p>
            </div>

            {/* Right: Visual Highlights */}
            <div className="md:col-span-5 flex flex-col gap-8">
               <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Don't Miss</h3>
               
               {attraction.highlights.map((item, idx) => (
                  <div key={idx} className="flex gap-5 group cursor-default">
                     <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     </div>
                     <div className="py-1">
                        <h4 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">{item.name}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                     </div>
                  </div>
               ))}
            </div>

         </div>
      </section>

      {/* 4. VISUAL JOURNEY (Gallery) */}
      <section className="bg-gray-50 py-24 mb-20">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Visual Journey</h2>
                <p className="text-gray-500">Glimpses of {attraction.name}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {attraction.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-md group">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Detail ${idx + 1}`} />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors h-[50vh] min-h-[500px]" />
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* 5. NEARBY SUGGESTIONS */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
         <div className="flex items-center justify-between mb-8 border-t border-gray-100 pt-10">
            <h2 className="text-2xl font-bold text-gray-900">Explore Nearby</h2>
            <Link to="/explore" className="text-teal-600 font-bold text-sm hover:underline">View all</Link>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {attraction.nearby.map((place, idx) => (
               <div key={idx} className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-sm group-hover:shadow-md transition-all">
                     <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors text-lg">{place.name}</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">{place.dist} away</p>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default Attraction;