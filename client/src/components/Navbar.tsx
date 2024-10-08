import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Search from "./Search";
import { AuthContext } from "../AuthContext/auth.provider";
import Modal from "./Get-Stared";
import ModalSelectRoles from "./Modal-SelectRoles";
import { BsPersonWalking } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  image: string;
}

const Navbar: React.FC<NavbarProps> = ({ image }) => {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { thisPage, userInfo, handleLogout, setLoadPage } = authContext;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleCreateAdmin = () => {
    (document.getElementById("Get-Started") as HTMLDialogElement)?.showModal();
  };

  return (
    <div>
      <nav
        className={
          thisPage === "/"
            ? "bg-white w-full relative"
            : userInfo &&
              userInfo.role === "user" &&
              thisPage !== "/search/search-result"
            ? "bg-gradient-to-r from-primaryUser to-secondUser w-full relative"
            : userInfo &&
              userInfo.role === "business" &&
              thisPage !== "/search/search-result"
            ? "bg-gradient-to-r from-primaryBusiness to-secondBusiness w-full relative"
            : userInfo &&
              userInfo.role === "admin" &&
              thisPage !== "/search/search-result"
            ? "bg-gradient-to-r from-primaryAdmin to-secondAdmin w-full relative"
            : "bg-gradient-to-r from-primaryNoRole to-secondNoRole w-full relative"
        }
      >
        <div
          className={
            (!userInfo && thisPage === "/") || (userInfo && thisPage === "/")
              ? "relative p-8 h-full"
              : "relative"
          }
          style={
            (!userInfo && thisPage === "/") || (userInfo && thisPage === "/")
              ? {
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {}
          }
        >
          <div className="flex items-center justify-between">
            <Modal name="Get-Started" />
            <ModalSelectRoles name="Modal-SelectRoles" />
            <Link
              to="/"
              className="flex items-center space-x-3 rtl:space-x-reverse text-xl"
            >
              <BsPersonWalking className="h-8 w-10" />
              <span className="self-center font-bold whitespace-nowrap">
                H2O
              </span>
            </Link>

            <button
              className="text-lg font-bold py-2 px-4 rounded"
              onClick={
                !userInfo && thisPage === "/"
                  ? () => {
                      (
                        document.getElementById(
                          "Get-Started"
                        ) as HTMLDialogElement
                      )?.showModal();
                    }
                  : !userInfo && thisPage !== "/"
                  ? () => {
                      navigate(`/`);
                      setLoadPage(false);
                      setTimeout(() => {
                        (
                          document.getElementById(
                            "Get-Started"
                          ) as HTMLDialogElement
                        )?.showModal();
                        setLoadPage(true);
                      }, 1000);
                    }
                  : toggleDropdown
              }
            >
              {!userInfo ? (
                <div id="GetStarted">Get Started</div>
              ) : (
                <>
                  <div className="relative flex">
                    <div className="mx-5 hidden lg:flex flex-grow text-lg ">
                      {userInfo.role === "user" || userInfo.role === "admin"
                        ? `${userInfo.name} ${userInfo.lastName}`
                        : userInfo.role === "business"
                        ? `${userInfo.businessName}`
                        : null}
                    </div>
                    <div className="flex items-center">
                      <img
                        id="avatarButton"
                        className="w-8 h-8 rounded-full cursor-pointer"
                        src={userInfo.image}
                        alt="User avatar"
                      />
                    </div>

                    {isOpen && (
                      <div
                        id="userDropdown"
                        className="z-50 absolute right-9 top-9 divide  divide-y  rounded-[1.25rem] rounded-tr-[0rem] shadow w-44 card-box"
                      >
                        <div className="px-4 py-3 text-sm">
                          <div className="truncate flex items-center justify-center lg:hidden">
                            {userInfo.role === "user" ||
                            userInfo.role === "admin"
                              ? `${userInfo.name} ${userInfo.lastName}`
                              : userInfo.role === "business"
                              ? `${userInfo.businessName}`
                              : null}
                          </div>
                          <div className="font-medium truncate">
                            {userInfo.role && userInfo._id
                              ? userInfo.role === "user"
                                ? `USER`
                                : userInfo.role === "business"
                                ? `BUSINESS`
                                : userInfo.role === "admin"
                                ? `ADMIN`
                                : null
                              : "Welcome, Guest"}
                          </div>
                        </div>
                        <ul
                          className="py-2 text-sm"
                          aria-labelledby="avatarButton"
                        >
                          <li>
                            <a
                              href={`/dashboard-${userInfo.role}/Profile-${userInfo.role}`}
                              className="block px-4 py-2"
                            >
                              Dashboard
                            </a>
                          </li>
                          {userInfo && userInfo.role === "business" && (
                            <li>
                              <a
                                href="/create-business"
                                className="block px-4 py-2"
                              >
                                Create a sale
                              </a>
                            </li>
                          )}
                          {userInfo && userInfo.role === "admin" && (
                            <li>
                              <a
                                className="block px-4 py-2"
                                onClick={handleCreateAdmin}
                              >
                                Create a User
                              </a>
                            </li>
                          )}
                          <li>
                            <a href="#" className="block px-4 py-2">
                              Settings
                            </a>
                          </li>
                        </ul>
                        <div className="py-1">
                          <a
                            onClick={handleLogout}
                            className="block px-4 py-2 text-sm"
                          >
                            Sign out
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </button>
          </div>
          {(!userInfo && thisPage === "/") || (userInfo && thisPage === "/") ? (
            <div className="flex items-center my-[65px] lg:my-[250px]">
              <Search />
            </div>
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
