import React from "react";

const AdditionalLinks = ({ onBirthdateClick, user }) => {
  return (
    <>
      {/* Birthdate Field */}
      <div
        onClick={onBirthdateClick}
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

      {/* Create Expanded Bio */}
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

      {/* Switch to Professional */}
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
    </>
  );
};

export default AdditionalLinks;