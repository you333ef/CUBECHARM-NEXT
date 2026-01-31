"use client";
import Link from "next/link";
import MediaGallery from "../Componants/MediaGalleryServer";
import ActionIcons from "../[id]/components/property/ActionIcons";
import SellerProfile from "../[id]/components/property/SellerProfile";
import PropertyCard from "../../componants/shared/PropertyCard";

// loading skeleton
const LoadingSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
    <div className="h-72 bg-gray-200 rounded-lg"></div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded"></div>
      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

// UI component - no logic
const PropertyView = ({
  loading,
  property,
  relatedProperties,
  NumberOfFloors,
  isFavorite,
  onToggleFavorite,
  onChat,
  onDetails,
  onOpenMenu,
  isOwner,
  propertyId,
}: {
  loading: boolean;
  property: any;
  relatedProperties: any[];
  NumberOfFloors: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onChat: () => void;
  onDetails: () => void;
  onOpenMenu: () => void;
  isOwner: boolean;
  propertyId: string;
}) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 pt-16 md:pt-20">
      <div className="bg-white rounded-xl p-4 sm:p-6">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div>
            {/* media gallery */}
            <div className="mb-4">
              <MediaGallery
                images={(property?.media || []).map((m: any) => ({
                  id: m.mediaId,
                  url: `http://localhost:5000/${m.localPath}`,
                  isMain: m.isMain,
                }))}
              />
            </div>

            {/* action icons */}
            <ActionIcons
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
              onChat={onChat}
              onDetails={onDetails}
            />

            {/* seller profile */}
            <div className="mt-4">
              <SellerProfile owner={property?.owner ?? null} ownerId={property?.ownerId} onOpenMenu={onOpenMenu} />
            </div>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {NumberOfFloors > 0 && (
                <Link href={`/userportal/proModewep/${propertyId}`} className="flex-1 text-center py-3 px-6 bg-white text-blue-600 font-bold rounded-lg text-base border-2 border-blue-600">
                  PRO MODE
                </Link>
              )}

              <Link href="/userportal/payment" className="flex-1 text-center py-3 px-6 bg-green-500 text-white font-bold rounded-lg text-base">
                Pay Now
              </Link>
            </div>

            {/* characteristics */}
            <div className="mt-6 text-center sm:text-left">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Characteristics</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                <li>
                  <span className="font-semibold w-24">Full Size:</span> {property.size}m²
                </li>
                <li>
                  <span className="font-semibold w-24">Location:</span> {property.location}
                </li>
              </ul>
            </div>

            {/* description */}
            <div className="mt-6 text-center sm:text-left">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
                <Link href={`/userportal/readmore/${propertyId}`} className="text-blue-600 font-semibold hover:underline ml-1">
                  Read More
                </Link>
              </p>
            </div>

            {/* related ads */}
            <h2 className="mt-8 text-xl font-semibold mb-4 text-gray-800">Related Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {relatedProperties.map((item) => {
                const image = item.imageUrl1 ? `http://localhost:5000/${item.imageUrl1}` : "https://cdn.dubaiimmobilier.fr/wp-content/uploads/2024/06/Sky-High-Luxury.webp";

                return (
                  <PropertyCard
                    key={item.propertyId}
                    id={item.propertyId}
                    title={item.title}
                    images={[image]}
                    location={item.city}
                    price={item.price}
                    currency={item.currency}
                    description={item.description}
                    categoryName={item.categoryName}
                    categorySlug={item.categorySlug}
                    totalArea={item.totalArea}
                    viewsCount={item.viewsCount}
                    publishedAt={item.publishedAt}
                    ownerName={item.ownerName}
                    ownerProfileImage={item.ownerProfileImage}
                    ownerRating={item.ownerRating}
                    ownerUserId={item.ownerUserId}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyView;
