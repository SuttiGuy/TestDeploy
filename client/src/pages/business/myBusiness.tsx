import { useEffect, useState } from "react";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import BusinessHomeStay from "../../components/BusinessHomeStay";
import BusinessPackage from "../../components/BusinessPackage";
import { Booking } from "../../type";

const myBusiness = () => {
  const [myHomestayAndPackage, setMyHomestayAndPackage] = useState<Booking[]>(
    []
  );
  const [activeButton, setActiveButton] = useState<string>("homestay");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivateBusiness(
          `/business-homestay/${userInfo?._id}`
        );
        console.log(response.data);

        setMyHomestayAndPackage(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo?._id]);

  if (!myHomestayAndPackage) {
    return <div>no my booking</div>;
  }

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div>
      {myHomestayAndPackage ? (
        <div className="container w-full px-6 my-5">
          <div>
            {activeButton === "homestay" ? (
              <span className="text-2xl">
                โฮมสเตย์ของ-{userInfo?.businessName}
              </span>
            ) : activeButton === "package" ? (
              <span className="text-2xl">
                แพ็คเกจของ-{userInfo?.businessName}
              </span>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex w-full gap-5 my-5">
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("homestay")}
                className={`shadow-boxShadow rounded-md py-2 w-full
            ${
              activeButton === "homestay"
                ? "bg-primaryBusiness text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                ที่พัก
              </button>
            </div>
            <div className="w-1/2">
              <button
                onClick={() => handleButtonClick("package")}
                className={`shadow-boxShadow rounded-md py-2 w-full
            ${
              activeButton === "package"
                ? "bg-primaryBusiness text-white"
                : "bg-primaryActive text-black"
            }`}
              >
                แพ็คเกจ
              </button>
            </div>
          </div>

          {activeButton == "homestay" ? (
            <div>
              <BusinessHomeStay />
            </div>
          ) : activeButton == "package" ? (
            <div>
              <BusinessPackage />
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

export default myBusiness;
