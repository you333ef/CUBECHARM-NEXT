import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";

const BASE_URL = "http://localhost:5000";

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
  baseUrl: string;
  accessToken: string | null;
  router: ReturnType<typeof useRouter>;
}

export function usePropertyCardActions({
  propertyId,
  ownerUserId,
  isOwner,
  ownerName,
  fetchProperties,
  baseUrl,
  accessToken,
  router,
}: UsePropertyCardActionsProps) {
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Block states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<string | null>(null);

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);

  // Check if user is already following
  const checkFollowingStatus = async (userId: string) => {
    try {
      const res = await axios.get(
        `${baseUrl}/users/follows/${userId}/is-following`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsFollowing(res.data?.data || false);
    } catch {
      setIsFollowing(false);
    }
  };

  // Follow user
  const handleFollow = async (userId: string) => {
    try {
      const res = await axios.post(
        `${baseUrl}/users/follows/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsFollowing(true);
      toast.success(res.data?.message || "Followed successfully");
    } catch {
      toast.error("Failed to follow user");
    }
  };

  // Unfollow user
  const handleUnfollow = async (userId: string) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/users/follows/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsFollowing(false);
      toast.success(res.data?.message || "Unfollowed successfully");
    } catch {
      toast.error("Failed to unfollow user");
    }
  };

  // Toggle modal and check follow status when opening
  const toggleModal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showModal) {
      await checkFollowingStatus(ownerUserId);
    }
    setShowModal(!showModal);
  };

  // Submit report
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
      const res = await api.post(
        `${BASE_URL}/api/report/property/${reportId}`,
        { reason, description }
      );

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

  // Delete modal handlers
  const openDeleteConfirm = (id: number) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/api/Property/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchProperties?.();
      toast.success("Property deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Error unknown";
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

  // Block modal handlers
  const openBlockConfirm = (userId: string) => {
    setUserToBlock(userId);
    setIsBlockModalOpen(true);
  };

  const confirmBlock = async (userId: string) => {
    try {
      const res = await axios.post(
        `${baseUrl}/users/blocks/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(res.data?.message || "User blocked successfully");
      fetchProperties?.();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to block user";
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

  // Update property
  const handleUpdate = (id: number) => {
    setShowModal(false);
    router.push(`/userportal/createdad?id=${id}`);
  };

  // Actions for regular users
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

  // Actions for property owner
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

  // Choose which actions to show
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
