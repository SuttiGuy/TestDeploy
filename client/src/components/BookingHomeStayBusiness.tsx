import { useContext, useEffect, useState } from "react";
import axiosPrivateBusiness from "../hook/axiosPrivateBusiness";
import { AuthContext } from "../AuthContext/auth.provider";
import { TbMapQuestion, TbMoodKid } from "react-icons/tb";
import { GoHome } from "react-icons/go";
import { Booking, BookingHomeStayBusinessProps } from "../type";
import { FiUsers } from "react-icons/fi";
import Swal from "sweetalert2";
import { MdOutlineEmail } from "react-icons/md";
import {
  FaRegCalendarCheck,
  FaRegCheckCircle,
  FaRegUser,
} from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";

const BookingHomeStayBusiness: React.FC<BookingHomeStayBusinessProps> = ({ bookingData,}) => {
  const [myBooking, setMyBooking] = useState<Booking[]>([]);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  const fetchData = async () => {
    try {
      if (bookingData) {
        const filterHomestay = bookingData.filter(
          (booking: any) => booking.homestay
        );
        setMyBooking(filterHomestay);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userInfo?._id, bookingData]);

  const monthNamesTH = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  function formatDateToThai(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = monthNamesTH[date.getUTCMonth()];
    const year = date.getUTCFullYear() + 543;

    return `${day.toString().padStart(2, "0")} ${month} ${year}`;
  }

  // ปรับฟังก์ชันให้รองรับการส่งค่าแค่ startDate
  function formatBookingDates(startDate: string, endDate?: string): string {
    const startDateFormatted = formatDateToThai(startDate);

    if (endDate) {
      const endDateFormatted = formatDateToThai(endDate);
      return `${startDateFormatted} - ${endDateFormatted}`;
    }

    // ถ้าไม่มี endDate ให้แสดงเฉพาะ startDate
    return startDateFormatted;
  }

  const cancelBooking = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการยกเลิกการจองโฮมสเตย์นี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ยกเลิกเลย!",
        cancelButtonText: "ไม่ยกเลิก",
      });

      if (result.isConfirmed) {
        await axiosPrivateBusiness.put(`/cancelBooking/${id}`);
        fetchData();
        await Swal.fire({
          title: "ยกเลิกแล้ว!",
          text: "การจองโฮมสเตย์ของคุณถูกยกเลิกเรียบร้อยแล้ว.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div>
      {myBooking.length > 0 ? (
        myBooking?.map((booking, index) => (
          <div key={index} className="px-0 xl:px-10 hover:scale-101 transition-transform duration-200">
            <div className="w-full my-5 shadow-boxShadow rounded-lg flex gap-2 flex-wrap xl:flex-nowrap">
              <div className="p-5 flex flex-col  xl:flex-row w-full xl:w-full">
                <div className=" xl:w-2/3 flex flex-col gap-2">
                  <div className="flex justify-between ">
                    <div className="flex flex-col">
                      <span className="text-md font-bold ">
                        {booking?.homestay.name_homeStay}
                      </span>
                      <span className="text-md ">
                        ({booking?.detail_offer[0].name_type_room})
                      </span>
                    </div>
                    <div
                      id="status1"
                      className="bg-green-400 px-3 h-8 rounded-full text-white xl:hidden flex justify-center items-center"
                    >
                      {booking.bookingStatus}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      <MdOutlineEmail /> {booking?.booker.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaRegUser /> {booking?.booker.name}{" "}
                      {booking?.booker.lastName}
                    </span>
                  </div>

                  <div className="text-sm">
                    <span className="flex items-center gap-2">
                      <FaRegCalendarCheck />
                      {formatBookingDates(
                        booking?.bookingStart,
                        booking?.bookingEnd
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoPricetagsOutline />
                    <span>
                      ฿{" "}
                      {booking?.detail_offer[0].totalPrice.toLocaleString(
                        "th-TH",
                        {
                          style: "decimal",
                          minimumFractionDigits: 2,
                        }
                      )}{" "}
                    </span>
                  </div>
                  <div className="text-md">
                    <span className="flex items-center gap-2">
                      <div className="flex items-center">
                        <FiUsers /> {booking?.detail_offer[0].adult}
                      </div>
                      <div className="flex items-center">
                        <TbMoodKid />
                        {booking?.detail_offer[0].child}
                      </div>
                      <div className="flex items-center">
                        <GoHome />
                        {booking?.detail_offer[0].room}
                      </div>
                    </span>
                  </div>
                </div>
                <div className=" xl:w-1/3 flex flex-col justify-start gap-5 items-end xl:border-l">
                  {booking.bookingStatus === "Confirmed" && (
                    <div
                      id="status2"
                      className="bg-green-400 px-3 rounded-full text-white hidden xl:block"
                    >
                      ชำระเงินแล้ว
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => cancelBooking(booking?._id)}
                      className="hover:scale-110 transition-transform duration-200 hover:text-red-500"
                    >
                      <FaRegTrashCan className="w-5 h-5" />
                    </button>
                    <button
                      // onClick={() => cancelBooking(myBooking[index]?._id)}
                      className="hover:scale-110 transition-transform duration-200 hover:text-blue-500"
                    >
                      <FaRegCheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center w-full p-20">
          <span className="text-2xl flex items-center gap-5">
            <TbMapQuestion />
            ไม่พบประวัติการจองที่พัก
          </span>
        </div>
      )}
    </div>
  );
};

export default BookingHomeStayBusiness;
