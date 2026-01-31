'use client'
import { useState, useEffect, useContext } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
// Component to display property cards
import PropertyCard from "../componants/shared/PropertyCard";
// Icons for page
import { FaSlidersH, FaHistory } from "react-icons/fa";
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";

const SEARCH = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // Toggle for filter visibility
  const [showFilter, setShowFilter] = useState(false);
  // Toggle for search history visibility
  const [showSearches, setShowSearches] = useState(false);
  // State for search history
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  // State for minimum price filter
  const [priceMin, setPriceMin] = useState("");
  // State for maximum price filter
  const [priceMax, setPriceMax] = useState("");
  // State for date from filter (ignored for now)
  const [dateFrom, setDateFrom] = useState("");
  // State for date to filter (ignored for now)
  const [dateTo, setDateTo] = useState("");
  // State for loading indicator
  const [loading, setLoading] = useState(true);
  // State for properties list
  const [properties, setProperties] = useState<any[]>([]);
  const { baseUrl } = useContext(AuthContext)!;

  // Fetch properties based on search or feed
  const fetchData = async () => {
    setLoading(true);
    try {
      const isSearching = searchQuery.trim() !== '' || priceMin !== '' || priceMax !== '';
      const endpoint = isSearching ? 'search' : 'feed';
      const params: any = {
        page: 1,
        pageSize: 24,
      };
      if (isSearching) {
        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (priceMin) params.minPrice = Number(priceMin);
        if (priceMax) params.maxPrice = Number(priceMax);
      } else {
        params.sort = 'recent';
      }
      const response = await axios.get(`${baseUrl}/Property/${endpoint}`, { params });
      if (response.status === 200) {
        const items = response.data.data.items.map((item: any) => {
          const formatUrl = (url: string | null) => {
            if (!url) return null;
            if (url.startsWith("http")) return url;
            return `http://localhost:5000/${url}`;
          };
          return {
            ...item,
            imageUrl1: formatUrl(item.imageUrl1),
            mainImage: formatUrl(item.imageUrl1),
          };
        });
        setProperties(items);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Fetch data when search parameters change
  useEffect(() => {
    fetchData();
  }, [searchQuery, priceMin, priceMax]);

  // Save query to history if new and non-empty
  const saveToHistory = (query: string) => {
    if (query.trim() && !searchHistory.includes(query.trim())) {
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };

  // Remove item from search history
  const removeFromHistory = (query: string) => {
    const newHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Handle search from history or suggestions
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveToHistory(query);
    setShowSearches(false);
    setShowFilter(false);
  };

  // Update search query and save to history if non-empty
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      saveToHistory(value);
    }
  };

  // Determine if results should be shown
  const showResults = searchQuery.length > 0 || priceMin || priceMax || dateFrom || dateTo;

  // Toggle filter visibility
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setShowSearches(false);
  };

  // Toggle search history visibility
  const toggleSearches = () => {
    setShowSearches(!showSearches);
    setShowFilter(false);
  };

  // Clear all filter values
  const clearAllFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Search input */}
      <main className="flex-1 pb-20">
        <div className="w-full px-2 sm:px-4 flex flex-col items-center justify-start pt-20 transition-all duration-300">
          <div className={`w-full ${showResults ? 'max-w-7xl' : 'max-w-2xl'} mx-auto`}>
            <div className="relative w-full px-1 sm:px-0">
              <IoSearch className="absolute left-5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
              <input
                type="text"
                placeholder="Search by name, location, or category..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base rounded-2xl focus:outline-none shadow-sm transition-all ${
                  showFilter 
                    ? 'border-2 border-blue-500 ring-4 ring-blue-100' 
                    : 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
            {/* Show filters if toggled */}
            {showFilter && (
              <div className="mt-4 p-6 bg-white border-2 border-blue-500 rounded-2xl shadow-lg animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Show options if no results */}
            {!showResults && (
              <div className="mt-6 text-center">
                <div className="flex flex-wrap gap-2 sm:gap-4 justify-center px-2 py-2 mb-6">
                  <button 
                    onClick={toggleFilter}
                    className={`px-4 sm:px-6 py-2.5 bg-white border-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                      showFilter 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                        : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <FaSlidersH className={showFilter ? 'text-blue-700' : 'text-gray-600'} />
                    Filter
                  </button>
                  
                  <button 
                    onClick={toggleSearches}
                    className={`px-4 sm:px-6 py-2.5 bg-white border-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 ${
                      showSearches 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                        : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <FaHistory className={showSearches ? 'text-blue-700' : 'text-gray-600'} />
                    Searches
                  </button>
                </div>
                {/* Show recent searches if toggled and history exists */}
                {showSearches && searchHistory.length > 0 && (
                  <div className="mb-6 p-3 sm:p-4 bg-white border-2 border-blue-500 rounded-2xl shadow-lg animate-in fade-in duration-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left">Recent Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(item)}
                          className="group px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all flex items-center gap-2"
                        >
                          {item}
                          <IoClose 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromHistory(item);
                            }}
                            className="text-blue-500 hover:text-red-600 cursor-pointer transition-colors"
                            size={16}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {/* Show message if no search history */}
                {showSearches && searchHistory.length === 0 && (
                  <div className="mb-6 p-6 bg-white border-2 border-gray-200 rounded-2xl">
                    <p className="text-gray-500 text-sm">No search history yet</p>
                  </div>
                )}
                {/* Show popular searches if not showing history */}
                {!showSearches && (
                  <>
                    <p className="text-gray-500 text-xs sm:text-sm mb-4">Popular searches:</p>
                    <div className="flex flex-wrap gap-2 justify-center px-2">
                      <button 
                        onClick={() => handleSearch("Apartment")}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        Apartment
                      </button>
                      <button 
                        onClick={() => handleSearch("Villa")}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        Villa
                      </button>
                      <button 
                        onClick={() => handleSearch("Cairo")}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        Cairo
                      </button>
                      <button 
                        onClick={() => handleSearch("Penthouse")}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      >
                        Penthouse
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {showResults && (
          <div className="max-w-7xl mx-auto px-2 sm:px-4 mt-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </p>
              {(priceMin || priceMax || dateFrom || dateTo) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                >
                  <IoClose size={16} />
                  Clear Filters
                </button>
              )}
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {properties
                  .filter(property => property.mainImage)
                  .map(property => (
                    <PropertyCard
                      key={property.propertyId}
                      id={property.propertyId}
                      title={property.title}
                      images={property.imageUrl1 ? [property.imageUrl1] : []}
                      location={property.city}
                      price={property.price}
                      description={property.description}
                      currency={property.currency}
                      categoryName={property.categoryName}
                      categorySlug={property.categorySlug}
                      totalArea={property.totalArea}
                      viewsCount={property.viewsCount}
                      publishedAt={property.publishedAt}
                      ownerName={property.ownerName}
                      ownerProfileImage={property.ownerProfileImage}
                      ownerRating={property.ownerRating}
                      ownerUserId={property.ownerUserId}
                      fetchProperties={fetchData}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No results for search or search results are zero</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SEARCH;