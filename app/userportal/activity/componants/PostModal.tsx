"use client";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiMoreVertical } from "react-icons/fi";

import { toast } from "sonner";
import {
  FaHeart,
  FaPaperPlane,
  FaRegBookmark,
  FaSmile,
 
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import AuthContext from "@/app/providers/AuthContext";

/* ---------- helpers ---------- */
const limitWords = (text: string, limit = 3) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "..."
    : text;
};

/* ---------- Dialog ---------- */
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

/* ---------- Component ---------- */
const PostModal = ({ post, open, onOpenChange, isLiked, onLike }: any) => {
  const { baseUrl } = useContext(AuthContext)!;
  const auth = useContext(AuthContext)!;
  const currentUserId = auth.user?.sub;
  const navigate = useRouter();

  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  useEffect(() => {
    if (post?.comments) setComments(post.comments);
  }, [post]);

  /* ---------- handlers (unchanged logic) ---------- */
  const handleComment = async () => {
    if (!commentText.trim() || !post?.id) return;

    try {
      if (editingCommentId) {
        const res = await axios.put(
          `${baseUrl}/posts/${post.id}/comments/${editingCommentId}`,
          { text: commentText },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === editingCommentId ? res.data.data : c
          )
        );
        setEditingCommentId(null);
        toast.success(res.data.message);
      } else {
        const res = await axios.post(
          `${baseUrl}/posts/${post.id}/comments`,
          { text: commentText },
          { headers: { Authorization: `Bearer ${auth.token}` } }
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
      await axios.delete(
        `${baseUrl}/posts/${post.id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };
const handleReport = async (commentId: number) => {
  try {
    await axios.post(
      `${baseUrl}/report/comment/${commentId}`,
      {
        reason: "Harassment",
        description: "This comment contains harassing content.",
      },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    toast.success("Comment reported successfully");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to report comment"
    );
  }
};

  /* ---------- UI ---------- */
const [localLiked, setLocalLiked] = useState(isLiked);
useEffect(() => {
  setLocalLiked(isLiked);
}, [isLiked]);


const [openMenuId, setOpenMenuId] = useState<number | null>(null);
const [confirmAction, setConfirmAction] = useState<
  { type: "delete" | "report"; commentId: number } | null
>(null);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col md:flex-row h-full">
        {/* IMAGE (fixed height on mobile) */}
        <div className="relative w-full md:w-2/3 h-[300px] md:h-full bg-black">
          <Image
            src={post.postImage || "https://via.placeholder.com/100"}
            alt="post"
            fill
            unoptimized
            className="object-contain"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col w-full md:w-1/3 h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate.push("/account/user-profile")}
            >
              <Image
                src={post.userImage || "https://via.placeholder.com/100"}
                alt="user"
                width={32}
                height={32}
                unoptimized
                className="rounded-full"
              />
              <span className="text-sm font-semibold">{post.username}</span>
            </div>
            <FiX className="cursor-pointer" onClick={() => onOpenChange(false)} />
          </div>

          {/* CAPTION */}
          <div className="px-4 py-2 text-sm font-medium">
            {post.caption || "No caption"}
          </div>

         

          {/* COMMENTS */}
      <ScrollArea className="flex-1 px-4 py-3 space-y-3">
  {comments.map((comment) => {
    const isOwner = comment.userId === currentUserId;
    const isMenuOpen = openMenuId === comment.commentId;

    return (
      <div
        key={comment.commentId}
        className="flex gap-2 items-start relative"
      >
        {/* <Image
          src={comment.userAvatar || "https://via.placeholder.com/100"}
          alt="avatar"
          width={28}
          height={28}
          unoptimized
          className="rounded-full"
        /> */}

        <div className="flex-1 bg-gray-100 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold">{comment.username}</p>
          <p className="text-xs">{limitWords(comment.content, 10)}</p>
        </div>

        {/* MENU ICON */}
        <button
          onClick={() =>
            setOpenMenuId(isMenuOpen ? null : comment.commentId)
          }
          className="p-1 text-gray-400 hover:text-gray-700"
        >
          <FiMoreVertical size={14} />
        </button>

        {/* DROPDOWN */}
        {isMenuOpen && (
          <div className="absolute right-0 top-7 z-50 w-32 bg-white border rounded-lg shadow-md overflow-hidden">
            {confirmAction?.commentId === comment.commentId ? (
              <button
                onClick={() => {
                  if (confirmAction?.type === "delete") {
                    handleDelete(comment.commentId);
                  } else {
                    // handleReport(comment.commentId)
                   handleReport(comment.commentId)
                  }
                  setConfirmAction(null);
                  setOpenMenuId(null);
                }}
                className={`w-full px-3 py-2 text-xs font-semibold
                  ${
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
                  onClick={() =>
                    setConfirmAction({
                      type: "delete",
                      commentId: comment.commentId,
                    })
                  }
                  className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  setConfirmAction({
                    type: "report",
                    commentId: comment.commentId,
                  })
                }
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


 {/* INPUT */}
<div className="border-t px-4 py-3">
  <div className="flex items-center gap-2 mb-3">
    <FaSmile className="text-gray-500" />
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
    setLocalLiked((prev:any) => !prev); 
    onLike();                     
  }}
  className={`cursor-pointer transition ${
    localLiked ? "text-red-500" : "text-gray-700"
  }`}
/>


    <FaPaperPlane
      size={18}
      className="cursor-pointer text-gray-700"
    />
  </div>

  <FaRegBookmark
    size={18}
    className="cursor-pointer text-gray-700 pointer-events-auto"
  />
</div>


</div>

        </div>
      </div>
    </Dialog>
  );
};

export default PostModal;
