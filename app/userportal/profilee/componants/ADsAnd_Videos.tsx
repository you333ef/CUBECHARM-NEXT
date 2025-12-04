"use client";

import { MdOutlineGridOn, MdOutlineOndemandVideo } from "react-icons/md";
import { useState, useMemo } from "react";
import { mediaItems } from "../../../utils/mediaItems";
import { Navigation, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaTimes } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const AdsAndVideos = () => {
  const [view, setView] = useState<"ads" | "videos">("ads");
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
//  1
  const ads = useMemo(() => mediaItems.filter((item) => !item.isVideo), [mediaItems]);
  const videos = useMemo(() => mediaItems.filter((item) => item.isVideo), [mediaItems]);
//  2
  const currentItems = view === "ads" ? ads : videos;

   
  const openModal = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  return (
    <section className="my-10 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* 3 */}
        <div className="flex justify-center gap-20 mb-8">
          <button
            onClick={() => setView("ads")}
            className={`p-3 transition-colors ${view === "ads" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
          >
            <MdOutlineGridOn size={32} />
          </button>
          <button
            onClick={() => setView("videos")}
            className={`p-3 transition-colors ${view === "videos" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
          >
            <MdOutlineOndemandVideo size={32} />
          </button>
        </div>

        {/* 4 */}
        <div className="grid grid-cols-3 gap-[2px]">
          {currentItems.map((item, idx) => (
            <div
              key={`${item.src}-${idx}`}
              onClick={() => openModal(idx)}
              className="cursor-pointer overflow-hidden bg-black aspect-square"
            >
              {item.isVideo ? (
                <video
                  src={item.src}
                  muted
                  loop
                  className="w-full h-full object-cover hover:opacity-90 transition"
                />
              ) : (
                <img
                  src={item.src}
                  alt={`Media ${idx + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/*5 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
          {/* 6 */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white z-[10000] bg-black/60 hover:bg-black/80 p-3 rounded-full backdrop-blur-sm transition-all"
          >
            <FaTimes size={30} />
          </button>

          {/* 7 */}
          <Swiper
            modules={[Navigation, Keyboard]}
            initialSlide={startIndex}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            keyboard={{ enabled: true }}
            loop={true}
            className="w-full h-full"
          >
            {currentItems.map((item, idx) => (
              <SwiperSlide key={`${item.src}-${idx}`}>
                <div className="flex items-center justify-center w-full h-full">
                  {item.isVideo ? (
                    <video
                      src={item.src}
                      controls
                      autoPlay
                      muted
                      loop
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt="Fullscreen"
                      className="max-w-full max-h-full object-contain select-none"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}

            {/*8 */}
            <div className="swiper-button-prev !text-white !bg-black/50 !w-10 !h-8 !rounded-full !left-4 after:!text-3xl hover:!bg-black/70" />
            <div className="swiper-button-next !text-white !bg-black/50 !w-10 !h-8 !rounded-full !right-4 after:!text-3xl hover:!bg-black/70" />
          </Swiper>
        </div>
      )}
    </section>
  );
};

export default AdsAndVideos;