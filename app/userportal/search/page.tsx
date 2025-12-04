'use client'
import { useState, useEffect } from "react";
import { IoSearch, IoClose } from "react-icons/io5";
// الكارد اللي هنعرض فيها اللي احنا محتاجينه
import PropertyCard from "../componants/shared/PropertyCard";
//  الداتا الفيك اللي انا مستدعيها من ال Utilites
import { properties } from "../../utils/Property_Search";
//  Icons For Padge
import { FaSlidersH, FaHistory } from "react-icons/fa";

const SEARCH = () => {
    //  هيتكتب فيها اللي هيتحط في ال Input
  const [searchQuery, setSearchQuery] = useState("");
//    هشوف بيها ال Filter مفتوح ولا مقفغول و بناءً عليه  ال Featchers هتتغير 
  const [showFilter, setShowFilter] = useState(false);
//  الحاجات اللي سرشت عنها  الأيتم بتاعتها
  const [showSearches, setShowSearches] = useState(false);
//    
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
//    
  const [priceMin, setPriceMin] = useState("");

  const [priceMax, setPriceMax] = useState("");

  const [dateFrom, setDateFrom] = useState("");

  const [dateTo, setDateTo] = useState("");
//  لو فيه عندك داتا متخزنة في ال Local Storage  هتمريها هنا بعد متعملها 
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (query: string) => {
    //  الدالة هشتتغل  بسسسس  لو  ال Query مش فاضية و مش متكررة 
    if (query.trim() && !searchHistory.includes(query.trim())) {
      //  حط الكلمة  الديدة في أول القايمة و الباقي بعدها 
      const newHistory = [query.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      //  علشان الداتا تفضل محفوظة 
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    }
  };

  const removeFromHistory = (query: string) => {
    const newHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };
//   لما أكتب اي حاجة في السيرش ترمي الداتا في أول اتنين و تقفل آخر اتنين 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    saveToHistory(query);
    setShowSearches(false);
    setShowFilter(false);
  };
//  بنضيف بيها الكلام اللي اتكتب بدون مسافات لسجل البحث 
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      saveToHistory(value);
    }
  };

  const filteredProperties = properties.filter(property => {
    //  بنحول نص البحث ل Lawercase علشان المُقارنة تكون أسهل 
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || 
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      (property.category && property.category.toLowerCase().includes(query));
//  بنشيل من السعر اي رموز أو حروف غير أرقام أو نُقط ثم بعد كدة بنحوله رقم Float
    const price = parseFloat(property.price.replace(/[^0-9.]/g, ''));
    const matchesPrice = (!priceMin || price >= parseFloat(priceMin)) &&
                        (!priceMax || price <= parseFloat(priceMax));
//  بنتأكد ان كان العقارعنده تاريخ ولا لا  لو لا هيكون Null و لو آه  بنعمله Object
    const propertyDate = property.date ? new Date(property.date) : null;
    const matchesDate = (!dateFrom || !propertyDate || propertyDate >= new Date(dateFrom)) &&
    (!dateTo || !propertyDate || propertyDate <= new Date(dateTo));
    return matchesQuery && matchesPrice && matchesDate;

  });

  const showResults = searchQuery.length > 0 || priceMin || priceMax || dateFrom || dateTo;
//  نقدر نفتح و نقفل ال Filter سواء By Price or Date
  const toggleFilter = () => {
    setShowFilter(!showFilter);
    setShowSearches(false);
  };
//  نقدر نفتح و نقفل سجل البحث علشان 
  const toggleSearches = () => {
    setShowSearches(!showSearches);
    setShowFilter(false);
  };
//  علشان نفضي كل الانبوتس عندنا من أول و جديد 
  const clearAllFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
    {/*  Search input */}
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
{/* if  ShoeFilter هيظهر ال Filter Here */}
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
                  {/*  Price Range */}
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
                  <div>
                    {/*  DATA Range */}
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
{/*  if Show Result true هيظهرلنا الايتم  اللي منها نقدر نشوف الجُزء بتاع ال */}
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
{/*  عندنا هنا Cindition rendaring أقدر أظهر المُحتوي اللي فيه لو  فيه داتا قبل كدة و لعرض متفعل  */}
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
        {/*  لو  مفيش اي داتا قبل كدة في ال History و ضغطت علشان أشوف  */}
                {showSearches && searchHistory.length === 0 && (
                  <div className="mb-6 p-6 bg-white border-2 border-gray-200 rounded-2xl">
                    <p className="text-gray-500 text-sm">No search history yet</p>
                  </div>
                )}
        {/*  لو ال Show Searches مش تروو هظهر الأوبشانز أو المُقترحات اللي بيها هسيرش  */}
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
                Found {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
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

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    title={property.title}
                    image={property.image}
                    price={property.price}
                    location={property.location}
                    size={property.size}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
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
