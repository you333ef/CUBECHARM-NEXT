import { forwardRef, useState } from "react";
import { categories, MainCategory } from "../../../utils/categories";
import { FaChevronDown } from "react-icons/fa";


interface DropdownProps {
  onChange?: (event: { target: { value: string; name: string } }) => void;
  onBlur?: (event: any) => void;
  value?: string;
  name?: string;
}

const CategoryDropdown = forwardRef<HTMLInputElement, DropdownProps>(
  ({ onChange, value, name, ...rest }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMain, setSelectedMain] = useState<MainCategory | null>(null);
    const [displayValue, setDisplayValue] = useState(value || "");

    const handleMainSelect = (category: MainCategory) => {
      setSelectedMain(category);
    };

    const handleSubSelect = (mainName: string, subName: string) => {
      const fullValue = `${mainName} - ${subName}`;
      setDisplayValue(fullValue);
      if (onChange) {
        onChange({ 
          target: { 
            value: fullValue, 
            name: name || "category" 
          } 
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
            {displayValue || "Select Category"}
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
              {!selectedMain ? (
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
                  {selectedMain.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubSelect(selectedMain.name, sub.name)}
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
