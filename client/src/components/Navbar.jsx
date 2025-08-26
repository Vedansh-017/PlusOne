import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white text-primary shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">plusONE</h1>

      {/* Navigation / Right Section */}
      <div className="flex items-center gap-4">
        <button className="mx-4 px-4 py-2 rounded-xl bg-primary hover:bg-blue-700 transition text-white">
          Profile
        </button>
      </div>
    </div>
  );
};

export default Navbar;
