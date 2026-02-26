"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AuthContext, { getUserId } from "@/app/providers/AuthContext";
import PostOptionDialog from "../../activity/componants/PostOptionDialog";
import HeadlessDemo from "../../../adminPortl/sharedAdmin/DELETE_CONFIRM";
import ReportModal from "../../componants/shared/ReportModal";
import PropertyView from "../[id]/PropertyView";
import api from "@/app/AuthLayout/refresh";

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
  const searchParams = useSearchParams();

  //  read reportId + other params
  const reportId = searchParams?.get?.("reportId") ?? null;
  const mode = searchParams?.get?.("mode");
  const from = searchParams?.get?.("from");
  const adminMode = mode === "admin";
  const fromReports = from === "reports";

  const auth = useContext(AuthContext)!;
 
  const [floorPlan, setFloorPlan] = useState<any>(null);

  // fetch floors count
  const fetchFloors = useCallback(async () => {
    try {
      const response = await api.get(`/properties/${id}/floors?page=1&limit=10`);
      const total = response.data.data.total || 0;
      setNumberOfFloors(total);
      setFloorPlan(response.data?.data?.floorPlan ?? null);
    } catch (error) {
      console.log("fetch floors error", error);
    }
  }, [id]);

  // fetch property and related data
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        await fetchFloors();

        const [propertyRes, relatedRes] = await Promise.all([
          api.get(`/Property/${id}`),
          api.get(`/Property/${id}/related?maxResults=3`)
        ]);

        const propertyData = propertyRes.data.data;
        setProperty(propertyData);
        setIsFavorite(propertyData.isFavourite);
        setRelatedProperties(relatedRes.data.data || []);

        const ownerId = propertyData.ownerId;
        const currentUserId = getUserId(auth?.user);
        console.log("DEBUG Owner Check", { ownerId, currentUserId, decodedToken: auth?.user });
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
  const toChat = useCallback(() => navigate.push("/messages"), [navigate]);
  const toDetails = useCallback(() => navigate.push(`/userportal/readmore/${id}`), [navigate, id]);
  const handleOpenOptions = () => {
    if (!property) return;

    const ownerUserId = property.ownerId;
    const currentUserId = getUserId(auth?.user);
    const isCurrentOwner = String(ownerUserId) === String(currentUserId);

    setOptionsPost({
      id: property.propertyId ?? property.id ?? id,
      username: property.owner?.name ?? "",
      ownerUserId: ownerUserId,
      isOwner: isCurrentOwner,
    });
  };


  // ================= ADMIN ACTIONS =================
  // delete property handler
  const deleteProperty = async (target: any) => {
    const postId = target?.id ?? target;
    try {
      let url = `/Property/${postId}`;
      if (adminMode) {
        url = `/admin/properties/${postId}`;
      }

      await api.delete(url);

      // update report status if we came from reports
      if (adminMode && fromReports && reportId) {
        try {
          await api.patch(
            `/admin/reports/${reportId}/status`,
            { status: "Resolved", adminNotes: "Content deleted by admin" },
           
          );
        } catch (err: any) {
          // if report patch fails  log but continue
          console.error("Failed to patch report status after delete:", err?.response?.data || err.message || err);
        }
      }

      toast.success("Property deleted");

      if (adminMode && fromReports) {
        navigate.replace("/adminPortl/reports");
        return;
      }

      // fallback navigation
      navigate.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete property");
    }
  };

  // block user handler
  const blockUser = async (userId: string | number) => {
    try {
      // default non-admin endpoint
      let url = `/users/blocks/${userId}`;
      if (adminMode) {
        // correct admin endpoint
        url = `/admin/users/${userId}/ban`;
      }

      await api.post(url, {});

      // update report status if we came from reports
      if (adminMode && fromReports && reportId) {
        try {
          await api.patch(
            `/admin/reports/${reportId}/status`,
            { status: "Resolved", adminNotes: "User banned by admin" }
          );
        } catch (err: any) {
          console.error("Failed to patch report status after ban:", err?.response?.data || err.message || err);
        }
      }

      toast.success("User blocked");

      if (adminMode && fromReports) {
        navigate.replace("/adminPortl/reports");
        return;
      }

      navigate.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to block user");
    }
  };

  // ========== DISMISS action (new) ==========
  const handleDismiss = async () => {
    try {
      if (!(adminMode && fromReports && reportId)) {
        toast.error("No report context to dismiss");
        return;
      }

      await api.patch(
        `/admin/reports/${reportId}/status`,
        { status: "Dismissed", adminNotes: "Report dismissed by admin" },
      
      );

      toast.success("Report dismissed");
      navigate.replace("/adminPortl/reports");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to dismiss report");
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

  // handle report submit (client reporting)
  const handleReportSubmit = async (data: any) => {
    try {
      const res = await api.post(
        `/report/property/${data.reportId}`,
        { reason: data.reason, description: data.description },
       
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
            <PropertyView
        loading={loading}
        property={property}
        relatedProperties={relatedProperties}
        floorPlan={floorPlan}
        NumberOfFloors={NumberOfFloors}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onChat={toChat}
        onDetails={toDetails}
        onOpenMenu={handleOpenOptions}
        isOwner={isOwner}
        propertyId={id}
        adminMode={adminMode}
        fromReports={fromReports}
        onAdminDelete={adminMode ? () => openConfirm({ id, username: property?.owner?.name }, "delete") : undefined}
        onAdminBlock={adminMode ? () => openConfirm({ ownerUserId: property?.ownerId, username: property?.owner?.name }, "block") : undefined}
        onAdminDismiss={adminMode && fromReports ? handleDismiss : undefined}
      />

      {/* options modal */}
      {optionsPost && !adminMode && (
        <PostOptionDialog
          open={!!optionsPost}
          postId={optionsPost.id}
          username={optionsPost.username}
          isOwner={optionsPost?.isOwner ?? isOwner}
          showUpdate={optionsPost?.isOwner ?? isOwner}
          onUpdate={() => {
            navigate.push(`/userportal/createdad?id=${optionsPost.id}`);
            setOptionsPost(null);
          }}
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
      {reportPostId && !adminMode && (
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
