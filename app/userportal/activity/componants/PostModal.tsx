"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { FiMoreVertical, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { FaHeart, FaRegBookmark } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthContext from "@/app/providers/AuthContext";
import api from "@/app/AuthLayout/refresh";

const ReactPhotoSphereViewer = dynamic(
  () => import("./ReactPhotoSphereViewer").then((mod) => ({ default: mod.default })),
  { ssr: false }
);

/* ---------- helpers ---------- */
const limitWords = (text: string, limit = 3) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

/* ---------- Dialog Component ---------- */
const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white w-full max-w-md md:max-w-4xl h-[95vh] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const ScrollArea = ({ className = "", children }: any) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
);

/* ---------- PostModal Component ---------- */
const PostModal = ({
  post,
  open,
  onOpenChange,
  isLiked,
  onLike,
  adminMode = false,
  reportId = null,
}: any) => {
  
  const auth = useContext(AuthContext)!;
  const currentUserId = auth.user?.sub;
  const navigate = useRouter();

  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const isVideo = !!post?.hasVideo;
  const is360 = !!post?.is360;

  useEffect(() => {
    if (post?.comments) setComments(post.comments);
  }, [post]);

  /* ---------- Handle Close Modal ---------- */
  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }

    onOpenChange(false);

    if (adminMode) {
      const url = new URL(window.location.href);
      url.search = "";
      navigate.replace(url.pathname);
    }
  };

  /* ---------- comment handlers ---------- */
  const handleComment = async () => {
    if (!commentText.trim() || !post?.id) return;
    try {
     
      if (editingCommentId) {
        const res = await api.put(
          `/posts/${post.id}/comments/${editingCommentId}`,
          { text: commentText }
        );
        setComments((prev) =>
          prev.map((c) => (c.commentId === editingCommentId ? res.data.data : c))
        );
        setEditingCommentId(null);
        toast.success(res.data.message);
      } else {
        const res = await api.post(
          `/posts/${post.id}/comments`,
          { text: commentText },
        
        );
        setComments((prev) => [...prev, res.data.data]);
        toast.success(res.data.message);
      }
      setCommentText("");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (comment: any) => {
    setCommentText(comment.content);
    setEditingCommentId(comment.commentId);
  };

  const handleDelete = async (commentId: number) => {
    try {
      await api.delete(`/posts/${post.id}/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleReport = async (commentId: number) => {
    try {
      await api.post(
        `/report/comment/${commentId}`,
        {
          reason: "Harassment",
          description: "This comment contains harassing content.",
        }
      );
      toast.success("Comment reported successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to report comment");
    }
  };

  /* ---------- ADMIN ACTIONS ---------- */
  const resolveOwnerId = () =>
    post?.ownerUserId || post?.userId || post?.ownerId || post?.user?.sub || post?.user?.id;

  const handleAdminDelete = async () => {
    if (!post?.id) return toast.error("Post id missing");
    try {
      const url = `/posts/${post.id}`;
      await api.delete(url);
      toast.success("Post deleted");
      onOpenChange(false);
      navigate.replace("/adminPortl/reportsPosts");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleAdminBan = async () => {
    const ownerId = resolveOwnerId();
    if (!ownerId) return toast.error("Owner/User ID not found");
    try {
      const url = `/admin/users/${ownerId}/ban`;
      await api.post(url);
      toast.success("User banned");
      if (reportId) {
        try {
          await api.patch(
            `/admin/reports/${reportId}/status`,
            { status: "Resolved", adminNotes: "User banned by admin" }
          );
        } catch (e) {
          console.error("Failed to patch report after ban", e);
        }
      }
      onOpenChange(false);
      navigate.replace("/adminPortl/reportsPosts");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to ban user");
    }
  };

  const handleAdminDismiss = async () => {
    if (!reportId) return toast.error("No report context to dismiss");
    try {
      await api.patch(
        `/admin/reports/${reportId}/status`,
        { status: "Dismissed", adminNotes: "Report dismissed by admin" }
      );
      toast.success("Report dismissed");
      onOpenChange(false);
      navigate.replace("/adminPortl/reportsPosts");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to dismiss report");
    }
  };

  /* ---------- UI ---------- */
  const [localLiked, setLocalLiked] = useState(isLiked);
  useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show360Viewer, setShow360Viewer] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<
    { type: "delete" | "report"; commentId: number } | null
  >(null);

  const mediaUrl = isVideo ? post.videoUrl || "" : post.postImage || "/images/not-found.svg";

  useEffect(() => {
    if (open && is360) {
      const id = window.setTimeout(() => setShow360Viewer(true), 0);
      return () => {
        window.clearTimeout(id);
        setShow360Viewer(false);
      };
    }
    setShow360Viewer(false);
  }, [open, is360]);

  const is360SrcExternal =
    typeof mediaUrl === "string" &&
    (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://"));
  const viewer360Src =
    is360 && is360SrcExternal
      ? `/api/proxy-image?url=${encodeURIComponent(mediaUrl)}`
      : mediaUrl;

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <div className="flex flex-col md:flex-row h-full min-h-0 overflow-hidden">
        <div className="relative w-full md:w-2/3 h-[40vh] md:h-full bg-black flex-shrink-0">
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : is360 ? (
            <div className="absolute inset-0 w-full h-full">
              {show360Viewer ? (
                <ReactPhotoSphereViewer
                  src={viewer360Src}
                  width="100%"
                  height="100%"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-sm">
                  Loading 360 view...
                </div>
              )}
            </div>
          ) : (
            <Image src={mediaUrl} alt="post" fill unoptimized className="object-contain" />
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col w-full md:w-1/3 flex-1 min-h-0 bg-white">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate.push(`/userportal/profilee/${ post.ownerUserId }`)}
            >
              <Image
                src={post.userImage || "/images/person.jpg"}
                alt="user"
                width={32}
                height={32}
                unoptimized
                className="rounded-full"
              />
              <span className="text-sm font-semibold">{post.username}</span>
            </div>
            <FiX className="cursor-pointer" onClick={handleCloseModal} />
          </div>

          {/* CAPTION */}
          <div className="px-4 py-2 text-sm font-medium">{post.caption || "No caption"}</div>

          {/* ---------- Admin buttons ---------- */}
          {adminMode && (
            <div className="px-3 py-2 border-b bg-gray-50">
              <div className="grid grid-cols-3 gap-2">
                <button
                  className="py-2 text-sm font-semibold bg-black text-white rounded-lg  transition shadow-sm"
                  onClick={handleAdminDelete}
                >
                  Delete
                </button>
                <button
                  className="py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm"
                  onClick={handleAdminBan}
                >
                  Ban User
                </button>
                <button
                  className="py-2 text-sm font-semibold bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition shadow-sm"
                  onClick={handleAdminDismiss}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* scrollable area*/}
          <ScrollArea className="flex-1 min-h-0 px-4 py-3 space-y-3">
            {comments.length === 0 && (
              <p className="text-xs text-gray-400 text-center">
                No comments yet. Be the first to comment.
              </p>
            )}
            {comments.map((comment) => {
              const isOwner = comment.userId === currentUserId;
              const isMenuOpen = openMenuId === comment.commentId;
              return (
                <div key={comment.commentId} className="flex gap-2 items-start relative">
                  <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold">{comment.username}</p>
                    {/* Updated Added break-words for better text wrapping in comments */}
                    <p className="text-xs break-words">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => setOpenMenuId(isMenuOpen ? null : comment.commentId)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                  >
                    <FiMoreVertical size={14} />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 top-7 z-50 w-32 bg-white border rounded-lg shadow-md overflow-hidden">
                      {confirmAction?.commentId === comment.commentId ? (
                        <button
                          onClick={() => {
                            if (confirmAction?.type === "delete") handleDelete(comment.commentId);
                            else handleReport(comment.commentId);
                            setConfirmAction(null);
                            setOpenMenuId(null);
                          }}
                          className={`w-full px-3 py-2 text-xs font-semibold ${
                            confirmAction?.type === "delete"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-yellow-700 hover:bg-yellow-50"
                          }`}
                        >
                          Confirm {confirmAction?.type}
                        </button>
                      ) : isOwner ? (
                        <>
                          <button
                            onClick={() => {
                              handleEdit(comment);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3 py-2 text-xs hover:bg-gray-50 text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: "delete", commentId: comment.commentId })}
                            className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmAction({ type: "report", commentId: comment.commentId })}
                          className="w-full px-3 py-2 text-xs text-yellow-700 hover:bg-yellow-50 text-left"
                        >
                          Report
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollArea>

          {/* INPUT always visible at bottom */}
          <div className="border-t px-4 py-3 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <input
                className="flex-1 text-sm outline-none bg-transparent"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="text-sm font-semibold text-blue-500 disabled:opacity-40"
              >
                Post
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t pointer-events-none">
              <div className="flex items-center gap-5 pointer-events-auto">
                <FaHeart
                  size={18}
                  onClick={() => {
                    setLocalLiked((prev: any) => !prev);
                    onLike();
                  }}
                  className={`cursor-pointer transition ${localLiked ? "text-red-500" : "text-gray-700"}`}
                />
              </div>
              <FaRegBookmark size={18} className="cursor-pointer text-gray-700 pointer-events-auto" />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PostModal;