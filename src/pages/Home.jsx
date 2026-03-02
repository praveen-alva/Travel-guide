import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";

import { getUnsplashImage } from "../api/unsplash";
import { featuredCountries as destinations } from "../data/featuredCountries";
import { categories } from "../data/categories";
import SEO from "../components/SEO";

// Hero Images - High quality, immersive
const INITIAL_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80",
    alt: "Desert Road Trip"
  },
  {
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80",
    alt: "Mountain Lake"
  },
  {
    image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=2000&q=80",
    alt: "Urban City"
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
    alt: "Tropical Beach"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [slides, setSlides] = useState(INITIAL_SLIDES);

  useEffect(() => {
    // Scroll handler
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic first image
    const loadDynamicHero = async () => {
        const img = await getUnsplashImage("breathtaking landscape travel", "landscape");
        if (img) {
            setSlides(prev => {
                const newSlides = [...prev];
                newSlides[0] = { ...newSlides[0], image: img, alt: "Featured Destination" };
                return newSlides;
            });
        }
    };
    loadDynamicHero();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.search.value.trim();
    if (!value) return;
    navigate(`/search?q=${value.toLowerCase()}`);
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900">
      
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        <SEO 
          title="Explore the Extraordinary"
          description="Uncover secret destinations, trending cities, and expert travel guides. Your journey begins here."
          keywords="travel, vacation, holidays, destination, tourism, hidden gems, city guides"
        />
        {/* Parallax Background Carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          speed={1000}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover" 
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center text-white">
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-8 leading-tight drop-shadow-2xl animate-fade-in-up">
              Explore the <br />
              <span className="text-teal-400">Extraordinary.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-fade-in-up delay-100">
              Uncover secret destinations and local favorites.
            </p>

            {/* Clean Minimalist Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto animate-fade-in-up delay-200"
            >
              <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-3xl sm:rounded-full shadow-2xl p-2 transition-transform transform hover:scale-[1.01]">
                <div className="hidden sm:block text-teal-500 pl-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  name="search"
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full sm:flex-1 bg-transparent px-4 py-3 sm:py-2 text-gray-900 placeholder-gray-400 font-medium text-lg focus:outline-none text-center sm:text-left"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-teal-600 text-white font-bold text-lg hover:bg-teal-700 transition-colors shadow-lg mt-2 sm:mt-0"
                >
                  Search
                </button>
              </div>
            </form>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>


      {/* 2. TRENDING NOW (Clean Grid) */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
                <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-2 block">Curated For You</span>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Trending Destinations</h2>
            </div>
            <Link to="/explore" className="hidden md:flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition">
                View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Featured Large Card */}
             {destinations.length > 0 && (
                <Link to={`/country/${destinations[0].name.toLowerCase()}`} className="md:col-span-2 md:row-span-2 group flex flex-col gap-4 cursor-pointer">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
                        <img src={destinations[0].image} alt={destinations[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-teal-700 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                Editor's Choice
                            </span>
                        </div>
                    </div>
                    <div className="p-2">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{destinations[0].name}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">
                            Immerse yourself in the breathtaking landscapes and vibrant culture of {destinations[0].name}. A top-rated destination for 2026.
                        </p>
                    </div>
                </Link>
             )}

             {/* Secondary Cards */}
             {destinations.slice(1, 5).map((place) => (
                 <Link 
                    key={place.name} 
                    to={`/country/${place.name.toLowerCase()}`}
                    className="group flex flex-col gap-3 cursor-pointer"
                 >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
                        <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{place.name}</h3>
                        <p className="text-gray-500 text-sm">{place.description || "Discover a new world."}</p>
                    </div>
                 </Link>
             ))}
          </div>
      </section>


      {/* 3. EXPLORE BY INTEREST */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-500 text-lg">Find the perfect trip for your style.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
            {categories.map((cat, index) => (
              <div
                key={cat.title}
                onClick={() => navigate(`/explore/${cat.title.toLowerCase()}`)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-3" : "col-span-1"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className={`font-bold tracking-wider uppercase mb-2 ${index === 0 ? 'text-sm text-teal-400' : 'text-xs text-teal-300'}`}>
                      {index === 0 ? 'Featured Collection' : 'Discover'}
                    </p>
                    <h3 className={`text-white font-bold mb-2 leading-tight ${index === 0 ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
                      {cat.title}
                    </h3>
                    {index === 0 && (
                        <p className="text-gray-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 text-lg max-w-md">
                           explore the {cat.title} details
                        </p>
                    )}
                     <div className={`flex items-center text-white/80 font-medium text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${index === 0 ? 'delay-200' : ''}`}>
                         <span>Explore</span>
                         <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                     </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* 4. NEWSLETTER CTA */}
      {/* 4. NEWSLETTER CTA (PREMIUM LIGHT THEME) */}
      <section className="relative py-32 px-4 flex items-center justify-center overflow-hidden">
         {/* Background Image - Light & Airy */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80" 
              alt="Tropical Paradise" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-white/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-white/60" />
         </div>

         <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
             
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-14 rounded-3xl shadow-xl">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 ring-4 ring-teal-50">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight drop-shadow-sm">
                    Travel inspiration in your inbox
                </h2>
                
                <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Join our community of verified travelers and get weekly guides, hidden gems, and exclusive offers delivered to you.
                </p>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(e.target.email.value) {
                       alert(`Thank you! ${e.target.email.value} has been subscribed to our exclusives.`);
                       e.target.reset();
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
                >
                    <input 
                        name="email"
                        type="email" 
                        required
                        placeholder="Enter your email address" 
                        className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all shadow-sm"
                    />
                    <button type="submit" className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold text-lg rounded-xl transition-all hover:shadow-lg active:scale-95">
                        Subscribe
                    </button>
                </form>
                
                <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
                    No spam, just wanderlust. Unsubscribe anytime.
                </p>
            </div>

         </div>
      </section>

    </div>
  );
};

export default Home;
