import { useContext, useEffect, useState } from "react";
import BookingHomeStayBusiness from "../../components/BookingHomeStayBusiness";
import BookingPackageBusiness from "../../components/BookingPackageBusiness";
import { AuthContext } from "../../AuthContext/auth.provider";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import { Booking } from "../../type";

const bookingList = () => {
  const [activeButton, setActiveButton] = useState<string>("homestay");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const [booking, setBooking] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGuests, setFilteredGuests] = useState(booking);

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const fetchData = async () => {
    try {
      const response = await axiosPrivateBusiness(`/booking/`);

      if (response.data) {
        const filterData = await response.data.filter(
          (booking: any) =>
            (booking?.homestay?.business_user?.[0] === userInfo?._id ||
              booking?.package?.business_user === userInfo?._id) &&
            booking?.bookingStatus === "Confirmed"
        );
        console.log(filterData);

        setBooking(filterData);
        setFilteredGuests(filterData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(filteredGuests);

  const search = () => {
    const results = booking.filter((booking) =>
      `${booking.booker.name} ${booking.booker.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredGuests(results);
  };

  return (
    <div>
      {userInfo ? (
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
          <div className="flex justify-between">
            <div className="w-1/2"></div>
            <div className="w-1/2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
              >
                <label className="flex items-center gap-2">
                  <input
                    id="search"
                    type="text"
                    className="grow rounded-full"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 opacity-70"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </label>
              </form>
            </div>
          </div>

          {activeButton == "homestay" ? (
            <div>
              <BookingHomeStayBusiness bookingData={filteredGuests} />
            </div>
          ) : (
            activeButton == "package" && (
              <div>
                <BookingPackageBusiness bookingData={filteredGuests}/>
              </div>
            )
          )}
        </div>
      ) : (
        <div>{/* <LoadingTravel /> */}</div>
      )}
    </div>
  );
};

export default bookingList;
