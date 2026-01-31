"use client";
import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";
import PostOptionDialog from "../../activity/componants/PostOptionDialog";
import HeadlessDemo from "../../../adminPortl/sharedAdmin/DELETE_CONFIRM";
import ReportModal from "../../componants/shared/ReportModal";
import PropertyView from "../[id]/PropertyView";

// handle confirm action types
type ConfirmAction = "delete" | "block" | "reject" | "remove";

const PropertyPage = () => {
  // state for property data
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [relatedProperties, setRelatedProperties] = useState<any[]>([]);
  const [NumberOfFloors, setNumberOfFloors] = useState<number>(0);
  const [isOwner, setIsOwner] = useState(false);

  // modal state
  const [optionsPost, setOptionsPost] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState<number | null>(null);

  // get params and context
  const { id } = useParams<{ id: string }>();
  const navigate = useRouter();
  const auth = useContext(AuthContext)!;
  const { baseUrl } = auth;

  // fetch floors count
  const fetchFloors = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/properties/${id}/floors?page=1&limit=10`);
      const total = response.data.data.total || 0;
      setNumberOfFloors(total);
    } catch (error) {
      console.log("fetch floors error", error);
    }
  }, [baseUrl, id]);

  // fetch property and related data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        fetchFloors();
        
        const [propertyRes, relatedRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/Property/${id}`),
          axios.get(`http://localhost:5000/api/Property/${id}/related?maxResults=3`)
        ]);

        const propertyData = propertyRes.data.data;
        setProperty(propertyData);
        setIsFavorite(propertyData.isFavourite);
        setRelatedProperties(relatedRes.data.data || []);

        // check if current user is owner
        const ownerId = propertyData.ownerUserId;
        const currentUserId = auth?.user?.sub;
        const ownerStatus = String(ownerId) === String(currentUserId);
        setIsOwner(ownerStatus);
      } catch (e) {
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, auth?.user?.sub, fetchFloors]);

  // toggle favorite status
  const toggleFavorite = useCallback(() => {
    setIsFavorite((prev) => {
      toast.success(!prev ? "Added to Favourites" : "Removed from Favourites", {
        position: "bottom-center",
        duration: 2000,
      });
      return !prev;
    });
  }, []);

  // navigate to messages
  const toChat = useCallback(() => navigate.push("/messages"), [navigate]);

  // navigate to read more page
  const toDetails = useCallback(() => navigate.push(`/userportal/readmore/${id}`), [navigate, id]);

  // open options menu
  const handleOpenOptions = () => {
    if (!property) return;

    const ownerUserId = property.ownerUserId;
    const currentUserId = auth?.user?.sub;
    const isCurrentOwner = String(ownerUserId) === String(currentUserId);

    setOptionsPost({
      id: property.propertyId ?? property.id ?? id,
      username: property.owner?.name ?? "",
      ownerUserId: ownerUserId,
      isOwner: isCurrentOwner,
    });
  };

  // delete property handler
  const deleteProperty = async (target: any) => {
    const postId = target?.id ?? target;
    try {
      const res = await axios.delete(`${baseUrl}/Property/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      toast.success(res.data?.message || "Property deleted");
      navigate.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete property");
    }
  };

  // block user handler
  const blockUser = async (userId: string | number) => {
    try {
      const res = await axios.post(
        `${baseUrl}/users/blocks/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "User blocked");
        navigate.push("/");
      }
    } catch {
      toast.error("Failed to block user");
    }
  };

  // open confirm modal
  const openConfirm = (target: any, action: ConfirmAction) => {
    setConfirmTarget(target);
    setConfirmAction(action);
    setIsConfirmOpen(true);
  };

  // handle confirm action
  const handleConfirmTrue = async () => {
    if (!confirmTarget || !confirmAction) return;

    if (confirmAction === "delete") {
      await deleteProperty(confirmTarget);
    }

    if (confirmAction === "block") {
      if (!confirmTarget.ownerUserId) {
        toast.error("User ID not found");
        return;
      }
      await blockUser(confirmTarget.ownerUserId);
    }

    setIsConfirmOpen(false);
    setConfirmTarget(null);
    setConfirmAction(null);
  };

  // handle report submit
  const handleReportSubmit = async (data: any) => {
    try {
      const res = await axios.post(
        `${baseUrl}/report/property/${data.reportId}`,
        { reason: data.reason, description: data.description },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      if (res.data?.success) {
        toast.success(res.data.message || "Report submitted");
      } else {
        toast.error(res.data?.message || "Failed");
      }
    } catch (err) {
      toast.error("Failed to submit report");
    }
    setReportPostId(null);
  };

  return (
    <div className="w-full bg-gray-50">
      {/* property view component */}
      <PropertyView
        loading={loading}
        property={property}
        relatedProperties={relatedProperties}
        NumberOfFloors={NumberOfFloors}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onChat={toChat}
        onDetails={toDetails}
        onOpenMenu={handleOpenOptions}
        isOwner={isOwner}
        propertyId={id}
      />

      {/* options modal */}
      {optionsPost && (
        <PostOptionDialog
          open={!!optionsPost}
          postId={optionsPost.id}
          username={optionsPost.username}
          isOwner={optionsPost?.isOwner ?? isOwner}
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

      {/* report modal */}
      {reportPostId && (
        <ReportModal
          isOpen={true}
          reportId={reportPostId}
          onClose={() => setReportPostId(null)}
          onSubmit={handleReportSubmit}
        />
      )}

      {/* confirm modal */}
      {isConfirmOpen && confirmTarget && confirmAction && (
        <HeadlessDemo
          key={`${confirmAction}-${confirmTarget.id}`}
          DeleteTrue={handleConfirmTrue}
          name={confirmTarget.username ?? "Item"}
          actionType={confirmAction}
          onCancel={() => {
            setConfirmTarget(null);
            setConfirmAction(null);
            setIsConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PropertyPage;
