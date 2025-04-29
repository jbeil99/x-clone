import React from "react";

const NameField = ({ name, setName }) => {
  return (
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
  );
};

export default NameField;