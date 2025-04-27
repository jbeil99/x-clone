import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi"; // Import arrow icon

const NewPopupPage = ({ user, close }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-[#202327] w-[600px] rounded-lg shadow-lg p-6">
        <button onClick={close} className="absolute top-3 right-3">
          <AiOutlineCloseCircle className="text-white text-2xl cursor-pointer" />
        </button>

        <div className="flex flex-col items-center">
          {/* Cover Image */}
            `{/* Cover Image */}
            <div className="relative w-full h-40 bg-gray-700 rounded-t-lg overflow-hidden">
            <img
                src={user.cover_image || "/default-cover.jpg"}
                alt="Cover"
                className="w-full h-full object-cover"
            />
            <button
                aria-label="Add banner photo"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white"
                style={{
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(15, 20, 25, 0.75)",
                borderColor: "rgba(0, 0, 0, 0)",
                }}
            >
                <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="w-6 h-6"
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
                aria-label="Upload cover image"
            />
            </div>
`
        {/* Profile Image */}
        <div className="relative mt-4">
        <div
            className="w-24 h-24 rounded-full border-4 border-[#202327] overflow-hidden"
            style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 20, 25, 0.75)",
            }}
        >
            <img
            src={user.avatar || "/default-avatar.jpg"}
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

          {/* Form */}
          <form className="w-full mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-400">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={user.name}
                className="w-full p-2 bg-transparent border-b border-gray-600 text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-gray-400">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={user.bio}
                className="w-full p-2 bg-transparent border-b border-gray-600 text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-gray-400">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                defaultValue={user.location}
                className="w-full p-2 bg-transparent border-b border-gray-600 text-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-gray-400">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="url"
                defaultValue={user.website}
                className="w-full p-2 bg-transparent border-b border-gray-600 text-white focus:outline-none"
              />
            </div>

            {/* Additional Fields */}
            <div className="py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer flex justify-between items-center">
              <span className="text-gray-400">Birth date</span>
              <span className="text-gray-500 text-sm">{user.birthdate || "Not set"}</span>
              <FiChevronRight className="text-gray-400" />
            </div>

            <div className="py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer flex justify-between items-center">
              <span className="text-gray-400">Create expanded bio</span>
              <FiChevronRight className="text-gray-400" />
            </div>

            <div className="py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer flex justify-between items-center">
              <span className="text-gray-400">Switch to professional</span>
              <FiChevronRight className="text-gray-400" />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 rounded-full"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPopupPage;