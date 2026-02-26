"use client";

import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams } from "next/navigation";
import AuthContext from "@/app/providers/AuthContext";
import PropertyCard from "@/app/userportal/componants/shared/PropertyCard";
import { Category, SubCategory, PropertyItem } from "../types";
import { fetchCategories, fetchPostsByCategory } from "../services";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = Number(params.categoryId);
  const { baseUrl, syncFavoriteIds } = useContext(AuthContext)!;
  const [category, setCategory] = useState<Category | null>(null);
  const [visibleSubs, setVisibleSubs] = useState<SubCategory[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [posts, setPosts] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const requestRef = useRef(0);

  const loadPosts = useCallback(
    async (
      mainCategoryId?: number,
      subCategoryId?: number,
      pageNum: number = 1,
      append: boolean = false
    ) => {
      const requestId = ++requestRef.current;

      try {
        setPostsLoading(true);

        const res = await fetchPostsByCategory(
          baseUrl,
          mainCategoryId,
          subCategoryId,
          pageNum,
          24
        );

        if (requestId !== requestRef.current) return;

        if (!res.success) {
          setPosts([]);
          return;
        }

        if (append) {
          setPosts((prev) => [...prev, ...res.data.items]);
        } else {
          setPosts(res.data.items);
        }

        setPage(pageNum);
        setHasNextPage(res.data.hasNextPage);

        const favIds = res.data.items
          .filter((item) => item.isFavourite || item.isFavorite)
          .map((item) => Number(item.propertyId));

        if (favIds.length > 0) syncFavoriteIds(favIds);
      } catch {
        if (!append) setPosts([]);
      } finally {
        if (requestId === requestRef.current) {
          setPostsLoading(false);
        }
      }
    },
    [baseUrl, syncFavoriteIds]
  );

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setPosts([]);
        setSelectedSubId(null);
        setVisibleSubs([]);
        setPage(1);

        const res = await fetchCategories(baseUrl);
        const cat = res.data.find((c) => c.id === categoryId);
        if (!cat) return;

        setCategory(cat);
        setVisibleSubs(cat.subCategories);

        if (cat.subCategories.length > 0) {
          const firstSub = cat.subCategories[0];
          setSelectedSubId(firstSub.id);
          await loadPosts(undefined, firstSub.id, 1, false);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) loadCategory();
  }, [categoryId, baseUrl, loadPosts]);

  const handleSubClick = (subId: number) => {
    if (subId === selectedSubId) return;
    setSelectedSubId(subId);
    setPage(1);
    loadPosts(undefined, subId, 1, false);
  };

  const handleLoadMore = () => {
    if (selectedSubId) {
      loadPosts(undefined, selectedSubId, page + 1, true);
    } else {
      loadPosts(categoryId, undefined, page + 1, true);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-5 px-3 md:px-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 pb-2 mt-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-6 bg-gray-200 rounded w-3/5" />
                  <div className="h-7 bg-gray-200 rounded w-2/5" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-5 px-3 md:px-6 mt-7">
      <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-2 px-4">
        Main Category: {category?.name}
      </h2>

      {visibleSubs.length > 0 && (
        <div className="w-full py-4">
          <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide px-4 pb-2">
            {visibleSubs.map((sub, index) => (
              <button
                key={sub.id}
                onClick={() => handleSubClick(sub.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`flex items-center justify-center px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 ease-out text-sm font-medium whitespace-nowrap outline-none ${
                  selectedSubId === sub.id
                    ? "bg-[#D0E7FF] text-[#0B63C5]"
                    : "bg-[#F2F2F2] text-[#555] hover:bg-[#E5E5E5] hover:text-[#222]"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {postsLoading && posts.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md border border-gray-100 animate-pulse overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="h-64 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                  <div className="h-6 bg-gray-200 rounded w-3/5" />
                  <div className="h-7 bg-gray-200 rounded w-2/5" />
                </div>
              </div>
            ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {posts.map((property) => (
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
                isFavorite={property.isFavourite ?? property.isFavorite}
                fetchProperties={() => {
                  if (selectedSubId) loadPosts(undefined, selectedSubId, 1);
                  else loadPosts(categoryId, undefined, 1);
                }}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={handleLoadMore}
                disabled={postsLoading}
                className="px-8 py-3 bg-sky-500 text-white rounded-full font-medium hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {postsLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full py-20 flex items-center justify-center">
          <p className="text-gray-400 text-lg">No posts available</p>
        </div>
      )}
    </div>
  );
}
