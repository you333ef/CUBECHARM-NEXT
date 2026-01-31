import React from "react";
import { FiTrash2, FiUpload } from "react-icons/fi";

interface CellActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onAdd: () => void;
}

// Modal with actions related to a single grid cell
const CellActionsModal = ({
  isOpen,
  onClose,
  onDelete,
  onAdd,
}: CellActionsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-sm shadow-2xl"
      >
        <div className="px-3 pb-2 space-y-1">
          <button
            onClick={onDelete}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 text-red-600"
          >
            <FiTrash2 /> Delete
          </button>

          <button
            onClick={onAdd}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2"
          >
            <FiUpload /> Add
          </button>
        </div>

        <div className="px-6 pb-5 pt-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CellActionsModal;
