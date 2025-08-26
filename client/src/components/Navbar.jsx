import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow-md">
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">plusOne</h1>

      {/* Navigation / Right Section */}
      <div className="flex items-center gap-4">
        <button className="mx-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition">
          Profile
        </button>
      </div>
    </div>
  );
};

export default Navbar;
