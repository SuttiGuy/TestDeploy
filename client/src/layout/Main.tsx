import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../AuthContext/auth.provider";
import Animetionload from "../assets/loadingAPI/loaddingTravel";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase.config";
import Footer from "../components/Footer";

const Main: React.FC = () => {
  const location = useLocation();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { thisPage, setThisPage, loadPage, setLoadPage, thisSunOrMoon } =
    authContext;

  const [isImage, setIsImage] = useState<string>("");

  useEffect(() => {
    setThisPage(location.pathname);
  }, [location.pathname, setThisPage]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const pathImage = `Homepage/${thisSunOrMoon}.jpg`;
        const filePath = pathImage;
        const storageRef = ref(storage, filePath);
        const url = await getDownloadURL(storageRef);
        if (url) {
          setIsImage(url);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    if (thisPage === "/") {
      setLoadPage(false);
      fetchImage().finally(() => setLoadPage(true));
    } else {
      setLoadPage(true)
      return;
    }
  }, [thisSunOrMoon, thisPage]);

  return (
    <div>
      {loadPage ? (
        <>
          <Navbar image={isImage} />
            <Outlet />
          <Footer />
        </>
      ) : (
        <>
          <Animetionload />
        </>
      )}
    </div>
  );
};

export default Main;
