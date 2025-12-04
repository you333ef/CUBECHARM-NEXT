"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// 1
export interface MenuItem {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  active?: boolean;
  subItems?: MenuItem[];
}

// 2 
interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuItems: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

// 3
interface SidebarContentProps {
  navigate: ReturnType<typeof useRouter>;
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  menuItems: MenuItem[];
}

// 4
const ADMIN_SIDEBAR = ({ setMenu, open, setOpen, menuItems }: SidebarProps) => {
  const navigate = useRouter()

  return (
    <>
      {/*5 */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      {/* 6 */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        <SidebarContent navigate={navigate} setMenu={setMenu} menuItems={menuItems} />
      </aside>
    </>
  );
};

// 7
function SidebarContent({ navigate, setMenu, menuItems }: SidebarContentProps) {
  //8
  const [expanded, setExpanded] = React.useState<string[]>([]);

  // 9
  const setActive = (items: MenuItem[], targetName: string): MenuItem[] => {
    return items.map((item) => {
      const newItem = { ...item, active: item.name === targetName };
      if (item.subItems) {
        newItem.subItems = setActive(item.subItems, targetName);
      }
      return newItem;
    });
  };

  // 10
  const handleClick = (item: MenuItem) => {
    if (item.path) {
      navigate.push(item.path);
      setMenu((prev) => setActive(prev, item.name));
    }
  };

  // 11
  const toggleExpand = (item: MenuItem) => {
    setExpanded((prev) =>
      prev.includes(item.name) ? prev.filter((n) => n !== item.name) : [...prev, item.name]
    );
  };

  return (
    // 12
    <div className="w-64 bg-white h-screen px-0 pt-4">
      {/* 13 */}
      {menuItems.map((item, index) => {
        const hasSubItems = !!item.subItems;
        const isExpanded = expanded.includes(item.name);
        const isActive =
          item.active || (item.subItems && item.subItems.some((s) => s.active)) || false;

        return (
          <React.Fragment key={index}>
            {/* 14*/}
            <div
              onClick={() => (hasSubItems ? toggleExpand(item) : handleClick(item))}
              className={`flex items-center gap-3 px-7 py-4 border-t cursor-pointer
                ${isActive ? "text-black" : "hover:bg-gray-100"}
              `}
            >
              <div
                className={`p-2 rounded-lg text-lg ${
                  isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                {item.icon}
              </div>
              <span className="font-semibold">{item.name}</span>
              {hasSubItems && (
                <span className="ml-auto text-blue-500">
  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
</span>
              )}
            </div>
            {/* 15 */}
            {hasSubItems && isExpanded && (
              <>
                {item.subItems!.map((sub, subIndex) => (
                  <div
                    onClick={() => handleClick(sub)}
                    key={`${index}-${subIndex}`}
                    className={`flex items-center gap-3 px-10 py-3 cursor-pointer
                      ${sub.active ? "text-black" : "hover:bg-gray-100"}
                    `}
                  >
                    <div
                      className={`p-2 rounded-lg text-lg ${
                        sub.active ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      {sub.icon}
                    </div>
                    <span className="font-semibold">{sub.name}</span>
                  </div>
                ))}
              </>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ADMIN_SIDEBAR;