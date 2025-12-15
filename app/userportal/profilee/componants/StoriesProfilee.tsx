"use client";

import Image from "next/image";
import { profileData } from "../../../utils/stories";
import { usePathname } from "next/navigation";

// (1)
type Story = {
  id: number;
  images: { src: string }[];
  label?: string;
  seen?: boolean; // (2) 
};

export default function StoriesProfilee() {
  const openStory = (story: Story) => {
    // (3) 
    window.dispatchEvent(new CustomEvent("openStory", { detail: story }));
  };

  const pathname = usePathname();
 const isowner=pathname.includes("/userportal/profilee") 
  

  return (
    <div
      className={`flex gap-3 justify-start mx-auto overflow-x-auto py-4 px-2 scrollbar-hide
      ${isowner ? "max-w-3xl" : ""}
    `}
    >
      {profileData.stories.map((story: any) => {
        const firstImage = story.images[0]?.src; // (5) 
        const isSeen = story?.seen; // (6)

        return (
          <button
            key={story.id}
            onClick={() => openStory(story)} // (7) 
            className="flex flex-col items-center gap-2 flex-shrink-0 group"
          >
            <div
              className={`p-[2px] rounded-xl transition-all duration-300 ${
                isSeen ? "bg-gray-300" : "bg-blue-500" // (8)
              }`}
            >
              <div className="bg-white p-1 rounded-xl">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden ring-2 ring-white">
                  <Image
                    src={firstImage}
                    alt="Story" // (9)
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            <span className="text-xs font-medium text-gray-700 max-w-20 truncate">
              {story?.label || `User ${story.id}`} {/* (10) */}
            </span>
          </button>
        );
      })}
    </div>
  );
}
