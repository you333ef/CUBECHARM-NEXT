"use client";
import { memo } from "react";
import { Phone, MapPin, Share2, Heart, MessageCircle } from "lucide-react";

// action buttons for property
const ActionIcons = memo(
  ({
    isFavorite,
    onToggleFavorite,
    onChat,
    onDetails,
  }: {
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onChat: () => void;
    onDetails: () => void;
  }) => (
    <div className="grid grid-cols-6 gap-2 py-4 px-2 bg-gray-50 rounded-2xl border border-gray-200">
      <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
        <MapPin className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
      </button>
      <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
        <Share2 className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={onToggleFavorite}
        className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
      >
        {isFavorite ? (
          <Heart className="w-6 h-6 text-red-600" />
        ) : (
          <Heart className="w-6 h-6 text-blue-600" />
        )}
      </button>
      <button
        onClick={onChat}
        className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md"
      >
        <MessageCircle className="w-6 h-6 text-blue-600" />
      </button>
      <button className="group flex flex-col items-center gap-2 p-3 hover:bg-white rounded-xl transition-all duration-200 hover:shadow-md">
        <Phone className="w-6 h-6 text-blue-600" />
      </button>
    </div>
  )
);
ActionIcons.displayName = "ActionIcons";

export default ActionIcons;
