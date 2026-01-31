// components/ReportModal.tsx
import { useState } from "react";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    reportId: string | number;
    reason: string;
    description: string;
  }) => void;
  reportId: string | number;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reportId,
}) => {
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (): void => {
    if (reason && description) {
      onSubmit({ reportId, reason, description });
      onClose();
    } else {
      toast.error("Please fill in both the reason and description.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Report</h2>

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a reason</option>
            <option value="Spam">Spam</option>
            <option value="Inappropriate">Inappropriate</option>
            <option value="Fraud">Fraud</option>
            <option value="Harassment">Harassment</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Submit
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
