import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../AuthContext/auth.provider";
import OpenStreetMapShowData from "../components/OpenStreetMapShowData";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import Swal from "sweetalert2";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbMapQuestion } from "react-icons/tb";
import { GoHome } from "react-icons/go";
import { LiaChildSolid } from "react-icons/lia";
import { IoPeopleSharp } from "react-icons/io5";
import { Booking } from "../type";

const BookingHomeStay = () => {
  const [myBooking, setMyBooking] = useState<Booking[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  const [selectedBookingIndex, setSelectedBookingIndex] = useState<
    number | null
  >(null);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const fetchData = async () => {
    try {
      const response = await axiosPrivateUser(
        `/booking-confirm/${userInfo?._id}`
      );

      if (response.data) {
        // กรองข้อมูลที่มี homestayId
        const bookingsWithHomestay = response.data.filter(
          (booking: any) => booking.homestay
        );
        // บันทึกข้อมูลลงใน state
        setMyBooking(bookingsWithHomestay);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userInfo?._id]);

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
  const images = myBooking?.map((item: any, index: number) => {
    const imageItem = item?.detail_offer[0]?.image_room?.map(
      (image: any, i: number) => {
        return (
          <div key={i} className="relative group">
            <img
              className=" h-[300px] w-full xl:w-[600px] xl:h-[400px] object-cover transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-md"
              src={image?.image}
              alt=""
              onClick={() => setOpenModalIndex(index)} // เปิด modal ตาม index
            />
          </div>
        );
      }
    );

    return (
      <div key={index}>
        <dialog
          id={`imageBooking-${index}`}
          className={`modal ${openModalIndex === index ? "modal-open" : ""}`} // เช็คว่า modal นี้เปิดอยู่หรือไม่
          open={openModalIndex === index} // ควบคุมการเปิดปิด modal
        >
          <div className="modal-box w-11/12 max-w-7xl xl:max-w-5xl p-10">
            <h3 className="font-bold text-lg mb-5">รูปภาพ</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {imageItem}
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    );
  });

  const openModal = (modalId: string) => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

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
        await axiosPrivateUser.put(`/cancelBooking/${id}`);
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
  
  const openMapModal = (index: number) => {
    setSelectedBookingIndex(index);
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedBookingIndex(null);
  };

  return (
    <div>
      <div className="sticky top-0 z-50">
        {isMapModalOpen && selectedBookingIndex !== null && (
          <dialog id="maps" open={isMapModalOpen} className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
              <h3 className="font-bold text-lg">Maps</h3>
              <div className="py-4">
                {/* แสดงแผนที่ */}
                <OpenStreetMapShowData
                  lat={
                    myBooking[selectedBookingIndex]?.homestay.location[0]
                      .latitude_location
                  }
                  lng={
                    myBooking[selectedBookingIndex]?.homestay.location[0]
                      .longitude_location
                  }
                />
              </div>
              <div className="modal-action">
                <button onClick={closeMapModal} className="btn">
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
      {images}

      {myBooking.length > 0 ? (
        myBooking?.map((booking, index) => (
          <div key={index} className="px-0 xl:px-10">
            <div className="w-full my-5 shadow-boxShadow rounded-lg  flex gap-2 flex-wrap xl:flex-nowrap">
              <div
                className="w-full lg:h-full xl:w-1/3 rounded-l-lg "
                onClick={() => openModal(`imageBooking-${index}`)}
              >
                <div className="rounded-tl-lg w-full lg:h-[120px] xl:h-[150px]">
                  <div className="overflow-hidden">
                    <div className="relative">
                      <img
                        className="object-cover h-full lg:h-[200px] xl:h-[150px] lg:w-full w-full block rounded-tl-md"
                        src={booking?.detail_offer[0]?.image_room[0].image}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-around">
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full w-full block lg:hidden  xl:block rounded-bl-md"
                        src={booking?.detail_offer[0]?.image_room[1].image}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full  w-full">
                      <img
                        className="object-cover h-full w-full lg:hidden  xl:block block"
                        src={booking?.detail_offer[0]?.image_room[2].image}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full w-full lg:hidden  xl:block block"
                        src={booking?.detail_offer[0].image_room[3].image}
                        alt=""
                      />
                      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-2xl">
                  1 +
                </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3">
                <div className=" xl:w-2/3 pr-2 flex flex-col gap-5">
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
                      className="bg-green-400 px-3 rounded-full text-white xl:hidden"
                    >
                      {booking.bookingStatus}
                    </div>
                  </div>

                  <div
                    className=" flex md:items-center  gap-2"
                    onClick={() => openMapModal(index)}
                  >
                    <FaMapLocationDot className="text-red-700 text-2xl" />
                    <div className="flex flex-wrap text-sm gap-1">
                      <div>
                        {myBooking[index]?.homestay.location[0].house_no}
                      </div>
                      <div>
                        ม.{myBooking[index]?.homestay.location[0].village_no}
                      </div>
                      <div>
                        ต.
                        {
                          myBooking[index]?.homestay.location[0]
                            .subdistrict_location
                        }
                      </div>
                      <div>
                        อ.
                        {
                          myBooking[index]?.homestay.location[0]
                            .district_location
                        }
                      </div>
                      <div>
                        จ.
                        {
                          myBooking[index]?.homestay.location[0]
                            .province_location
                        }
                      </div>
                      <div>
                        {
                          myBooking[index]?.homestay.location[0]
                            .zipcode_location
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span>
                      {formatBookingDates(
                        myBooking[index]?.bookingStart,
                        myBooking[index]?.bookingEnd
                      )}
                    </span>
                  </div>
                  <div className="text-md">
                    <span className="flex items-center gap-2">
                      <div className="flex items-center">
                        <IoPeopleSharp /> {myBooking[0]?.detail_offer[0].adult}
                      </div>
                      <div className="flex items-center">
                        <LiaChildSolid />
                        {myBooking[index]?.detail_offer[0].child}
                      </div>
                      <div className="flex items-center">
                        <GoHome />
                        {myBooking[index]?.detail_offer[0].room}
                      </div>
                    </span>
                  </div>
                </div>
                <div className=" xl:w-1/3 flex flex-col justify-end items-end xl:border-l p-5">
                  <div
                    id="status2"
                    className="bg-green-400 px-3 rounded-full text-white hidden xl:block"
                  >
                    {booking.bookingStatus}
                  </div>
                  <div className="flex flex-col items-end text-xl my-5">
                    <span>ราคา</span>
                    <span className="font-bold text-red-500 ">
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
                  <div className="">
                    <button
                      className="bg-red-500 py-2 px-5 rounded-lg text-white hover:bg-red-600"
                      onClick={() => cancelBooking(myBooking[index]?._id)}
                    >
                      ยกเลิก
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

export default BookingHomeStay;
