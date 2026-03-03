"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  compact?: boolean;
};

const DEFAULT_AVATAR = "/images/person.jpg";

const PostCard = memo(
  ({ post, onLike, isLiked, onOpenPost, onOpenOptions, isFirst, compact }: PostCardProps) => {
    const [avatarError, setAvatarError] = useState(false);
    const profileUserId = post.ownerUserId ?? post.userId;
    const profileHref = profileUserId ? `/userportal/profilee/${profileUserId}` : undefined;

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

    const avatarSize = compact ? 32 : 40;
    const iconSize = compact ? 18 : 26;
    const playSize = compact ? "w-8 h-8" : "w-14 h-14";
    const playIconSize = compact ? "w-4 h-4" : "w-7 h-7";

    return (
      <article className={`bg-card rounded-xl overflow-hidden border border-border shadow-sm ${compact ? "rounded-lg" : ""} max-w-3xl mx-auto md:max-w-2xl lg:max-w-xl`} style={{maxHeight: '540px'}}>
        <div className={`flex items-center justify-between ${compact ? "p-2" : "p-3"}`}>
          <div className={`flex items-center gap-2 ${compact ? "gap-2" : "gap-3"} min-w-0 flex-1`}>
            {profileHref ? (
              <Link href={profileHref} className="flex items-center gap-2 min-w-0 flex-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={avatarError ? DEFAULT_AVATAR : post.userImage}
                  alt=""
                  width={avatarSize}
                  height={avatarSize}
                  className={`rounded-xl object-cover ${compact ? "h-8 w-8 rounded-lg" : "h-10 w-10"}`}
                  unoptimized
                  onError={() => setAvatarError(true)}
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}>{post.username}</p>
                  <p className={`text-muted-foreground truncate ${compact ? "text-[10px]" : "text-xs"}`}>
                    {timeAgo(post.timestamp)}
                  </p>
                </div>
              </Link>
            ) : (
              <>
                <Image
                  src={avatarError ? DEFAULT_AVATAR : post.userImage}
                  alt=""
                  width={avatarSize}
                  height={avatarSize}
                  className={`rounded-xl object-cover ${compact ? "h-8 w-8 rounded-lg" : "h-10 w-10"}`}
                  unoptimized
                  onError={() => setAvatarError(true)}
                />
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}>{post.username}</p>
                  <p className={`text-muted-foreground truncate ${compact ? "text-[10px]" : "text-xs"}`}>
                    {timeAgo(post.timestamp)}
                  </p>
                </div>
              </>
            )}
          </div>
          <button onClick={onOpenOptions} aria-label="More options" className={compact ? "p-1" : ""}>
            <FaEllipsisH size={compact ? 16 : 22} className="text-gray-600 shrink-0" />
          </button>
        </div>

        <button onClick={() => onOpenPost(post.id)} className="w-full block">
          <div className="relative w-full aspect-square bg-black/5 overflow-hidden rounded-b-lg" style={{maxHeight: 340}}>
            {post.hasVideo ? (
              <>
                <video
                  src={post.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                // poster={post.thumbnailUrl}
                  preload="none"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`bg-black/50 rounded-full flex items-center justify-center ${playSize}`}>
                    <svg className={`text-white ml-0.5 ${playIconSize}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={post.postImage}
                alt={post.caption ? post.caption.slice(0, 50) : "Post image"}
                width={400}
                height={400}
                className="object-contain w-full h-full bg-white"
                priority={isFirst}
                unoptimized
              />
            )}
          </div>
        </button>

        <div className={compact ? "p-2" : "p-4"}>
          <div className={compact ? "mb-1" : "mb-3"}>
            <p className={`text-gray-900 truncate ${compact ? "text-xs" : "text-sm"}`}>
              <span className="font-semibold mr-1">{post.username}</span>
              {post.caption && post.caption.trim() !== "" && post.caption}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button onClick={() => onLike(post.id)}>
                <FaHeart
                  size={iconSize}
                  className={isLiked ? "text-red-500 fill-red-500" : "text-gray-700"}
                />
              </button>
              <button onClick={() => onOpenPost(post.id)}>
                <FaRegComment size={iconSize} className="text-gray-700" />
              </button>
              {/* <button
                onClick={() => {
                  const postUrl = `${window.location.origin}/userportal/activity?postId=${post.id}`;
                  navigator.clipboard.writeText(postUrl);
                  toast("Link copied!");
                }}
              >
                <FaPaperPlane size={compact ? 16 : 24} className="text-gray-700" />
              </button> */}
            </div>
            <button onClick={() => toast("Saved!")}>
              <FaRegBookmark size={iconSize} className="text-gray-700" />
            </button>
          </div>
          <p className={`font-bold ${compact ? "text-xs mt-0.5" : "text-sm"}`}>
            {(post.likes ?? post.likesCount ?? 0).toLocaleString()} likes
          </p>
        </div>
      </article>
    );
  }
);

PostCard.displayName = "PostCard";

export default PostCard;
