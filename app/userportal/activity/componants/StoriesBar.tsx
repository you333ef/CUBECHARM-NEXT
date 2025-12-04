"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { profileData } from "../../../utils/stories";
import userPlaceholder from "@/public/images/a9054bca-63af-4ee6-a443-e15e322569c3.png";
import { usePathname } from "next/navigation";
import { useState } from "react"; 

export default function StoriesBar() {
  const pathname = usePathname();

  const isProfilePage = pathname === "/userportal/profilee";

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-4 my-6 ${
        isProfilePage ? "m-auto justify-center flex " : ""
      }`} 
    >
      <Swiper
        modules={[FreeMode]}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={true}
        grabCursor={true}
        className="!px-2"
      >
        {/* 1  */}
        <SwiperSlide className="!w-20">
          <button className="flex flex-col items-center gap-2 group">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-300 rounded-xl ring-4 ring-white shadow-md flex items-center justify-center">
                <span className="text-3xl text-gray-600 font-light">+</span>
              </div>
            </div>
            <span className="text-xs text-gray-600">Your Story</span>
          </button>
        </SwiperSlide>

        {/* 2 -*/}
        {profileData.stories.map((story) => {
          const [loaded, setLoaded] = useState(false); 

          return (
            <SwiperSlide key={story.id} className="!w-20">
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("openStory", { detail: story })
                  )
                }
                className="flex flex-col items-center gap-2"
              >
                {/* 3  */}
                <div className="p-[3px] bg-blue-500 rounded-xl">
                  <div className="p-[2px] bg-blue-500 rounded-xl">
                    <div className="bg-white p-[2px] rounded-xl relative w-16 h-16">
                      
                      {/* 4 -  */}
                      {!loaded && (
                        <div className="w-full h-full rounded-xl bg-gray-300 animate-pulse absolute inset-0"></div>
                      )}

                      {/* 5 - */}
                      <Image
                        src={story.images[0]?.src || userPlaceholder}
                        alt={`Story by User ${story.id}`}
                        width={64}
                        height={64}
                        onLoadingComplete={() => setLoaded(true)} 
                        className={`w-16 h-16 object-cover rounded-xl ${
                          !loaded ? "opacity-0" : "opacity-100 transition"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <span className="text-xs truncate w-16 text-center">
                  User {story.id}
                </span>
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
