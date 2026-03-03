"use client";
import {
  MdOutlineGridOn,
  MdOutlineOndemandVideo,
} from "react-icons/md";
import { Megaphone } from "lucide-react";
import { useState, useEffect, useContext, useCallback } from "react";
import dynamic from "next/dynamic";
import PropertyCard from "../../componants/shared/PropertyCard";
import PostCard from "../../activity/componants/PostCard";
import PostOptionDialog from "../../activity/componants/PostOptionDialog";
import ReportModal from "../../componants/shared/ReportModal";
import HeadlessDemo from "../../../adminPortl/sharedAdmin/DELETE_CONFIRM";
import { getPostDetails, reportPost, blockUser } from "../../activity/Activity.logic";
import AuthContext from "@/app/providers/AuthContext";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";
const PostModal = dynamic(() => import("../../activity/componants/PostModal"), { ssr: false });
type ViewType = "ads" | "videos" | "properties";
interface ADsAndVideosProps {
  isOwner?: boolean | null;
  profileUserId?: string | undefined;
}
const AdsAndVideos: React.FC<ADsAndVideosProps> = ({ isOwner: ownerFromParent = null, profileUserId }) => {
  const { baseUrl, user } = useContext(AuthContext)!;
  const loggedInUserId = user?.sub;
  const resolvedIsOwner = !profileUserId || profileUserId === loggedInUserId;
  const imageBase = baseUrl?.replace(/\/api\/?$/, "") ?? "http://localhost:5000";
  const [view, setView] = useState<ViewType>("ads");
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postDetails, setPostDetails] = useState<any | null>(null);
  const [postDetailsCache, setPostDetailsCache] = useState<Record<number, any>>({});
  const [optionsPost, setOptionsPost] = useState<any | null>(null);
  const [reportPostId, setReportPostId] = useState<number | null>(null);
  const [blockTargetUser, setBlockTargetUser] = useState<{ userId: string; username: string } | null>(null);
  const formatUrl = (url: string | null) => {
    if (!url) return "";
    const path = url.startsWith("http") ? url : `${imageBase}/${url.replace(/^\//, "")}`;
    return path;
  };

 
//   Integrate  My && Your  Properties 
 const fetchProperties = async () => {
  try {
    setLoadingProperties(true);

    const url = resolvedIsOwner
      ? `/Property/my-properties`
      : `/Property/user/${profileUserId}`;

    const headers: any = {};
  

    const response = await api.get(url, { headers });

    const items = Array.isArray(response?.data?.data?.items)
      ? response.data.data.items
      : [];

    const normalized = items.map((item: any) => ({
      ...item,
      mainImage: formatUrl(item.imageUrl1),
      mediaUrlFull: formatUrl(item.imageUrl1),
      type: "property",
    }));

    setProperties(normalized);

  } catch (err) {
   
    console.error("fetchProperties error:", err);
  } finally {
    setLoadingProperties(false);
  }
};

// Integrate My && Your Posts 
 const fetchPosts = async () => {
  try {
    setLoadingPosts(true);

    const url = resolvedIsOwner
      ? `/posts/my-posts?page=1&pageSize=10`
      : `/posts/user/${profileUserId}?page=1&pageSize=10`;

    const headers: any = {};
   

    const response = await api.get(url, { headers });

    const data =
      response?.data?.data?.items ??
      response?.data?.data ??
      response?.data?.items ??
      [];

    const items = Array.isArray(data) ? data : [];

    const normalized = items.map((p: any) => {
      const videoExts = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];

      const videoFile = p.mediaFiles?.find((m: any) => m.type === "Video");
      const imageFile = p.mediaFiles?.find((m: any) => m.type === "Image");
      const img360File = p.mediaFiles?.find((m: any) => m.type === "Img360" || m.is360);
      const firstFile = p.mediaFiles?.[0];

      const hasVideoFile =
        !!videoFile ||
        p.mediaType === "Video" ||
        p.contentType === "video" ||
        videoExts.some((ext) => (p.mediaUrl || "").toLowerCase().endsWith(ext));

      const resolvedImageUrl = imageFile?.url || (!hasVideoFile ? (firstFile?.url || p.mediaUrl) : null);
      const resolvedVideoUrl = videoFile?.url || (hasVideoFile ? (firstFile?.url || p.mediaUrl) : null);
      const resolved360Url = img360File?.url || null;
      const is360 = !!resolved360Url || p.mediaFiles?.some((m: any) => m.is360);

      const mediaUrlForDisplay =
        resolvedImageUrl || resolved360Url || resolvedVideoUrl || firstFile?.url || p.mediaUrl;

      return {
        ...p,
        mediaUrlFull: formatUrl(mediaUrlForDisplay || p.mediaUrl),
        userAvatarFull: formatUrl(p.userAvatar),
        type: "post",
        isVideo: !!hasVideoFile,
        is360,
        videoUrl: resolvedVideoUrl ? formatUrl(resolvedVideoUrl) : null,
        thumbnailUrl: resolvedImageUrl ? formatUrl(resolvedImageUrl) : resolved360Url ? formatUrl(resolved360Url) : null,
      };
    });

    setPosts(normalized);
  } catch (err) {
    console.error("fetchPosts error:", err);
  } finally {
    setLoadingPosts(false);
  }
};

 const shouldFetchPosts = posts.length === 0;
