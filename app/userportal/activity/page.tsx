"use client";

import { useState, useEffect, useContext, useMemo, memo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import IMAGE from "../../../public/images/a9054bca-63af-4ee6-a443-e15e322569c3.png";
import {
 
  FaCamera,
} from "react-icons/fa";
import StoriesBar from "./componants/StoriesBar";
import {
  MdOutlineGridOn,
  MdOutlineOndemandVideo,
} from "react-icons/md";
import { Megaphone } from "lucide-react";
import PostOptionDialog from "./componants/PostOptionDialog";
import PropertyCard from "../componants/shared/PropertyCard";
import HeadlessDemo from "../../adminPortl/sharedAdmin/DELETE_CONFIRM";
import ReportModal from "../componants/shared/ReportModal";
import {
  getActivityFeed,
  getPostDetails,
  createPost,
  toggleLike as toggleLikeAPI,
  deletePost as deletePostAPI,
  reportPost,
  blockUser,
  fetchPropertiesFeed,
} from "./Activity.logic";
import PostCard from "./componants/PostCard";
//  1
const PostModal = dynamic(() => import("./componants/PostModal"), { ssr: false });
const AddPostModal = dynamic(() => import("./componants/AddPostModal"), { ssr: false });
const StoryViewer = dynamic(() => import("./componants/StoryViewer"), { ssr: false });
// 4
export default function ActivityPage() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [optionsPost, setOptionsPost] = useState<any>(null);
  const { user } = useContext(AuthContext)!;
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [postDetails, setPostDetails] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useContext(AuthContext)!;
  useEffect(() => {
    if (searchParams.get("openPostModal") === "true") {
      setShowAddPostModal(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);
  const openPostModal = useMemo(
    () => () => {
      if (!role) {
        toast("Login first bro");
        router.push("/providers/UnAuthorized");
      } else {
        setShowAddPostModal(true);
      }
    },
    [role, router]
  );
  //  New State To Update
  type ActivityTab = "all" | "videos" | "ads";
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const { baseUrl } = useContext(AuthContext)!;
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [reportPostId, setReportPostId] = useState<number | null>(null);
  // Load activity feed on mount
  useEffect(() => {
    loadActivityFeed();
  }, []);
  // Load properties when ads tab is selected
  useEffect(() => {
    if (activeTab === "ads" && properties.length === 0) {
      loadProperties();
    }
  }, [activeTab]);
  //  handler to load activity feed
  const loadActivityFeed = async () => {
    const posts = await getActivityFeed(baseUrl);
    setActivityFeed(posts);
  };
  //  handler to load post details
  const loadPostDetails = async (postId: number) => {
    const details = await getPostDetails(postId, baseUrl);
    if (details) {
      setPostDetails(details);
    }
  };
  //  handler for creating post
  const handleCreatePost = async (payload: {
    content: string;
    media?: File;
  }) => {
    const createdPost = await createPost(payload, baseUrl);
     console.log("CREATE PAYLOAD >>>", payload);
    if (createdPost) {
     await loadActivityFeed();
      return createdPost;
    }
    return null;
  };
  //  handler for toggling like
  const handleToggleLike = async (postId: string) => {
    const result = await toggleLikeAPI(postId, baseUrl);
    if (result) {
      setActivityFeed((prev: any[]) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: result.likes,
                isLiked: result.isLiked,
              }
            : post
        )
      );
    }
  };
  //  handler for deleting post
  const handleDeletePost = async (postId: number) => {
    const success = await deletePostAPI(postId, baseUrl);
    if (success) {
      await loadActivityFeed();
    }
  };
  //  handler for reporting post
  const handleReportPost = async (reportId: number, reason: string, description: string) => {
    const success = await reportPost(reportId, { reason, description }, baseUrl);
    if (success) {
      setReportPostId(null);
    }
  }
  //  handler for blocking user
  const handleBlockUser = async (userId: string | number) => {
    const success = await blockUser(userId, baseUrl);
    if (success) {
      setActivityFeed((prev) =>
        prev.filter((post) => String(post.ownerUserId) !== String(userId))
      );
    }
  };
  //  handler for loading properties
  const loadProperties = async () => {
    try {
      setLoadingProperties(true);
      const items = await fetchPropertiesFeed(baseUrl);
      setProperties(items);
    } finally {
      setLoadingProperties(false);
    }
  };
type ConfirmAction = "delete" | "block" | null;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const openConfirm = (target: any, action: ConfirmAction) => {
    setConfirmTarget(target);
    setConfirmAction(action);
    setIsConfirmOpen(true);
  };

  const handleConfirmTrue = async () => {
    if (!confirmTarget || !confirmAction) return;

    if (confirmAction === "delete") {
      await handleDeletePost(confirmTarget.id);
    }

    if (confirmAction === "block") {
      await handleBlockUser(confirmTarget.ownerUserId);
    }

    // reset
    setIsConfirmOpen(false);
    setConfirmTarget(null);
    setConfirmAction(null);
  };
  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto py-4 px-4 md:px-0">
        
          <div className="my-6 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <StoriesBar />
          </div>
{/* 5 */}
         
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
{/* 6 */}
   <div className="flex justify-center gap-10 mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`p-3 ${
              activeTab === "all"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            <MdOutlineGridOn size={32} />
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`p-3 ${
              activeTab === "videos"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            <MdOutlineOndemandVideo size={32} />
          </button>

          <button
            onClick={() => setActiveTab("ads")}
            className={`p-3 ${
              activeTab === "ads"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            <Megaphone size={32} />
          </button>
        </div>
          <div className="mt-8 space-y-6 pb-10">
            {activeTab === "all" &&
            <>
            {activityFeed.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            isFirst={index === 0}
            isLiked={post.isLiked}
            onLike={handleToggleLike}
            onOpenPost={async (target: any) => {
              if (typeof target === "number") {
                setSelectedPost(target);
                await loadPostDetails(target);
              } else {
                router.push(target);
              }
            }}
            onOpenOptions={() =>
              setOptionsPost({
                ...post,
                isOwner: String(post.ownerUserId) === String(user?.sub),
              })
            }
          />
            ))}
            </>
            }
        {activeTab === "videos" && (
  <div className="grid grid-cols-3 gap-[2px]">
    {/* {videoPosts.map((post, idx) => (
      <div
        key={post.id}
      
        className="cursor-pointer overflow-hidden bg-black aspect-square"
      >
        <img
          src={post.postImage}
          alt={post.caption}
          className="w-full h-full object-cover hover:opacity-90 transition"
        />
      </div>
    ))} */}
  </div>
)}

 {activeTab === "ads" && (
  <>
    {loadingProperties ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-[420px] bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {properties
          .filter((p) => p.mainImage)
          .map((property) => (
            <PropertyCard
              key={property.propertyId}
              id={property.propertyId}
              title={property.title}
              images={property.imageUrl1 ? [property.imageUrl1] : []}
              location={property.city}
              price={property.price}
              description={property.description}
              currency={property.currency}
              categoryName={property.categoryName}
              categorySlug={property.categorySlug}
              totalArea={property.totalArea}
              viewsCount={property.viewsCount}
              publishedAt={property.publishedAt}
              ownerName={property.ownerName}
              ownerProfileImage={property.ownerProfileImage}
              ownerRating={property.ownerRating}
              ownerUserId={property.ownerUserId}
              fetchProperties={loadProperties}
            />
          ))}
      </div>
    )}
  </>
)}
          </div>
        </div> 
        <StoryViewer />
        {/* 7 */}
        
        {selectedPost && postDetails && (
          <PostModal
            post={postDetails}
            open={!!selectedPost}
            onOpenChange={(open: boolean) => !open && setSelectedPost(null)}
            isLiked={postDetails.isLiked}
            onLike={() => handleToggleLike(postDetails.id)}
          />
        )}
        {optionsPost && (
          <PostOptionDialog
            open
            postId={optionsPost.id}
            username={optionsPost.username}
            isOwner={optionsPost.isOwner}
            onClose={() => setOptionsPost(null)}
            onDelete={() => {
              openConfirm(optionsPost, "delete");
              setOptionsPost(null);
            }}
            onBlock={() => {
              openConfirm(optionsPost, "block");
              setOptionsPost(null);
            }}
            onReport={() => {
              setReportPostId(optionsPost.id);
              setOptionsPost(null);
            }}
          />
        )}
        {reportPostId && (
          <ReportModal
            isOpen={true}
            reportId={reportPostId}
            onClose={() => setReportPostId(null)}
            onSubmit={(data) => handleReportPost(reportPostId, data.reason, data.description)}
          />
        )}
        {showAddPostModal && (
          <AddPostModal
            isOpen={true}
            onClose={() => setShowAddPostModal(false)}
            onSubmit={handleCreatePost}
          />
        )}
        {confirmAction && confirmTarget && (
          <HeadlessDemo
            key={`${confirmAction}-${confirmTarget.id}`}
            DeleteTrue={handleConfirmTrue}
            name={confirmTarget.username}
            actionType={confirmAction}
            onCancel={() => {
              setConfirmTarget(null);
              setConfirmAction(null);
            }}
          />
        )}
      </div>
    </>
  );
}