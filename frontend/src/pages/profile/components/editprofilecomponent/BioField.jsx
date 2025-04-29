import React from "react";

const BioField = ({ bio, setBio }) => {
  return (
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
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder=" "
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
  );
};

export default BioField;