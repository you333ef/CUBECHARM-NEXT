import React from "react";
import { FiX } from "react-icons/fi";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal that shows usage instructions for building the floor grid
const FloorPlanInstructionsModal = ({
  isOpen,
  onClose,
}: InstructionsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl"
      >
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Instructions
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Static instructions for users creating a floor grid */}
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
                  1
                </span>
                Grid Creation Requirements
              </h4>
              <p className="text-sm ml-8">
                To create a grid, you must first select a{" "}
                <strong>Background Image</strong>, then set both{" "}
                <strong>Width</strong> and <strong>Height</strong> values.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
                  2
                </span>
                Minimum Required Items
              </h4>
              <p className="text-sm ml-8">
                You must add images to meet the minimum required number of
                cells. This value is automatically calculated based on your grid
                size and is displayed in the{" "}
                <strong>Minimum required items</strong> field.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-sm">
                  3
                </span>
                Multi Image Count Rule
              </h4>
              <p className="text-sm ml-8">
                When setting <strong>Multi Image Count</strong> to a value
                greater than 1, you are required to fill at least 40% of the
                minimum required items with multiple images. The exact number
                needed is shown in the <strong>Final Required Cells</strong>{" "}
                field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanInstructionsModal;
