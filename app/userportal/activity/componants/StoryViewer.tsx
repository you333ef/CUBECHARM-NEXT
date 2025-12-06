"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Image from "next/image";
import { profileData } from "../../../utils/stories";

import { usePathname } from "next/navigation";

type Story = typeof profileData.stories[0];
type StoryImage = Story["images"][0];

export default function StoryViewer() {
  const pathname = usePathname();

  const swiperRef = useRef<any>(null); 
  // (1) 

  const [isOpen, setIsOpen] = useState(false);
  const [allImages, setAllImages] = useState<StoryImage[]>([]); 
  // (3)

  const [startIndex, setStartIndex] = useState(0); 
  // (4)

  const [currentIndex, setCurrentIndex] = useState(0);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "unset"; 
    // (5) 
  }, []);

  const handleOpenStory = useCallback((e: Event) => {
    const story = (e as CustomEvent<Story>).detail;

    // (6) 
    let previousCount = 0;
    for (const s of profileData.stories) {
      if (s.id === story.id) break;
      previousCount += s.images.length;
    }

    // (7) 
    const flattened = profileData.stories.flatMap((s) => s.images);
    setAllImages(flattened);

    setStartIndex(previousCount);
    setCurrentIndex(previousCount);

    // (8) 
    setIsOpen(true);
    document.body.style.overflow = "hidden"; 
  }, []);

  useEffect(() => {
    window.addEventListener("openStory", handleOpenStory as EventListener);
    return () => {
      window.removeEventListener("openStory", handleOpenStory as EventListener);
      document.body.style.overflow = "unset"; 
      // (9) 
    };
  }, [handleOpenStory]);

  // (10) 
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

  // (11) 
  useEffect(() => {
    if (isOpen && currentIndex >= allImages.length - 1) {
      const t = setTimeout(closeViewer, 800);
      return () => clearTimeout(t);
    }
  }, [currentIndex, allImages.length, isOpen, closeViewer]);

  // (12) 
  if (!isOpen || allImages.length === 0) return null;

  const isProfilePage = pathname === "/userportal/profilee";
  // (13) 

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex items-center justify-center">
      <button
        onClick={closeViewer}
        className="absolute top-6 right-6 z-50 text-white text-5xl font-light bg-black/50 hover:bg-black/70 w-14 h-14 rounded-full flex items-center justify-center"
      >
        ×
        {/* (14) */}
      </button>

      <Swiper
        initialSlide={startIndex}
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={600}
        loop={false}
        className="w-full h-full"
        onSlideChange={(s) => setCurrentIndex(s.activeIndex)} 
        // (15)

        onSwiper={(s) => (swiperRef.current = s)}

        
    

      >
        {/* (16) */}
        {allImages.map((img, i) => (
          <SwiperSlide key={i} className="swiper-lazy">
            <div className={`relative w-full h-full flex items-center justify-center ${isProfilePage ? "pr-24" : ""}`}>
              
              {/* (17)*/}
              <Image
                src={img.src}
                alt="Story"
                width={1080}
                height={1920}
                className="max-w-full max-h-full object-contain rounded-xl select-none swiper-lazy"
              
                priority={i === startIndex}
                loading={i === startIndex ? "eager" : "lazy"}
              />

           
              <div className="swiper-lazy-preloader"></div>

           
              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {allImages.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white`}
                      style={{
                        width:
                          idx < currentIndex
                            ? "100%"
                            : idx === currentIndex
                            ? undefined
                            : "0%",
                        animation:
                          idx === currentIndex ? "progress 4s linear forwards" : "none",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}
