import { useEffect, useState } from "react";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext/auth.provider";
import { FaMapLocationDot } from "react-icons/fa6";

const BookingPackage = () => {
  const [myBookingPackage, setMyBookingPackage] = useState<any[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivateUser(
          `/booking-confirm/${userInfo?._id}`
        );

        if (response.data) {
          // กรองข้อมูลที่มี packageId
          const bookingsWithPackage = response.data.filter(
            (booking: any) => booking.package
          );

          setMyBookingPackage(bookingsWithPackage);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userInfo?._id, status]);

  if (!myBookingPackage) {
    return <div>no my booking</div>;
  }
  //   console.log(myBookingPackage[0].package.image[0].image_upload);

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
  console.log(myBookingPackage);

  const images = myBookingPackage?.map((item: any, index: number) => {
    const imageItem = item?.package.image.map((image: any, i: number) => {
      return (
        <div key={i} className="relative group">
          <img
            className="w-[600px] h-[400px] object-cover transform transition duration-300 hover:scale-105 hover:shadow-lg rounded-md"
            src={image?.image_upload}
            alt=""
            onClick={() => setOpenModalIndex(index)} // เปิด modal ตาม index
          />
        </div>
      );
    });

    return (
      <div key={index}>
        <dialog
          id={`imageBooking-${index}`}
          className={`modal ${openModalIndex === index ? "modal-open" : ""}`} // เช็คว่า modal นี้เปิดอยู่หรือไม่
          open={openModalIndex === index} // ควบคุมการเปิดปิด modal
        >
          <div className="modal-box w-12/12 max-w-7xl p-10">
            <h3 className="font-bold text-lg mb-5">รูปภาพ</h3>
            <div className="grid grid-cols-2 gap-5">{imageItem}</div>
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

  const cancelBooking = (id: string) => {
    try {
      Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        text: "คุณต้องการยกเลิกการจองแพ็คเกจนี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ยกเลิกเลย!",
        cancelButtonText: "ไม่ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosPrivateUser.put(`/cancelBooking/${id}`);
          if (status == true) {
            setStatus(false);
          } else {
            setStatus(true);
          }
          Swal.fire({
            title: "ยกเลิกแล้ว!",
            text: "การจองแพ็คเกจของคุณถูกยกเลิกเรียบร้อยแล้ว.",
            icon: "success",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {images}
      {myBookingPackage.length > 0 ? (
        myBookingPackage?.map((booking, index) => (
          <div className="px-0 xl:px-10">
            <div
              key={index}
              className="w-full my-5 shadow-boxShadow rounded-lg flex gap-2 flex-wrap xl:flex-nowrap"
            >
              <div
                className="w-full lg:h-full xl:w-1/3 rounded-l-lg "
                onClick={() => openModal(`imageBooking-${index}`)}
              >
                <div className="rounded-tl-lg w-full lg:h-[120px] xl:h-[150px]">
                  <div className="overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full lg:h-[200px] xl:h-[150px] lg:w-full w-full block rounded-tl-md"
                        src={booking?.package.image[0].image_upload}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-around">
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full w-full block lg:hidden xl:block rounded-bl-md"
                        src={booking?.package.image[1].image_upload}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full w-full lg:hidden xl:block block"
                        src={booking?.package.image[2].image_upload}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="w-1/3 h-[80px] overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        className="object-cover h-full w-full lg:hidden  xl:block block"
                        src={booking?.package.image[3].image_upload}
                        alt=""
                      />
                      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-2xl">
                  1 +
                </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3  ">
                <div className=" xl:w-2/3 pr-2 flex flex-col gap-5">
                  <div className="flex justify-between ">
                    <span className="text-lg font-bold ">
                      {booking?.package.name_package}
                    </span>
                    <div className="bg-green-400 px-3 rounded-full text-white hidden xl:hidden">
                      {booking.bookingStatus}
                    </div>
                  </div>
                  <div
                    className=" flex items-center gap-2"
                    //   onClick={() => openModal("maps")}
                  >
                    <FaMapLocationDot className="text-red-700" />
                    <div className="flex text-sm gap-1">
                      {/* <div>{myBookingPackage[0]?.package.location[0].house_no}</div> */}
                      {/* <div>ม.{myBookingPackage[0]?.package.location[0].village_no}</div> */}
                      <div>
                        ต.
                        {
                          myBookingPackage[0]?.package.location[0]
                            .subdistrict_location
                        }
                      </div>
                      <div>
                        อ.
                        {
                          myBookingPackage[0]?.package.location[0]
                            .district_location
                        }
                      </div>
                      <div>
                        จ.
                        {
                          myBookingPackage[0]?.package.location[0]
                            .province_location
                        }
                      </div>
                      <div>
                        {
                          myBookingPackage[0]?.package.location[0]
                            .zipcode_location
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span>
                      {formatBookingDates(
                        myBookingPackage[index]?.bookingStart,
                        myBookingPackage[index]?.bookingEnd
                      )}
                    </span>
                  </div>
                </div>
                <div className="xl:w-1/3 flex flex-col justify-end items-end xl:border-l p-5">
                  <div className="bg-green-400 px-3 rounded-full text-white hidden xl:block">
                    {booking.bookingStatus}
                  </div>
                  <div className="flex flex-col items-end text-xl my-5">
                    <span>ราคา</span>
                    <span className="font-bold text-red-500">
                      ฿{" "}
                      {booking?.package.price_package.toLocaleString("th-TH", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                      })}{" "}
                    </span>
                  </div>
                  <div className="">
                    <button
                      className="bg-red-500 py-2 px-5 rounded-lg text-white hover:bg-red-600"
                      onClick={() =>
                        cancelBooking(myBookingPackage[index]?._id)
                      }
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
          <span className="loading loading-infinity loading-lg"></span>
          <span className="text-2xl flex items-center gap-5">
            {/* <TbMapQuestion /> */}
            ไม่พบประวัติการจองแพ็กเกจ
          </span>
        </div>
      )}
    </div>
  );
};

export default BookingPackage;
