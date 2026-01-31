"use client";

import { useContext } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import { Pencil } from "lucide-react"
/* ---------- Types ---------- */
type Slide = {
  id: number;
  mediaUrl: string;
};

type Story = {
  id: number;
  hasViewed: boolean;
  slides: Slide[];
  onStoryClick?: () => void;
};

export default function StoriesProfilee({
  stories,
  setStories,

}: {
  stories: Story[];
  setStories: React.Dispatch<React.SetStateAction<Story[]>>;
}) {
  const { baseUrl } = useContext(AuthContext)!;

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const pathname = usePathname();
  const isOwner = pathname.includes("/userportal/profilee");

  const BaseUrlToImage = "http://localhost:5000";

  const deleteStory = async (storyId: number) => {
    try {
      await axios.delete(`${baseUrl}/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success("Story deleted");
      setStories((prev) => prev.filter((s) => s.id !== storyId));
    } catch {
      toast.error("Failed to delete story");
    }
  };
  const openStory = (story: Story) => {
    window.dispatchEvent(new CustomEvent("openStory", { detail: story }));
  };
if (!Array.isArray(stories) || stories.length === 0) return null;
  return (
    <div className={`flex gap-3 overflow-x-auto py-4 px-2 scrollbar-hide ${isOwner ? "max-w-3xl mx-auto" : ""}`}>



      {stories.map((story) => {
        const firstSlide = story.slides[0];
        if (!firstSlide) return null;



        return (
          <div key={story.id} className="relative flex-shrink-0">
            <button onClick={() => openStory(story)} className="flex flex-col items-center gap-2">
              <div className={`p-[2px] rounded-xl ${story.hasViewed ? "bg-gray-300" : "bg-blue-500"}`}>
                <div className="bg-white p-1 rounded-xl">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden">
                    <img
                      src={`${BaseUrlToImage}${firstSlide.mediaUrl}`}
                      alt="Story"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-700 truncate max-w-20">Album .. </span>
            </button>


           
     

          </div>
        );
      })}
    </div>
  );
}
