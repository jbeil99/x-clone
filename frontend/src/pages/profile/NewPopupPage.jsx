import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const NewPopupPage = ({ user, close }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-[#202327] w-[600px] rounded-lg shadow-lg p-6">
        <button onClick={close} className="absolute top-3 right-3">
          <AiOutlineCloseCircle className="text-white text-2xl cursor-pointer" />
        </button>

        <div className="flex flex-col items-center">
          {/* Cover Image */}
          <div className="w-full h-40 bg-gray-700 rounded-t-lg relative">
            <img
              src={user.cover_image || "/default-cover.jpg"}
              alt="Cover"
              className="w-full h-full object-cover rounded-t-lg"
            />
            <button className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
              Change Cover
            </button>
          </div>

          {/* Profile Image */}
          <div className="relative -mt-12">
            <img
              src={user.avatar || "/default-avatar.jpg"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-[#202327] object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-full">
              Change
            </button>
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