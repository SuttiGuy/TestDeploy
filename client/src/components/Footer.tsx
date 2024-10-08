import { AuthContext } from "../AuthContext/auth.provider";
import { useContext, useEffect, useState } from "react";

const Footer = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, thisPage, isDarkMode, setIsDarkMode } = authContext;

  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight;
        setIsFooterVisible(isVisible);
      } else {
        return;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      id="footer"
      className={`relative z-50 w-full h-full ${isDarkMode ? "dark" : ""} `}
    >
      <div
        className={`fixed 
          ${isDarkMode ? "text-white" : "text-dark"}
          ${isFooterVisible ? "bottom-[calc(64px)]" : "bottom-5"} 
          right-5 transition-all`}
      >
        <label
          className={
            isDarkMode
              ? "swap swap-rotate bg-gradient-to-r from-gray-800 to-gray-700 rounded-full w-14 h-14"
              : "swap swap-rotate bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-14 h-14"
          }
        >
          <input
            type="checkbox"
            className="theme-controller hidden"
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          {/* sun icon */}
          <svg
            className="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          {/* moon icon */}
          <svg
            className="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
      <footer
        className={
          userInfo?.role === "user" &&
          thisPage !== "/" &&
          thisPage !== "/search/search-result"
            ? "bg-gradient-to-l from-primaryUser to-secondUser py-4"
            : userInfo?.role === "business" &&
              thisPage !== "/" &&
              thisPage !== "/search/search-result"
            ? "bg-gradient-to-l from-primaryBusiness to-secondBusiness py-4"
            : userInfo?.role === "admin" &&
              thisPage !== "/" &&
              thisPage !== "/search/search-result"
            ? "bg-gradient-to-l from-primaryAdmin to-secondAdmin py-4"
            : "bg-gradient-to-r from-primaryNoRole to-secondNoRole py-4"
        }
      >
        <div className="container mx-auto flex justify-center items-center">
          <p className="text-center">
            © 2024 Travel Website. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
