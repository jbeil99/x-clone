import React from "react";

const BirthdateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-5">
      <div className="bg-[#0a0a0a] rounded-2xl w-80 p-6 flex flex-col items-center">
        <h2 className="text-white text-lg mb-6">Edit Birth Date</h2>
        <input
          type="date"
          className="w-full p-3 border border-gray-600 bg-transparent text-white rounded-md mb-6"
        />
        <div className="flex flex-col w-full gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#eff3f4] rounded-2xl h-12 text-black hover:bg-[#d9e1e5]"
          >
            Edit
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-700 rounded-2xl h-12 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdateModal;