"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { profileData } from "../../../utils/stories";
import { usePathname } from "next/navigation";

type Story = typeof profileData.stories[0];
type StoryImage = Story["images"][0];

export default function Story() {
  const pathname = usePathname(); // 1 -
  const swiperRef = useRef<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [allImages, setAllImages] = useState<StoryImage[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  // 2 - 
  const closeViewer = useCallback(() => {
    setIsOpen(false);
    setShowMenu(false);
    document.body.style.overflow = "unset";
  }, []);

  // 3 - 
  const handleOpenStory = useCallback((e: Event) => {
    const story = (e as CustomEvent<Story>).detail;

    // 4 -
    let previousCount = 0;
    for (const s of profileData.stories) {
      if (s.id === story.id) break;
      previousCount += s.images.length;
    }

    // 5 -
    const flattened = profileData.stories.flatMap((s) => s.images);
    setAllImages(flattened);
    setStartIndex(previousCount);
    setCurrentIndex(previousCount);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  // 6 - 
  useEffect(() => {
    window.addEventListener("openStory", handleOpenStory as EventListener);
    return () => {
      window.removeEventListener("openStory", handleOpenStory as EventListener);
      document.body.style.overflow = "unset";
    };
  }, [handleOpenStory]);

  // 7 -
  useEffect(() => {
    if (isOpen && currentIndex >= allImages.length - 1) {
      const timer = setTimeout(closeViewer, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, allImages.length, isOpen, closeViewer]);

  // 8 -
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
      if (e.key === "Escape") closeViewer();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeViewer]);

  // 9 - 
  const isProfilePage = pathname === "/userportal/profilee";

  if (!isOpen || allImages.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      {/* 10 - */}
      <button
        onClick={closeViewer}
        className="absolute top-6 right-6 z-50 text-white text-4xl font-light bg-black/40 hover:bg-black/70 w-12 h-12 rounded-full flex items-center justify-center transition"
        aria-label="Close story"
      >
        ×
      </button>

      {/* 11  */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        className="absolute top-6 right-20 z-50 text-white text-4xl bg-black/40 hover:bg-black/70 w-12 h-12 rounded-full flex items-center justify-center transition"
        aria-label="More options"
      >
        ⋯
      </button>

      {/* 12 -*/}
      {showMenu && (
        <div className="absolute top-20 right-6 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50">
          <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition">
            Hide Story
          </button>
          <button className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition text-red-600">
            Report
          </button>
        </div>
      )}

      {/* 13 - */}
      <Swiper
        initialSlide={startIndex}
        modules={[Autoplay, Navigation]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={600}
        loop={false}
        allowTouchMove={true}
        navigation={false} 
        className="w-full h-full"
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)} 
      >
        {allImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className={`relative w-full h-full flex items-center justify-center bg-black ${isProfilePage ? "pr-20" : ""}`}>
              {/* 14 - */}
              <Image
                src={img.src}
                alt="Story"
                width={1080}
                height={1920}
                className="max-w-full max-h-full object-contain select-none rounded-xl" // changed to rounded-xl
                priority
              />

              {/* 15 */}
              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {allImages.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all ${
                        i < currentIndex
                          ? "w-full"
                          : i === currentIndex
                          ? "animate-progress"
                          : "w-0"
                      }`}
                      style={{
                        animation:
                          i === currentIndex
                            ? "progress 4s linear forwards"
                            : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 16 */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
       
      `}</style>
    </div>
  );
}