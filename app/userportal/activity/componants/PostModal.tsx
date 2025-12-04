"use client"
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  FaHeart,
  FaRegComment,
  FaPaperPlane,
  FaRegBookmark,
  FaEllipsisH,
  FaSmile,
  FaEdit,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";


// 1
const Dialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

//2
const DialogContent = ({ className = "", children }: any) => {
  return <div className={className}>{children}</div>;
};

//3
const ScrollArea = ({ className = "", children }: any) => {
  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{ maxHeight: "100%" }}
    >
      {children}
    </div>
  );
};

// 4
interface PostModalProps {
  post: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLiked: boolean;
  onLike: () => void;
}

const PostModal = ({
  post,
  open,
  onOpenChange,
  isLiked,
  onLike,
}: PostModalProps) => {
  const [commentText, setCommentText] = useState("");
  const [tempComment, setTempComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useRouter()

  // 5
  const handleComment = () => {
    if (!commentText.trim()) return;
    if (isEditing) {
      toast.success("Comment updated successfully");
      setTempComment(commentText);
      setIsEditing(false);
    } else {
      toast.success("Comment added successfully");
      setTempComment(commentText);
    }
    setCommentText("");
  };

  // 6
  const handleEdit = () => {
    setCommentText(tempComment);
    setIsEditing(true);
  };

  // 7
  const handleSavePost = () => {
    toast.success("Post saved");
  };

  //8
  const handleCopyLink = () => {
    const link = `https://www.facebook.com/you333ef`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  // 9
  const handleUserClick = () => {
    navigate.push("/account/user-profile");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 gap-0 overflow-hidden md:flex-row flex-col overflow-y-auto md:overflow-hidden z-[9999]">
        <div className="flex h-full flex-col md:flex-row">
          {/* 10 */}
          <div className="flex-1 flex items-center justify-center md:max-w-[60%]">
           <Image
              src={post.postImage}
              alt="Post"
              width={400}       
              height={400}      
              className="object-contain"
              style={{ width: "100%", height: "100%" }}
            />

          </div>

          {/* 11 */}
          <div className="w-full md:w-[500px] flex flex-col ">
            {/* 12 */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleUserClick}
              >
             <Image
  src={post.userImage}
  alt={post.username}
  width={40}
  height={40}
  className="w-10 h-10 rounded-full object-cover"
/>

                <p className="font-semibold text-sm">{post.username}</p>
              </div>
              <button className="hover:text-muted-foreground transition-colors">
                <FaEllipsisH size={18} />
              </button>
            </div>

            {/* 13 */}
            <ScrollArea className="flex-1 p-4">
              {tempComment && (
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-sm break-all">{tempComment}</p>
                  <button
                    onClick={handleEdit}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
              )}
            </ScrollArea>

            {/* 14 */}
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onLike}
                    className="hover:text-muted-foreground transition-colors"
                  >
                    <FaHeart
                      size={20}
                      className={isLiked ? "text-red-500" : ""}
                    />
                  </button>
                  <FaPaperPlane size={20} onClick={handleCopyLink} />
                </div>
                <FaRegBookmark size={20} onClick={handleSavePost} />
              </div>

              <p className="font-semibold text-sm mb-3">
                {post.likes.toLocaleString()} likes
              </p>

              {/* 15 */}
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <FaSmile size={22} />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                  className="flex-1 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className={`font-semibold text-sm transition-colors ${
                    commentText.trim()
                      ? "text-primary hover:text-primary/80"
                      : "text-primary/40"
                  }`}
                >
                  {isEditing ? "Update" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
