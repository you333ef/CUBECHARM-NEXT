"use client";

import React from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

export interface PostOptionDialogProps {
  open?: boolean;
  onClose?: () => void;
  postId?: number;
  isOwner: boolean;
  onReport: () => void;
  onBlock?: () => void;
  onDelete?: () => void;
   onUpdate?: () => void;  
  showUpdate?: boolean;  
  post?: any;
  GETACTIVITY_FeeD?: () => Promise<void>;
  username?: string;
}

const PostOptionDialogClient: React.FC<PostOptionDialogProps> = ({
  open,
  onClose,
  postId,
  username,
  onBlock,
  onDelete,
  isOwner,
  onUpdate,     
  showUpdate, 
  onReport,
  GETACTIVITY_FeeD,
}) => {
  if (!open) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(`https://yourapp.com/post/${postId}`);
    toast.success("Link copied to clipboard");
  };

  const openReportModal = () => {
    onReport();
    onClose?.();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[99999]">
      <div className="bg-white rounded-2xl shadow-xl w-[320px] overflow-hidden animate-fadeIn">
        <div className="flex flex-col text-center">
          {isOwner ? (
            <>
              <button
                onClick={() => {
                  onDelete?.();
                  onClose?.();
                }}
                className="py-3 px-4 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
              >
                Delete
              </button>
          {showUpdate && onUpdate && (
      <button
        onClick={() => {
          onUpdate();
          onClose?.();
        }}
        className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
      >
        Update
      </button>
    )}

              <button
                onClick={copyLink}
                className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
              >
                Copy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openReportModal}
                className="py-3 px-4 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
              >
                Report
              </button>
              <button
                onClick={() => {
                  onBlock?.();
                  onClose?.();
                }}
                className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
              >
                Block
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="py-3 px-4 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostOptionDialogClient;
