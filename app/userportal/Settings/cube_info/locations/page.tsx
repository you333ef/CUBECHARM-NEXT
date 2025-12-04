"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaSearchLocation, FaGlobe, FaHome } from "react-icons/fa";


const LocationsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-gray-200 w-3/4 mx-auto rounded" />
          <div className="h-4 bg-gray-200 w-1/2 mx-auto rounded" />
          <div className="h-8 w-40 bg-gray-200 mx-auto rounded-2xl" />
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="aspect-video bg-gray-200 rounded-2xl shadow-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
};

const Locations = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return <LocationsSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#eef4ff] text-gray-900">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Location</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto">
            Discover properties on an interactive map. Filter by price, area, and lifestyle to find the right fit for you.
          </p>

         

          {/* Map */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27608.652448331684!2d31.234758!3d30.044420!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841ce7d2b7f2d%3A0x3b9e8696b19c83!2sDowntown%20Cairo!5e0!3m2!1sen!2seg!4v1707055050000"
                title="CUBECHARM Locations Map"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Explore Nearby Opportunities</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] flex items-center justify-center mb-4">
                <FaSearchLocation className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Properties Near You</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Find listings close to your location, with filters for distance, price, and amenities.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] flex items-center justify-center mb-4">
                <FaMapMarkedAlt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Area Information</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Learn about schools, transport, hospitals, and lifestyle options before moving.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] flex items-center justify-center mb-4">
                <FaGlobe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">City & District Search</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Compare cities and districts by growth, prices, and community trends.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] flex items-center justify-center mb-4">
                <FaHome className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Virtual Tours</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Explore 360° views to preview properties before booking visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Section */}
      <section className="py-16 px-4 bg-white/50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Make Smart Real Estate Choices</h2>
          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed mb-8">
            Use our map to compare neighborhoods, prices, and nearby services. Choose the property that matches your lifestyle, not just your budget.
          </p>

          <button className="px-6 py-3 text-base sm:text-lg rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#3b82f6] text-white shadow-lg transition-all duration-300">
            Start Exploring
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white/40 border-t border-gray-200 text-center">
        <p className="text-gray-600 mb-3 text-sm md:text-base">© 2025 CUBECHARM — All rights reserved.</p>
       <div className="flex justify-center gap-6 text-sm md:text-base">
  <Link
    href="/about"
    className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
  >
    About
  </Link>

  <Link
    href="/privacy"
    className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
  >
    Privacy
  </Link>

  <Link
    href="/contact"
    className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
  >
    Contact
  </Link>
</div>

      </footer>
    </div>
  );
};

export default Locations;
