import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";


interface ActionItem {
  label: string;
  onClick: (id: number) => void;
  danger?: boolean;
}

interface UsePropertyCardActionsProps {
  propertyId: number;
  ownerUserId: string;
  isOwner: boolean;
  ownerName: string;
  fetchProperties?: () => void;
  baseUrl: string;  router: ReturnType<typeof useRouter>;
}

export function usePropertyCardActions({
  propertyId,
  ownerUserId,
  isOwner,
  ownerName,
  fetchProperties,
  baseUrl,
  // ...existing code...
  router,
}: UsePropertyCardActionsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);

  const checkFollowingStatus = async (userId: string) => {
    try {
      const res = await api.get(`/users/follows/${userId}/is-following`);
      setIsFollowing(res.data?.data || false);
    } catch {
      setIsFollowing(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const res = await api.post(`/users/follows/${userId}`, {});
      setIsFollowing(true);
      toast.success(res.data?.message || "Followed successfully");
    } catch {
      toast.error("Failed to follow user");
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      const res = await api.delete(`/users/follows/${userId}`);
      setIsFollowing(false);
      toast.success(res.data?.message || "Unfollowed successfully");
    } catch {
      toast.error("Failed to unfollow user");
    }
  };

  const toggleModal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showModal) {
      await checkFollowingStatus(ownerUserId);
    }
    setShowModal(!showModal);
  };

  const handleSubmitReport = async ({
    reportId,
    reason,
    description,
  }: {
    reportId: string | number;
    reason: string;
    description: string;
  }) => {
    try {
      const res = await api.post(`/report/property/${reportId}`, { reason, description });
      if (res.data?.success) {
        toast.success(res.data.message || "Report submitted successfully");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((e: string) => toast.error(e));
      } else {
        toast.error("Failed to submit report");
      }
    }
  };

  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (id: number) => {
    try {
      await api.delete(`/property/${id}`);
      fetchProperties?.();
      toast.success("Property deleted successfully");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Error unknown";
      toast.error(errorMessage);
    } finally {
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openBlockConfirm = (userId: string) => {
    setUserToBlock(userId);
    setIsBlockModalOpen(true);
  };

  const confirmBlock = async (userId: string) => {
    try {
      const res = await api.post(`/users/blocks/${userId}`, {});
      toast.success(res.data?.message || "User blocked successfully");
      fetchProperties?.();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to block user";
      toast.error(errorMessage);
    } finally {
      setUserToBlock(null);
      setIsBlockModalOpen(false);
    }
  };

  const cancelBlock = () => {
    setUserToBlock(null);
    setIsBlockModalOpen(false);
  };

  const handleUpdate = (id: number) => {
    setShowModal(false);
    router.push(`/userportal/createdad?id=${id}`);
  };

  const modalActions: ActionItem[] = [
    {
      label: "Report",
      onClick: () => {
        setShowModal(false);
        setShowReportModal(true);
      },
    },
    {
      label: isFollowing ? "Unfollow" : "Follow",
      onClick: () => {
        setShowModal(false);
        if (isFollowing) {
          handleUnfollow(ownerUserId);
        } else {
          handleFollow(ownerUserId);
        }
      },
    },
    {
      label: "Block User",
      onClick: () => {
        setShowModal(false);
        openBlockConfirm(ownerUserId);
      },
      danger: true,
    },
    {
      label: "Copy Link",
      onClick: () => {
        setShowModal(false);
      },
    },
  ];

  const ownerActions: ActionItem[] = [
    {
      label: "Update",
      onClick: (id) => {
        setShowModal(false);
        handleUpdate(id);
      },
    },
    {
      label: "Delete",
      onClick: (id) => {
        setShowModal(false);
        openDeleteConfirm(id);
      },
      danger: true,
    },
    {
      label: "Share",
      onClick: () => {
        setShowModal(false);
      },
    },
  ];

  const actionsToShow = isOwner ? ownerActions : modalActions;

  return {
    // Modal states
    showModal,
    setShowModal,
    showReportModal,
    setShowReportModal,
    toggleModal,

    // Delete modal
    isDeleteModalOpen,
    itemToDelete,
    openDeleteConfirm,
    confirmDelete,
    cancelDelete,

    // Block modal
    isBlockModalOpen,
    userToBlock,
    openBlockConfirm,
    confirmBlock,
    cancelBlock,

    // Follow
    isFollowing,
    checkFollowingStatus,
    handleFollow,
    handleUnfollow,

    // Report
    handleSubmitReport,

    // Actions
    actionsToShow,
    modalActions,
    ownerActions,
  };
}
