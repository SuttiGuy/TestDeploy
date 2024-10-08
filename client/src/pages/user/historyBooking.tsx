import { useEffect, useState } from "react";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import HistoryPackage from "../../components/HistoryPackage";
import HistoryHomeStay from "../../components/HistoryHomeStay";
import { Booking } from "../../type";

const historyBooking = () => {
  const [myBooking, setMyBooking] = useState<Booking[]>([]);
  const [activeButton, setActiveButton] = useState<string>("homestay");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  const fetchData = async () => {
    try {
      const response = await axiosPrivateUser(
        `/booking-check-in/${userInfo?._id}`
      );
      setMyBooking(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userInfo?._id]);

  if (!myBooking) {
    return <div>no my booking</div>;
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div>
      {myBooking ? (
        <div className="container w-full px-6 my-5">
          <div>
            <span className="text-2xl">ประวัติการจอง</span>
          </div>

          <div className="flex w-[35rem] md:w-[37rem] lg:w-[35rem] xl:w-[49em]  2xl:w-[65rem] gap-5 my-5">
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("homestay")}
                className={`shadow-boxShadow rounded-md py-2 w-[100%]
            ${
              activeButton === "homestay"
                ? "bg-primaryUser text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                ที่พัก
              </button>
            </div>
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("package")}
                className={`shadow-boxShadow rounded-md py-2 w-[100%]
            ${
              activeButton === "package"
                ? "bg-primaryUser text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                แพ็คเกจ
              </button>
            </div>
          </div>

          {activeButton == "homestay" ? (
            <div>
              <HistoryHomeStay />
            </div>
          ) : activeButton == "package" ? (
            <div>
              <HistoryPackage />
            </div>
          ) : (
            <div>
              <span>ไม่พบประวัติการจอง</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <LoadingTravel />
        </div>
      )}
    </div>
  );
};

export default historyBooking;
