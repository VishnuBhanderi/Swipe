import React, { useState } from "react";
import logo from "../assets/logo.svg";
import sun from "../assets/icon-sun.svg";
import moon from "../assets/icon-moon.svg";
import useDarkMode from "../hooks/useDarkMode";
import profile from "../assets/profile.webp";
import { motion } from "framer-motion";

function Header() {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = () => {
    setTheme(colorTheme);
    setDarkSide((state) => !state);
  };

  const transition = {
    type: "spring",
    stiffness: 200,
    damping: 10,
  };

  return (
    <div className="dark:bg-[#141625] bg-[#14162550] rounded-b-3xl">
      {/* Header */}
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
          backdropFilter: "blur(10px)", // Blur effect
        }}
        className=" h-[80px] rounded-b-3xl z-50  duration-300 ease-in-out  p-4 shadow-sm flex items-center justify-end "
      >
        {/* Logo img */}

        <img
          src={logo}
          className="h-[80px] rounded-b-l-3xl absolute top-0 left-0"
          alt="logo"
          style={{
            width: "120px", // Adjust the width to your preference
            height: "auto", // Maintain aspect ratio
            paddingLeft: "20px", // Adjust left padding
            paddingTop: "20px", // Adjust top padding
            position: "absolute",
            top: "0",
            left: "0",
          }}
        />

        {/* Right side */}
        <div className="  flex  items-center  ">
          {/* darkMode Button */}

          {colorTheme === "dark" ? (
            <motion.img
              onClick={toggleDarkMode}
              initial={{ scale: 0.9, rotate: 90 }}
              animate={{ scale: 1, rotate: 360, transition }}
              whileTap={{ scale: 0.9, rotate: 15 }}
              src={moon}
              alt="moon"
              className="cursor-pointer h-6"
            />
          ) : (
            <motion.img
              className="cursor-pointer h-7"
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.9, rotate: 15 }}
              initial={{ rotate: 45 }}
              animate={{ rotate: 360, transition }}
              src={sun}
              alt="sun"
            />
          )}

          <div className=" h-[80px] border-dotted border-l border-[#494e6e] mx-6"></div>

          <div className=" relative  ">
            <img src={profile} className="h-[50px] rounded-full" />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
