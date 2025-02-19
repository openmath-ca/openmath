"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  
  // Hide the navbar when viewing a lesson inside the popup (iframe)
  if (pathname.startsWith("/lessons/") && pathname != "/lessons/") return (
    <nav className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-transparent z-50">
      {isDarkMode ? <p style={{ color: "#292d3e" }}>.1</p> : <p style={{color: "#ffffff"}}>.2</p> }
    </nav>
  );
  return (
    <nav className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-transparent z-50">
      <div className="flex items-center gap-6">
        <Link href="/">
          <span className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            OpenMath
          </span>
        </Link>
        <Link href="/lessons">
          <span className="text-lg font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
            Lessons
          </span>
        </Link>
      </div>
      <div className="p-2">
        <button
          className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
          onClick={toggleDarkMode}
        >
          <span className="material-icons text-2xl">
            {isDarkMode ? "light_mode" : "dark_mode"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
