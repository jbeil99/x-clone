import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const HeaderSection = ({ close }) => {
  return (
    <div className="flex items-center justify-between px-3 py-3 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <button onClick={close} aria-label="Close" className="text-white text-xl">
          <AiOutlineCloseCircle />
        </button>
        <h2 className="text-white text-lg font-bold">Edit profile</h2>
      </div>
      <button
        type="submit"
        className="bg-gray-100 text-black font-bold py-1 px-4 rounded-full hover:bg-gray-200"
      >
        Save
      </button>
    </div>
  );
};

export default HeaderSection;