import { forwardRef, useState, useEffect, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";

// Types matching the API response
interface ApiSubCategory {
  id: number;
  name: string;
}

interface ApiCategory {
  id: number;
  name: string;
  subCategories: ApiSubCategory[];
}

interface DropdownProps {
  onChange?: (event: { target: { value: string; name: string } }) => void;
  onBlur?: (event: any) => void;
  value?: string;
  name?: string;
}

const CategoryDropdown = forwardRef<HTMLInputElement, DropdownProps>(
  ({ onChange, value, name, ...rest }, ref) => {
    const { baseUrl } = useContext(AuthContext)!;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedMain, setSelectedMain] = useState<ApiCategory | null>(null);
    const [displayValue, setDisplayValue] = useState(value || "");

    // API categories state
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories from API
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          setLoading(true);
          setError(null);
          const res = await axios.get(`${baseUrl}/categories`);
          if (res.data.success) {
            setCategories(res.data.data);
          } else {
            setError(res.data.message || "Failed to load categories");
          }
        } catch (err) {
          console.error("Failed to fetch categories:", err);
          setError("Failed to load categories");
        } finally {
          setLoading(false);
        }
      };

      if (baseUrl) {
        fetchCategories();
      }
    }, [baseUrl]);

    const handleMainSelect = (category: ApiCategory) => {
      setSelectedMain(category);
    };

    const handleSubSelect = (subCategory: ApiSubCategory, mainName: string) => {
      const displayText = `${mainName} - ${subCategory.name}`;
      setDisplayValue(displayText);
      if (onChange) {
        onChange({
          target: {
            value: String(subCategory.id),
            name: name || "category",
          },
        });
      }
      setIsOpen(false);
      setSelectedMain(null);
    };

    const handleBackToMain = () => {
      setSelectedMain(null);
    };

    return (
      <div className="col-span-10 w-full relative">
        <input 
          type="hidden" 
          ref={ref} 
          value={displayValue} 
          name={name}
          {...rest} 
        />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-4 bg-gray-50 text-base text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <span className={displayValue ? "text-gray-900" : "text-gray-500"}>
            {loading ? "Loading categories..." : displayValue || "Select Category"}
          </span>
          <FaChevronDown 
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-auto max-h-96 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-6 py-4 text-center text-gray-500">Loading categories...</div>
              ) : error ? (
                <div className="px-6 py-4 text-center text-red-500">{error}</div>
              ) : !selectedMain ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Main Categories
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleMainSelect(category)}
                      className="w-full text-left px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center justify-between group"
                    >
                      <span>{category.name}</span>
                      <FaChevronDown className="w-4 h-4 -rotate-90 text-gray-400 group-hover:text-blue-600 transition-colors duration-150" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-2 animate-in fade-in slide-in-from-right-2 duration-200">
                  <button
                    type="button"
                    onClick={handleBackToMain}
                    className="w-full text-left px-6 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-150 flex items-center gap-2 border-b border-gray-200"
                  >
                    <FaChevronDown className="w-4 h-4 rotate-90" />
                    <span>Back to Main Categories</span>
                  </button>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {selectedMain.name}
                  </div>
                  {selectedMain.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubSelect(sub, selectedMain.name)}
                      className="w-full text-left px-6 py-3 text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSelectedMain(null);
            }}
          />
        )}
      </div>
    );
  }
);

CategoryDropdown.displayName = "CategoryDropdown";

export default CategoryDropdown;
