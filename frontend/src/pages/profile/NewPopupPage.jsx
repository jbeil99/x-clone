import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import './NewPopupPage.css';
import { useState } from "react";
import ProfileImageSection from "./components/editprofilecomponent/ProfileImageSection";
import CoverImageSection from "./components/editprofilecomponent/CoverImageSection";
import HeaderSection from "./components/editprofilecomponent/HeaderSection";
import NameField from "./components/editprofilecomponent/NameField";
import BioField from "./components/editprofilecomponent/BioField";
import LocationField from "./components/editprofilecomponent/LocationField";
import WebsiteField from "./components/editprofilecomponent/WebsiteField";
const NewPopupPage = ({ user, close }) => {
    const [isBirthdateModalOpen, setIsBirthdateModalOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-dark bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-black w-[700px] rounded-lg shadow-lg">
        {/* Header Section */}
        <HeaderSection close={close} />

        {/* Scrollable Content Section */}
        <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-dark">
          <div className="flex flex-col items-center">
            {/* Cover Image */}
            <CoverImageSection coverImage={user.cover_image} />

            {/* Profile Image */}
            <ProfileImageSection avatar={user.avatar} />
        {/* Form */}
        <form className="w-full mt-6 space-y-4">
            <NameField/>

            <BioField/>


  {/* Location Field */}
            <LocationField/>

  {/* Website Field */}
             <WebsiteField/>
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




 