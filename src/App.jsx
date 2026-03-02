import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

const Home = React.lazy(() => import("./pages/Home"));
const Country = React.lazy(() => import("./pages/Country"));
const City = React.lazy(() => import("./pages/City"));
const Attraction = React.lazy(() => import("./pages/Attraction"));
const Cities = React.lazy(() => import("./pages/Cities"));
const Search = React.lazy(() => import("./pages/Search"));
const Explore = React.lazy(() => import("./pages/Explore"));
const Collection = React.lazy(() => import("./pages/Collection"));
const ExploreBackup = React.lazy(() => import("./pages/ExploreBackup"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow flex flex-col">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country/:countryName" element={<Country />} />
            <Route path="/country/:countryName/cities" element={<Cities />} />
            <Route path="/country/:country/city/:city" element={<City />} />
            <Route path="/attraction/:id" element={<Attraction />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:category" element={<Collection />} />
            <Route path="/explore-backup" element={<ExploreBackup />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
