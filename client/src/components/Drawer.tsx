import React, { useContext, useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext/auth.provider";
import { useNavigate } from "react-router-dom";

const Drawer: React.FC = () => {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const authContext = useContext(AuthContext);
  const [activeItem, setActiveItem] = useState<string>("Profile");
  const navigate = useNavigate();
  const handleClick = (item: string) => {
    setActiveItem(item);
  };

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const {
    userInfo,
    handleLogout,
    // setUserInfo,
    // setLoadPage
  } = authContext;
  useEffect(() => {
    navigate(`/dashboard-${userInfo?.role}/Profile-${userInfo?.role}`);
  }, []);

  return (
    <div>
      <div className="md:w-1/4 mt-2">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col md:items-center justify-center">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-2"
              className={
                userInfo?.role === "user"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryUser to-secondUser "
                  : userInfo?.role === "business"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryBusiness to-secondBusiness"
                  : userInfo?.role === "admin"
                  ? "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-primaryAdmin to-secondAdmin"
                  : "btn btn-circle btn-primary drawer-button lg:hidden bg-gradient-to-b from-dark to-smoke"
              }
            >
              <RxHamburgerMenu />
            </label>
          </div>
          <div className="drawer-side z-10">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="menu bg-white text-black min-h-full w-80 p-4 text-xl">
              <div className="flex items-center justify-start my-5 rounded-full">
                {/* <div className="relative group ">
                  <div className="rounded-full h-14 w-14 object-cover bg-dark">
                    <img
                      src={userInfo?.image}
                      alt="Profile"
                      className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-30 rounded-full"
                    />
                  </div>
                  <label
                    className="absolute inset-0 bg-opacity-50 text-white text-lg cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ textAlign: "center" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                      <div className="flex flex-col items-center justify-center">
                        <p>
                          <BsCamera />
                        </p>
                        <p>เปลี่ยนรูป</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleChange}
                    />
                  </label>
                </div> */}
                {/* <div className=" w-full flex items-center justify-center">
                  <span className="truncate max-w-44">
                    {userInfo?.role === "user" || userInfo?.role === "admin"
                      ? `${userInfo?.name} ${userInfo?.lastName}`
                      : userInfo?.role === "business"
                      ? `${userInfo?.businessName}`
                      : null}
                  </span>
                </div> */}
              </div>
              <hr className="h-px bg-primaryUser border-0"></hr>
              {/* Sidebar content here */}
              <div className="mt-5">
                {userInfo?.role === "user" ? (
                  <div>
                    <Link to="/dashboard-user/Profile-User">
                      <li
                        onClick={() => handleClick("Profile")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "Profile"
                            ? "bg-primaryUser text-white"
                            : ""
                        }`}
                      >
                        <a>บัญชีของฉัน</a>
                      </li>
                    </Link>
                    <Link to="/dashboard-user/Booking-user">
                      <li
                        onClick={() => handleClick("My Bookings")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "My Bookings"
                            ? "bg-primaryUser text-white"
                            : ""
                        }`}
                      >
                        <a>การจอง</a>
                      </li>
                    </Link>
                    <Link to="/dashboard-user/HistiryReview-user">
                      <li
                        onClick={() => handleClick("My review")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "My review"
                            ? "bg-primaryUser text-white"
                            : ""
                        }`}
                      >
                        <a>ประวัติรีวิว</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "business" ? (
                  <div>
                    <Link to={"/dashboard-business/Profile-business"}>
                      <li
                        onClick={() => handleClick("Profile")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "Profile"
                            ? "bg-primaryBusiness text-white"
                            : ""
                        }`}
                      >
                        <a>บัญชีของฉัน</a>
                      </li>
                    </Link>
                    <Link to={"/dashboard-business/MyBusiness-business"}>
                      <li
                        onClick={() => handleClick("MyBusiness")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "MyBusiness"
                            ? "bg-primaryBusiness text-white"
                            : ""
                        }`}
                      >
                        <a>ที่พัก / แพ็คเกจ</a>
                      </li>
                    </Link>
                    <Link to={"/dashboard-business/BookingList-business"}>
                    <li
                        onClick={() => handleClick("BookingList")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "BookingList"
                            ? "bg-primaryBusiness text-white"
                            : ""
                        }`}
                      >
                        <a>รายการจอง</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>รีวิว</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "admin" ? (
                  <div>
                    <Link to={"/dashboard-admin/Profile-admin"}>
                      <li>
                        <a>บัญชีของฉัน</a>
                      </li>
                    </Link>
                    <Link to={"/dashboard-admin/Payment"}>
                      <li>
                        <a>รายชื่อผู้รับเงิน</a>
                      </li>
                    </Link>
                  </div>
                ) : null}
                <hr className="h-px my-4 bg-primaryUser border-0"></hr>
                {userInfo?.role === "user" ? (
                  <div>
                    <Link to={"/dashboard-user/HistiryBooking-user"}>
                      <li
                        onClick={() => handleClick("HistoryBooking")}
                        className={`cursor-pointer rounded-md ${
                          activeItem === "HistoryBooking"
                            ? "bg-primaryUser text-white"
                            : ""
                        }`}
                      >
                        <a>ประวัติการจอง</a>
                      </li>
                    </Link>
                  </div>
                ) : userInfo?.role === "business" ? (
                  <div>
                    <Link to={"#"}>
                      <li>
                        <a>ประวัติการจอง (UC8)</a>
                      </li>
                    </Link>
                    <Link to={"#"}>
                      <li>
                        <a>วิธีรับเงิน (UC17)</a>
                      </li>
                    </Link>
                  </div>
                ) : null}
                <li onClick={handleLogout}>
                  <a>Log out</a>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
