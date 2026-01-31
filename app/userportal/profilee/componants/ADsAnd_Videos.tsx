"use client";
import {
  MdOutlineGridOn,
  MdOutlineOndemandVideo,
} from "react-icons/md";
import { Megaphone } from "lucide-react";
import { FaTimes, FaEllipsisV, FaHeart } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PropertyCard from "../../componants/shared/PropertyCard";
import AuthContext from "@/app/providers/AuthContext";
import axios from "axios";
import { toast } from "sonner";
type ViewType = "ads" | "videos" | "properties";
interface ADsAndVideosProps {
  isOwner?: boolean | null;
  profileUserId?: string | undefined;
}
const IMAGE_BASE = "http://localhost:5000";

const AdsAndVideos: React.FC<ADsAndVideosProps> = ({ isOwner: ownerFromParent = null, profileUserId }) => {
  const { baseUrl, user } = useContext(AuthContext)!;
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const loggedInUserId = user?.sub;
  const resolvedIsOwner = !profileUserId || profileUserId === loggedInUserId;

  const [view, setView] = useState<ViewType>("ads");
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // (can be posts or properties), used by Swiper
  const [modalItems, setModalItems] = useState<any[]>([]);

  const formatUrl = (url: string | null) => {
    return `${IMAGE_BASE}/${url}`;
  };

 
//   Integrate  My && Your  Properties 
 const fetchProperties = async () => {
  try {
    setLoadingProperties(true);

    const url = resolvedIsOwner
      ? `${baseUrl}/Property/my-properties`
      : `${baseUrl}/Property/user/${profileUserId}`;

    const headers: any = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(url, { headers });

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
      ? `${baseUrl}/posts/my-posts?page=1&pageSize=10`
      : `${baseUrl}/posts/user/${profileUserId}?page=1&pageSize=10`;

    const headers: any = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await axios.get(url, { headers });

    const data =
      response?.data?.data?.items ??
      response?.data?.data ??
      response?.data?.items ??
      [];

    const items = Array.isArray(data) ? data : [];
    const normalized = items.map((p: any) => ({
      ...p,
      mediaUrlFull: formatUrl(p.mediaUrl),
      userAvatarFull: formatUrl(p.userAvatar),
      type: "post",
    }));

    setPosts(normalized);
  } catch (err) {
    
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
//  To Open Modal Slider
  const openModal = (index: number, items: any[]) => {
    setModalItems(items);
    setStartIndex(index);
    setModalOpen(true);
    setMenuOpenId(null);
    setDeletingId(null);
  };
 
  //  Handle Toggle Like 
 const toggleLike = async (postId: number) => {
  if (!accessToken) return;

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

  setModalItems((prev) =>
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
    await axios.post(
      `${baseUrl}/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err) {
    console.error("toggle like failed", err);
    
    toggleLike(postId);
  }
};


// Confirm Dlete Post 

const confirmDelete = async (postId: number) => {
  try {
    await axios.delete(
      `${baseUrl}/posts/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // remove post locally after success
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
    toast.error("Post Deleted Sucess")

    // close modal if deleted post is open
    if (modalItems.some((m) => m.postId === postId)) {
      setModalOpen(false);
      setModalItems([]);
    }

  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    setDeletingId(null);
    setMenuOpenId(null);
  }
};


  return (
    <section className="my-10 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-center gap-20 mb-8">
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
          <div className="grid grid-cols-3 gap-[2px]">
            {ads.map((item, idx) => (
              <div
                key={`${item.propertyId ?? idx}-${idx}`}
                onClick={() => openModal(idx, ads)}
                className="cursor-pointer overflow-hidden bg-black aspect-square"
              >
                <img src={item.mediaUrlFull} className="w-full h-full object-cover hover:opacity-90 transition" />
                <div className="p-2">
                  {item.title && (
                    <div className="text-white text-sm line-clamp-2">{item.title}</div>
                  )}
                </div>
              </div>
            ))}
            {ads.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8"> </div>
            )}
          </div>
        )}

        {view === "videos" && (
          // show a single centered message "Empty" (no duplicates, nothing fancy)
          <div className="w-full py-20 flex items-center justify-center">
            <div className="text-gray-500">Empty</div>
          </div>
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4">
          <div className="absolute top-4 left-4 z-[10001]">
            {/* Menu icon on left  */}
            {modalItems[startIndex]?.type === "post" &&
              resolvedIsOwner &&
              modalItems[startIndex]?.userId === loggedInUserId && (
                <div className="relative">
                  {deletingId !== modalItems[startIndex]?.postId ? (
                    <button
                      onClick={() =>
                        setMenuOpenId(menuOpenId === modalItems[startIndex]?.postId ? null : modalItems[startIndex]?.postId)
                      }
                      className="p-2 bg-white rounded-full"
                    >
                      <FaEllipsisV />
                    </button>
                  ) : null}

                  {menuOpenId === modalItems[startIndex]?.postId && deletingId !== modalItems[startIndex]?.postId && (
                    <div className="mt-2 bg-white border rounded shadow-md">
        
                      <button
                        className="block w-full text-left px-4 py-2"
                        onClick={() => {
                          setMenuOpenId(null);
                          setDeletingId(modalItems[startIndex]?.postId);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}

   {deletingId === modalItems[startIndex]?.postId && (
  <div className="fixed inset-0 z-[10002] flex items-center justify-center">
    
    {/* overlay */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setDeletingId(null)}
    />

    {/* confirm box */}
    <div className="relative bg-white rounded-xl shadow-xl w-[320px] p-6 flex flex-col items-center gap-4">
      
      <p className="text-lg font-semibold text-gray-800 text-center">
        Are you sure you want to delete this post?
      </p>

      <div className="flex gap-3 w-full">
        <button
          onClick={() => confirmDelete(modalItems[startIndex]?.postId)}
          className="flex-1 bg-black  text-white py-2 rounded-lg transition"
        >
          Delete
        </button>

        <button
          onClick={() => setDeletingId(null)}
          className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


                </div>
              )}
          </div>

          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white z-[10001] p-2"
          >
            <FaTimes size={26} />
          </button>

          <div className="w-full h-full flex items-center justify-center">
            <Swiper
              modules={[Navigation, Keyboard]}
              initialSlide={startIndex}
              navigation
              keyboard={{ enabled: true }}
              loop={false}
              className="w-full h-full flex items-center justify-center"
            >
     {modalItems.map((item, idx) => (
  <SwiperSlide key={idx} className="flex items-center justify-center">
    <div className="relative w-[90vw] h-[90vh] bg-black flex items-center justify-center">
      
      {/* image */}
      {item.mediaUrlFull && (
        <img
          src={item.mediaUrlFull}
          alt=""
          className="
            object-contain
            max-w-full
            max-h-full
            select-none
          "
          style={{ imageRendering: "auto" }}
        />
      )}

      {/* like overlay */}
      {item.type === "post" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white">
          <button
            onClick={() => {
              if (item.postId) toggleLike(item.postId);
            }}
            aria-pressed={!!item.isLiked}
            className="flex items-center justify-center"
          >
            <FaHeart
              size={22}
              color={item.isLiked ? "red" : "white"}
            />
          </button>

          <span className="text-sm font-medium">
            {item.likesCount ?? 0}
          </span>
        </div>
      )}
    </div>
  </SwiperSlide>
))}

            </Swiper>
          </div>
        </div>
      )}

   
    </section>
  );
};

export default AdsAndVideos;
