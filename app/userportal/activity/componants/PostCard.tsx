"use client";

import { memo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";

type PostCardProps = {
  post: any;
  isFirst?: boolean;
  isLiked: boolean;
  onLike: (postId: string) => void;
  onOpenPost: (target: number | string) => void;
  onOpenOptions: () => void;
};

const PostCard = memo(
  ({ post, onLike, isLiked, onOpenPost, onOpenOptions, isFirst }: PostCardProps) => {
    const timeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

      return date.toLocaleDateString("en-US");
    };

    return (
      <article className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <button
            onClick={() => onOpenPost(`/userportal/profilee/${post.ownerUserId}`)}
            className="flex items-center gap-3"
            aria-label={`View profile of ${post.username}`}
          >
            <Image
              src={post.userImage}
              alt=""
              width={40}
              height={40}
              className="rounded-xl object-cover h-10 w-10"
              unoptimized
            />
            <div>
              <p className="font-semibold text-sm">{post.username}</p>
              <p className="text-xs text-muted-foreground">
                {timeAgo(post.timestamp)}
              </p>
            </div>
          </button>

          <button onClick={onOpenOptions} aria-label="More options">
            <FaEllipsisH size={22} className="text-gray-600" />
          </button>
        </div>

        {/* Image */}
        <button onClick={() => onOpenPost(post.id)} className="w-full block">
          <div className="relative w-full aspect-square bg-black/5 overflow-hidden rounded-lg">
            <Image
              src={post.postImage}
              alt={post.caption ? post.caption.slice(0, 50) : "Post image"}
              width={500}
              height={500}
              className="object-cover w-full h-full"
              priority={isFirst}
              unoptimized
            />
          </div>
        </button>

        {/* Body */}
        <div className="p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-900">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption && post.caption.trim() !== "" && post.caption}
            </p>
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-5">
              <button onClick={() => onLike(post.id)}>
                <FaHeart
                  size={26}
                  className={
                    isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
                  }
                />
              </button>

              <button onClick={() => onOpenPost(post.id)}>
                <FaRegComment size={26} className="text-gray-700" />
              </button>

              <button onClick={() => toast("Link copied!")}>
                <FaPaperPlane size={24} className="text-gray-700" />
              </button>
            </div>

            <button onClick={() => toast("Saved!")}>
              <FaRegBookmark size={26} className="text-gray-700" />
            </button>
          </div>

          <p className="font-bold text-sm">
            {post.likes.toLocaleString()} likes
          </p>
        </div>
      </article>
    );
  }
);

PostCard.displayName = "PostCard";

export default PostCard;
