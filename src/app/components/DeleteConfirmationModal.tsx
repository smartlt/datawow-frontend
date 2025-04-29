"use client";

import React from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-sm mx-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Please confirm if you wish to delete the post
          </h2>

          <p className="text-gray-600 text-sm mb-6 text-center">
            Are you sure you want to delete the post?
            <br />
            Once deleted, it cannot be recovered.
          </p>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0">
            <button
              onClick={onConfirm}
              className="w-full py-2 px-4 mx-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors order-1 sm:order-2"
            >
              Delete
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2 px-4 mx-2 bg-transparent text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
