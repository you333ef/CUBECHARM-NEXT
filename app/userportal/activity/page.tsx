"use client";

import { useState, useEffect, useContext, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { postsData } from "../../utils/post";
import AuthContext from "@/app/providers/AuthContext";
import IMAGE from "../../../public/images/a9054bca-63af-4ee6-a443-e15e322569c3.png";
import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaRegBookmark,
  FaEllipsisH,
  FaCamera,
} from "react-icons/fa";
import StoriesBar from "./componants/StoriesBar";

// Dynamic imports (مش هيتحمّلوا غير لما تحتاجهم)
const PostModal = dynamic(() => import("./componants/PostModal"), { ssr: false });
const AddPostModal = dynamic(() => import("./componants/AddPostModal"), { ssr: false });
const PostOptionsDialog = dynamic(() => import("./componants/PostOptionDialog"), { ssr: false });
const StoryViewer = dynamic(() => import("./componants/StoryViewer"), { ssr: false });

// كومبوننت البوست منفصل وميمو عشان ميترندرش كل شوية
const PostCard = memo(({ post, onLike, isLiked, onOpenPost, onOpenOptions }: any) => {
  return (
    <article className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <button
          onClick={() => onOpenPost("/account/user-profile")}
          className="flex items-center gap-3"
          aria-label={`View profile of ${post.username}`}
        >
          <Image
            src={post.userImage}
            alt=""
            width={40}
            height={40}
            className="rounded-xl object-cover h-10 w-10"
          />
          <div>
            <p className="font-semibold text-sm">{post.username}</p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </button>
        <button
          onClick={() => onOpenOptions(post.id)}
          aria-label="More options"
        >
          <FaEllipsisH size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Post Image - أهم تحسين */}
      <button onClick={() => onOpenPost(post.id)} className="w-full block" aria-label="View post">
        <div className="relative w-full aspect-square bg-black/5">
          <Image
            src={post.postImage}
            alt={post.caption.slice(0, 50) || "Post image"}
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            loading="lazy"
          />
        </div>
      </button>

      {/* Actions & Caption */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-5">
            <button onClick={() => onLike(post.id)} aria-label={isLiked ? "Unlike" : "Like"}>
              <FaHeart
                size={26}
                className={isLiked ? "text-red-500 fill-red-500" : "text-gray-700"}
              />
            </button>
            <button onClick={() => onOpenPost(post.id)} aria-label="Comment">
              <FaRegComment size={26} className="text-gray-700" />
            </button>
            <button onClick={() => toast("Link copied!")} aria-label="Share">
              <FaPaperPlane size={24} className="text-gray-700" />
            </button>
          </div>
          <button onClick={() => toast("Saved!")} aria-label="Save post">
            <FaRegBookmark size={26} className="text-gray-700" />
          </button>
        </div>

        <p className="font-bold">{post.likes.toLocaleString()} likes</p>
        <p className="text-sm mt-2">
          <span className="font-semibold mr-2">{post.username}</span>
          {post.caption}
        </p>
      </div>
    </article>
  );
});

PostCard.displayName = "PostCard";

export default function ActivityPage() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [optionsPostId, setOptionsPostId] = useState<number | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false); // جديد عشان الـ StoryViewer

  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useContext(AuthContext)!;

  // ميمو عشان الـ posts متتغيرش كل ريندر
  const posts = useMemo(() => postsData, []);

  useEffect(() => {
    if (searchParams.get("openPostModal") === "true") {
      setShowAddPostModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const toggleLike = (id: number) => {
    setLikedPosts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openPostModal = () => {
    if (!role) {
      toast("Login first bro");
      router.push("/providers/UnAuthorized");
    } else {
      setShowAddPostModal(true);
    }
  };

  const selectedPostData = posts.find(p => p.id === selectedPost);

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto py-4 px-4 md:px-0">
          {/* Stories Bar */}
          <div className="my-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <StoriesBar />
          </div>

          {/* Add Post Bar */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGE}
                alt="Your profile picture"
                width={44}
                height={44}
                className="rounded-xl ring-2 ring-gray-100 object-cover h-11 w-11"
              />
              <button
                onClick={openPostModal}
                className="flex-1 text-start bg-gray-50 hover:bg-gray-100 rounded-full py-3 px-5 text-gray-500 text-sm"
                aria-label="Create a new post"
              >
                What's on your mind?
              </button>
              <button
                onClick={openPostModal}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
                aria-label="Add photo or video"
              >
                <FaCamera size={20} />
              </button>
            </div>
          </div>

          {/* Posts List - كل حاجة اتحسنت هنا */}
          <div className="mt-8 space-y-6 pb-10">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likedPosts.includes(post.id)}
                onLike={toggleLike}
                onOpenPost={(target: any) => {
                  typeof target === "number" ? setSelectedPost(target) : router.push(target);
                }}
                onOpenOptions={setOptionsPostId}
              />
            ))}
          </div>
        </div>

        {/* StoryViewer بس لما نفتحه */}
        {isStoryOpen && <StoryViewer  />}

        {/* Modals */}
        {selectedPost && selectedPostData && (
          <PostModal
            post={selectedPostData}
            open={!!selectedPost}
            onOpenChange={(open: boolean) => !open && setSelectedPost(null)}
            isLiked={likedPosts.includes(selectedPost)}
            onLike={() => toggleLike(selectedPost)}
          />
        )}

        {optionsPostId && (
          <PostOptionsDialog
            open={!!optionsPostId}
            onClose={() => setOptionsPostId(null)}
          />
        )}

        {showAddPostModal && (
          <AddPostModal onClose={() => setShowAddPostModal(false)} />
        )}
      </div>
    </>
  );
}