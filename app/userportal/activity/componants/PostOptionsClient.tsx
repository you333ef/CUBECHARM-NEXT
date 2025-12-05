"use context"
import AuthContext from "@/app/providers/AuthContext";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import ReactDOM from "react-dom";

import { toast } from "sonner";


interface PostOptionsDialogProps {
  open?: boolean;
  onClose?: () => void;
  postId?: number;
  username?: string;
}

const PostOptionsDialog: React.FC<PostOptionsDialogProps> = ({ open, onClose, postId, username }) => {
  const {role, setRole } =useContext(AuthContext)!;
 const navi=useRouter()
  if (!open) return null;


 
  



   const handleAction = (action: string) => {

    // not authorized
    if (!role) {
      onClose?.();
      toast.error('Register first to access this feature');
      navi.push('/providers/UnAuthorized');
      return;
    }

    onClose?.();

    switch (action) {
      case "report":
        toast.error("Post reported successfully");
        break;
      case "unfollow":
        toast.success(`Unfollowed ${username || "user"}`);
        break;
      case "block":
        toast.error(`Blocked ${username || "user"}`);
        break;
      case "copy":
       

        toast.success("Link copied to clipboard");
        break;
      case "share":
        toast.success("Share options opened");
        break;
      case "about":
        toast.info(`About ${username || "this account"}`);
        break;
      default:
        toast.error("Something went wrong");
    }
  };


  const dialog = (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-[99999]">
      <div className="bg-white rounded-2xl shadow-xl w-[320px] overflow-hidden animate-fadeIn">
        <h2 className="sr-only">Post Options</h2>
        <div className="flex flex-col text-center">
          <button
            onClick={() => handleAction("report")}
            className="py-3 px-4 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
          >
            Report
          </button>
          <button
            onClick={() => handleAction("unfollow")}
            className="py-3 px-4 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
          >
            Unfollow
          </button>
          <button
            onClick={() => handleAction("block")}
            className="py-3 px-4 text-sm font-semibold text-red-500 hover:bg-gray-100 border-b"
          >
            Block User
          </button>
          <button
            onClick={() => handleAction("copy")}
            className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
          >
            Copy Link
          </button>
          <button
            onClick={() => handleAction("share")}
            className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
          >
            Share to...
          </button>
          <button
            onClick={() => handleAction("about")}
            className="py-3 px-4 text-sm hover:bg-gray-100 border-b"
          >
            About this account
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(dialog, document.body);
};

export default PostOptionsDialog;