const shouldFetchProperties = properties.length === 0;
//  Effect Here  
useEffect(() => {
  if (shouldFetchPosts) {
    fetchPosts();
  }

  if (shouldFetchProperties) {
    fetchProperties();
  }
 
}, [profileUserId, resolvedIsOwner]);
const ads = posts.filter((p) => !!p.mediaUrlFull);
const videoPosts = posts.filter((p) => p.isVideo);

const toPostCardShape = (p: any) => ({
  id: p.postId,
  ownerUserId: p.userId,
  userId: p.userId,
  userImage: p.userAvatarFull || formatUrl(p.userAvatar),
  username: p.username,
  timestamp: p.createdDate || "",
  postImage: p.mediaUrlFull,
  caption: p.content ?? "",
  hasVideo: p.isVideo,
  videoUrl: p.videoUrl || null,
  likes: p.likesCount ?? 0,
  isLiked: p.isLiked ?? false,
  is360: p.is360,
});

const openPostModal = useCallback(
  async (postId: number) => {
    setSelectedPostId(postId);
    setPostDetails(null);

    const cached = postDetailsCache[postId];
    if (cached) {
      setPostDetails(cached);
      return;
    }

    try {
      const details = await getPostDetails(postId, imageBase);
      if (details) {
        const normalized = {
          ...details,
          likesCount: details.likes ?? details.likesCount ?? 0,
        };
        setPostDetails(normalized);
        setPostDetailsCache((prev) => ({ ...prev, [postId]: normalized }));
      }
    } catch {
      toast.error("Failed to load post");
      setSelectedPostId(null);
    }
  },
  [imageBase, postDetailsCache]
);
 const toggleLike = async (postId: number) => {
  setPosts((prev) =>
    prev.map((p) =>
      p.postId === postId
        ? {
            ...p,
            isLiked: !p.isLiked,
            likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1),
          }
        : p
    )
  );

  try {
    await api.post(
      `/posts/${postId}/like`,
      {},
     
    );
  } catch (err) {
    console.error("toggle like failed", err);
    
    toggleLike(postId);
  }
};
const confirmDelete = useCallback(async (postId: number) => {
  try {
    await api.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
    if (selectedPostId === postId) {
      setPostDetails(null);
      setSelectedPostId(null);
    }
    toast.success("Post deleted");
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Failed to delete post");
  } finally {
    setDeletingId(null);
  }
}, [selectedPostId]);
  return (
    <section className="my-2 py-2">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center gap-4 sm:gap-6 mb-6">
          <button
            onClick={() => setView("ads")}
            className={`p-3 ${view === "ads" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            aria-pressed={view === "ads"}
            title="Ads"
          >
            <MdOutlineGridOn size={32} />
          </button>
          <button
            onClick={() => setView("videos")}
            className={`p-3 ${view === "videos" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            aria-pressed={view === "videos"}
            title="Videos"
          >
            <MdOutlineOndemandVideo size={32} />
          </button>
          <button
            onClick={() => setView("properties")}
            className={`p-3 ${view === "properties" ? "text-black border-b-2 border-black" : "text-gray-500"}`}
            aria-pressed={view === "properties"}
            title="Properties"
          >
            <Megaphone size={32} />
          </button>
        </div>

        {view === "ads" && (
          <>
            {loadingPosts ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="p-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gray-200" />
                      <div className="flex-1 h-4 bg-gray-200 rounded" />
                    </div>
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-2 h-12 bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ads.map((item, idx) => {
                  const postCard = toPostCardShape(item);
                  const isOwner = resolvedIsOwner && item.userId === loggedInUserId;
                  return (
                    <PostCard
                      key={item.postId ?? idx}
                      post={postCard}
                      isFirst={idx === 0}
                      isLiked={postCard.isLiked}
                      onLike={(id) => toggleLike(Number(id))}
                      onOpenPost={(id) => openPostModal(Number(id))}
                      onOpenOptions={() => setOptionsPost({ ...postCard, postId: item.postId, userId: item.userId, isOwner })}
                      compact
                    />
                  );
                })}
              </div>
            )}
            {!loadingPosts && ads.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">No posts yet</div>
            )}
          </>
        )}

        {selectedPostId && (
          <PostModal
            post={
              postDetails ||
              (() => {
                const source = [...ads, ...videoPosts].find(
                  (p) => p.postId === selectedPostId
                );
                return source ? toPostCardShape(source) : null;
              })()
            }
            open={!!selectedPostId}
            onOpenChange={() => {
              setPostDetails(null);
              setSelectedPostId(null);
            }}
            isLiked={postDetails?.isLiked}
            onLike={() => {
              if (selectedPostId) toggleLike(selectedPostId);
              setPostDetails((prev: any) =>
                prev
                  ? {
                      ...prev,
                      isLiked: !prev.isLiked,
                      likesCount:
                        (prev.likesCount ?? 0) + (prev.isLiked ? -1 : 1),
                    }
                  : prev
              );
            }}
          />
        )}
        {optionsPost && (
          <PostOptionDialog
            open={!!optionsPost}
            onClose={() => setOptionsPost(null)}
            postId={optionsPost.postId ?? optionsPost.id}
            username={optionsPost.username}
            isOwner={optionsPost.isOwner ?? (resolvedIsOwner && optionsPost.userId === loggedInUserId)}
            showUpdate={false}
            onDelete={() => {
              setDeletingId(optionsPost.postId ?? optionsPost.id);
              setOptionsPost(null);
            }}
            onReport={() => {
              setReportPostId(optionsPost.postId ?? optionsPost.id);
              setOptionsPost(null);
            }}
            onBlock={() => {
              const uid = optionsPost.userId ?? optionsPost.ownerUserId;
              if (uid) {
                setBlockTargetUser({
                  userId: String(uid),
                  username: optionsPost.username,
                });
              }
              setOptionsPost(null);
            }}
          />
        )}
        {deletingId && (
          <HeadlessDemo
            key={`delete-${deletingId}`}
            DeleteTrue={() => confirmDelete(deletingId)}
            onCancel={() => setDeletingId(null)}
            name="this post"
            actionType="delete"
          />
        )}
        {blockTargetUser && (
          <HeadlessDemo
            key={`block-${blockTargetUser.userId}`}
            DeleteTrue={async () => {
              const ok = await blockUser(blockTargetUser.userId, imageBase);
              if (ok) setPosts((prev) => prev.filter((p) => String(p.userId) !== blockTargetUser.userId));
              setBlockTargetUser(null);
            }}
            onCancel={() => setBlockTargetUser(null)}
            name={blockTargetUser.username}
            actionType="block"
          />
        )}
        {reportPostId && (
          <ReportModal
            isOpen={!!reportPostId}
            reportId={reportPostId}
            onClose={() => setReportPostId(null)}
            onSubmit={async (data) => {
              const ok = await reportPost(data.reportId, { reason: data.reason, description: data.description }, imageBase);
              if (ok) setReportPostId(null);
            }}
          />
        )}
        {view === "videos" && (
          <>
            {loadingPosts ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="p-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gray-200" />
                      <div className="flex-1 h-4 bg-gray-200 rounded" />
                    </div>
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-2 h-12 bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videoPosts.map((item, idx) => {
                  const postCard = toPostCardShape(item);
                  const isOwner = resolvedIsOwner && item.userId === loggedInUserId;
                  return (
                    <PostCard
                      key={item.postId ?? idx}
                      post={postCard}
                      isFirst={idx === 0}
                      isLiked={postCard.isLiked}
                      onLike={(id) => toggleLike(Number(id))}
                      onOpenPost={(id) => openPostModal(Number(id))}
                      onOpenOptions={() => setOptionsPost({ ...postCard, postId: item.postId, userId: item.userId, isOwner })}
                      compact
                    />
                  );
                })}
              </div>
            )}
            {!loadingPosts && videoPosts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">No videos yet</div>
            )}
          </>
        )}
        {view === "properties" && (
          <>
            {loadingProperties ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {properties
                  .filter((p) => p.mainImage)
                  .map((property) => (
                    <PropertyCard
                      key={property.propertyId ?? property.id}
                      id={property.propertyId ?? property.id}
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
                      isFavorite={property.isFavourite ?? property.isFavorite}
                      fetchProperties={fetchProperties}
                    />
                  ))}
                {properties.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-8">
                   You  Dont Have Any  Property Now  
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AdsAndVideos;
