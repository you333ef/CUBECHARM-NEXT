"use client";

import Image from "next/image";
import { useMemo } from "react";

const BASE_URL = "http://localhost:5000";

type FollowingStory = {
  userId: string;
  userName: string;
  userFullName: string;
  userProfileImageUrl: string;
  storyId: number;
  slides: any[];
  hasViewed: boolean;
  [key: string]: any;
};

type Props = {
  stories: FollowingStory[];
  currentUserId?: string;
};

type GroupedUser = {
  userId: string;
  userName: string;
  userFullName: string;
  userProfileImageUrl: string;
  allSlides: any[];
  hasUnviewed: boolean;
};

export default function StoriesBar({ stories, currentUserId }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, GroupedUser>();

    for (const story of stories) {
      const validSlides = story.slides?.filter((s: any) => s.mediaUrl?.trim()) || [];
      const existing = map.get(story.userId);

      if (existing) {
        existing.allSlides.push(...validSlides);
        if (!story.hasViewed) existing.hasUnviewed = true;
      } else {
        map.set(story.userId, {
          userId: story.userId,
          userName: story.userName,
          userFullName: story.userFullName,
          userProfileImageUrl: story.userProfileImageUrl,
          allSlides: [...validSlides],
          hasUnviewed: !story.hasViewed,
        });
      }
    }

    return Array.from(map.values());
  }, [stories]);

  if (!grouped.length) return null;

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
  };

  const openStory = (user: GroupedUser) => {
    window.dispatchEvent(
      new CustomEvent("openActivityStory", {
        detail: {
          userId: user.userId,
          userName: user.userName,
          userFullName: user.userFullName,
          userProfileImageUrl: user.userProfileImageUrl,
          slides: user.allSlides,
          isOwner: user.userId === currentUserId,
        },
      })
    );
  };

  return (
    <div className="flex gap-3 justify-start mx-auto overflow-x-auto py-4 px-2 scrollbar-hide">
      {grouped.map((user) => {
        const { firstName, lastName } = splitName(user.userFullName);
        const isMe = user.userId === currentUserId;
        const thumb = user.userProfileImageUrl
          ? `${BASE_URL}/${user.userProfileImageUrl}`
          : "/images/default-avatar.png";

        return (
          <button
            key={user.userId}
            onClick={() => openStory(user)}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div
              className={`p-[2px] rounded-xl transition-all ${
                user.hasUnviewed ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div className="bg-white p-1 rounded-xl">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden">
                  <Image
                    src={thumb}
                    alt={user.userFullName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            <span className="text-xs font-medium text-gray-700 max-w-20 truncate leading-tight text-center">
              {firstName}
            </span>
            {lastName && (
              <span className="text-xs text-gray-500 max-w-20 truncate leading-tight text-center -mt-1">
                {lastName}
              </span>
            )}
            {isMe && (
              <span className="text-[10px] text-blue-500 font-medium -mt-0.5">(You)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
