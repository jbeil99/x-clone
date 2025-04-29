import React from "react";

const ProfileImageSection = ({ avatar }) => {
  return (
    <div className="relative mt-4 flex items-center">
      <div className="flex items-start">
        <div
          className="w-24 h-24 rounded-full border-4 border-[#202327] overflow-hidden"
          style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 20, 25, 0.75)",
          }}
        >
          <img
            src={avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <button
          aria-label="Add avatar photo"
          className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white p-2 rounded-full border-none"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
          >
            <g>
              <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
            </g>
          </svg>
        </button>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload avatar"
        />
      </div>
    </div>
  );
};

export default ProfileImageSection;