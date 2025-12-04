"use client";
import { useState, useEffect, useContext } from "react";
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
import StoryViewer from "./componants/StoryViewer";
import StoriesBar from "./componants/StoriesBar";

// 1- 
const PostModal = dynamic(() => import("./componants/PostModal"), { ssr: false });

const AddPostModal = dynamic(() => import("./componants/AddPostModal"), { ssr: false });
const PostOptionsDialog = dynamic(() => import("./componants/PostOptionDialog"), { ssr: false });

export default function ActivityPage() {

  const [posts] = useState(postsData);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [optionsPostId, setOptionsPostId] = useState<number | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useContext(AuthContext)!;

  useEffect(() => {
    if (searchParams.get("openPostModal") === "true") {
      setShowAddPostModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

  const selectedPostData = posts.find((p) => p.id === selectedPost);

  return (
    <>
      <style jsx global>{`
        img {
          image-rendering: -webkit-optimize-contrast;
        }
      `}</style>

      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto py-4 px-4 md:px-0">
          {/* 3 */}
          <div className="my-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <StoriesBar />
          </div>

          {/*6 */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Image
                src={IMAGE}
                alt="Your profile"
                width={44}
                height={44}
                priority
                className="rounded-xl ring-2 ring-gray-100 object-cover h-11 w-11"
              />
              <button
                onClick={openPostModal}
                className="flex-1 text-right bg-gray-50 hover:bg-gray-100 rounded-full py-3 px-5 text-gray-500 text-sm"
              >
                What's on your mind?
              </button>
              <button
                onClick={openPostModal}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-full text-blue-600"
              >
                <FaCamera size={20} />
              </button>
            </div>
          </div>

          {/* 7 */}
          <div className="mt-8 grid grid-cols-1 gap-6 pb-10 min-h-0">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-card rounded-xl overflow-hidden border border-border shadow-sm"
              >
                <div className="flex items-center justify-between p-3">
                  <button
                    onClick={() => router.push("/account/user-profile")}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src={post.userImage}
                      alt={post.username}
                      width={40}
                      height={40}
                      priority                            
                      className="rounded-xl object-cover h-10 w-10"
                    />
                    <div>
                      <p className="font-semibold text-sm">{post.username}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </button>
                  <button onClick={() => setOptionsPostId(post.id)}>
                    <FaEllipsisH size={22} />
                  </button>
                </div>

                <button onClick={() => setSelectedPost(post.id)} className="w-full block">
                  <div className="w-full aspect-square bg-black/5">
                    <Image
                      src={post.postImage}
                      alt="Post"
                      width={520}
                      height={520}
                      sizes="(max-width: 768px) 100vw, 520px"
                      className="w-full h-full object-cover"
                      quality={80}
                      priority={post.id <= 2}
                      fetchPriority={post.id <= 2 ? "high" : "auto"}
                    />
                  </div>
                </button>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-5">
                      <button onClick={() => toggleLike(post.id)}>
                        <FaHeart
                          size={26}
                          className={likedPosts.includes(post.id) ? "text-red-500 fill-red-500" : ""}
                        />
                      </button>
                      <button onClick={() => setSelectedPost(post.id)}>
                        <FaRegComment size={26} />
                      </button>
                      <button onClick={() => toast("Link copied!")}>
                        <FaPaperPlane size={24} />
                      </button>
                    </div>
                    <button onClick={() => toast("Saved!")}>
                      <FaRegBookmark size={26} />
                    </button>
                  </div>

                  <p className="font-bold">{post.likes.toLocaleString()} likes</p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold mr-2">{post.username}</span>
                    {post.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <StoryViewer />

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
          <PostOptionsDialog open={!!optionsPostId} onClose={() => setOptionsPostId(null)} />
        )}

        {showAddPostModal && <AddPostModal onClose={() => setShowAddPostModal(false)} />}
      </div>
    </>
  );
}