import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import './NewPopupPage.css';
import { useState } from "react";
const NewPopupPage = ({ user, close }) => {
    const [isBirthdateModalOpen, setIsBirthdateModalOpen] = useState(false);

  return (
<div className="fixed top-0 left-0 w-full h-full bg-dark bg-opacity-50 flex items-center justify-center">
  <div className="relative bg-black w-[700px] rounded-lg shadow-lg">
    {/* Header Section */}
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

    {/* Scrollable Content Section */}
    <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-dark">
    <div className="flex flex-col items-center">
        {/* Cover Image */}
        <div className="relative w-full h-70 bg-black-700 rounded-t-lg overflow-hidden">
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

        {/* Profile Image */}
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
</div>
        {/* Form */}
        <form className="w-full mt-6 space-y-4">
<div className="relative flex flex-col gap-2">
  <div className="relative">
      <input
      id="name"
      name="name"
      type="text"
      autoCapitalize="sentences"
      autoComplete="off"
      autoCorrect="on"
      maxLength="50"
      spellCheck="true"
      dir="auto"
      defaultValue={user.name}
      placeholder=" "
      className="peer w-full bg-transparent border border-gray-600 rounded-lg p-3 pt-5 text-gray-200 placeholder-transparent text-base leading-5 focus:outline-none focus:border-blue-500"
      />
      <label
      htmlFor="name"
      className="absolute left-3 top-4 text-gray-400 text-base transition-all duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:left-3 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:scale-90"
      >
      Name
      </label>
  </div>
  </div>

  <div className="relative flex flex-col gap-2">
      <div className="relative">
          <textarea
          id="bio"
          name="bio"
          autoCapitalize="sentences"
          autoComplete="on"
          autoCorrect="on"
          maxLength="180"
          spellCheck="true"
          dir="auto"
          placeholder=" " // <-- Important: placeholder must be a single space!
          className="peer w-full h-20 bg-transparent border border-gray-600 rounded-lg p-3 pt-5 text-gray-200 placeholder-transparent text-lg leading-5 focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
          <label
          htmlFor="bio"
          className="absolute left-3 top-4 text-gray-400 text-lg transition-all duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:left-3 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:scale-90"
          >
          Bio
          </label>
      </div>
      </div>


  {/* Location Field */}
  <div className="relative flex flex-col gap-2">
  <div className="relative">
      <input
      id="location"
      name="location"
      type="text"
      defaultValue={user.location}
      placeholder=" "
      className="peer w-full bg-transparent border border-gray-600 rounded-lg p-3 pt-5 text-white placeholder-transparent text-base leading-5 focus:outline-none focus:border-blue-500"
      />
      <label
      htmlFor="location"
      className="absolute left-3 top-4 text-gray-400 text-lg transition-all duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:left-3 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:scale-90"
      >
      Location
      </label>
  </div>
  </div>

  {/* Website Field */}
  <div className="relative flex flex-col gap-2">
  <div className="relative">
      <input
      id="website"
      name="website"
      type="url"
      defaultValue={user.website}
      placeholder=" "
      className="peer w-full bg-transparent border border-gray-600 rounded-lg p-3 pt-5 text-white placeholder-transparent text-base leading-5 focus:outline-none focus:border-blue-500"
      />
      <label
      htmlFor="website"
      className="absolute left-3 top-4 text-gray-400 text-base transition-all duration-200 transform scale-100 origin-top-left pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:left-3 peer-focus:text-blue-500 peer-focus:text-xs peer-focus:scale-90"
      >
      Website
      </label>
  </div>
  </div>

  <div
  onClick={() => setIsBirthdateModalOpen(true)}
  className="py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer flex justify-between items-center"
>
  <div className="flex items-center gap-2">
    <span className="text-gray-400 text-base">Birth date</span>
    <span className="text-gray-500 text-base">{user.birthdate || "Not set"}</span>
  </div>
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="w-5 h-5 text-gray-400 fill-current"
  >
    <g>
      <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z" />
    </g>
  </svg>
</div>
{isBirthdateModalOpen && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-5">
  <div className="bg-[#0a0a0a] rounded-2xl w-80 p-6 flex flex-col items-center">
      <h2 className="text-white text-lg mb-6">Edit Birth Date</h2>
      
      <input
        type="date"
        className="w-full p-3 border border-gray-600 bg-transparent text-white rounded-md mb-6"
      />

      <div className="flex flex-col w-full gap-4">
        <button
          onClick={() => setIsBirthdateModalOpen(false)}
          className="w-full px-4 py-2 bg-[#eff3f4] rounded-2xl h-12 text-black hover:bg-[#d9e1e5]"
          >
          Edit
        </button>
        <button
          onClick={() => setIsBirthdateModalOpen(false)}
          className="w-full px-4 py-2 bg-gray-700 rounded-2xl h-12 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


  {/* Additional Fields */}
      <a
href="/settings/bio"
role="tab"
aria-selected="false"
className="flex items-center justify-between py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer"
data-testid="ExtendedButton_Edit_Extended_Profile"
>
<div className="flex items-center gap-2">
<span className="text-gray-400 text-base">Create expanded bio</span>
</div>
<svg
viewBox="0 0 24 24"
aria-hidden="true"
className="w-5 h-5 text-gray-400 fill-current"
>
<g>
<path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z" />
</g>
</svg>
</a>

<a
href="/i/flow/convert_to_professional"
role="tab"
aria-selected="false"
className="flex items-center justify-between py-2 border-b border-gray-600 hover:bg-gray-700 cursor-pointer"
data-testid="ProfessionalButton_Switch_To_Professional"
>
<div className="flex items-center gap-2">
<span className="text-gray-400 text-base">Switch to professional</span>
</div>
<svg
viewBox="0 0 24 24"
aria-hidden="true"
className="w-5 h-5 text-gray-400 fill-current"
>
<g>
<path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z" />
</g>
</svg>
</a>



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
</div>
  );
};

export default NewPopupPage;




 