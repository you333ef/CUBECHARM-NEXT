"use client";

import StoriesProfilee from "../engine/StoriesProfilee";
import StoryViewer from "../engine/StoryViewer";

type Slide = {
  id: number;
  mediaUrl: string;
};

type Album = {
  id: number;
  albumName: string;
  slides: Slide[];
};

export default function ProfileStoriesSection({
  albums,
  isOwner,
  onAddStory,
}: {
  albums: Album[];
  isOwner: boolean;
  onAddStory?: () => void;
}) {
  return (
    <div className="relative">
      <StoriesProfilee albums={albums} viewerMode={isOwner ? "owner" : "viewer"} />

      {isOwner && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onAddStory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Add Story
          </button>
        </div>
      )}

      <StoryViewer />
    </div>
  );
}
