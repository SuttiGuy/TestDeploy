import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/auth.provider";
import { FaMapLocationDot } from "react-icons/fa6";
import OpenStreetMapShowData from "../components/OpenStreetMapShowData";
import { TbMapQuestion } from "react-icons/tb";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import { GoHome } from "react-icons/go";
import { LiaChildSolid } from "react-icons/lia";
import { IoPeopleSharp } from "react-icons/io5";

export interface Booker {
  _id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  room: number;
  discount: number;
  totalPrice: number;
  image_room: {
    image: string;
  }[];
}
export interface Image_room {
  image: string;
}
export interface Facilities_Room {
  facilitiesName: string;
}

export interface Offer {
  price_homeStay: number;
  max_people: {
    adult: number;
    child: number;
  };
  discount: number;
  facilitiesRoom: Facilities_Room[];
  roomCount: number;
  quantityRoom: number;
}
export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

export interface Facility {
  _id: string;
  facilities_name: string;
}
export interface Image {
  _id: string;
  image: string;
}
interface Location {
  name_location: string;
  province_location: string;
  house_no: string;
  village?: string; // Optional property
  village_no: string;
  alley?: string; // Optional property
  street?: string; // Optional property
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: number;
  longitude_location: number;
  radius_location: number;
}

export interface ActivityDays {
  activity_name: string;
}
export interface ActivityPackage {
  activity_days: ActivityDays[];
}

export interface IPackage {
  _id: string; // ObjectId ของ package จาก MongoDB
  name_package: string;
  type_package: string;
  max_people: number;
  detail_package: string;
  activity_package: ActivityPackage[];
  time_start_package: Date;
  time_end_package: Date;
  policy_cancel_package: string;
  location: Location[];
  image: Image[];
  price_package: number;
  homestay?: string; // ObjectId ของ Homestay (optional field)
  business_user: string; // ObjectId ของ business_user
  review_rating_package: number;
}

export interface HomeStay {
  _id: string; // ObjectId ของ package จาก MongoDB
  name_homeStay: string;
  room_type: RoomType[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: Location[];
  image: Image[];
  business_user: string[]; // Assuming you use ObjectId as string
  review_rating_homeStay: number;
  facilities: Facility[];
  status_sell_homeStay: boolean;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  _id: string;
  booker: Booker;
  bookingStart: string;
  bookingEnd: string;
  bookingStatus: string;
  detail_offer: DetailOffer[];
  homestay: HomeStay;
  package: IPackage;
  night: number;
}
export interface reviewData {
  reviewer: string | undefined;
  rating: number;
  content: string;
  packageId: string | null;
  homestay: string | null;
}

const HistoryHomeStay = () => {
  const [myBooking, setMyBooking] = useState<Booking[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [rating, setRating] = useState(4); // เก็บค่าคะแนนจากการกดดาว
  const [content, setContent] = useState(""); // เก็บข้อความรีวิว
  const [selectedBookingIndex, setSelectedBookingIndex] = useState<
    number | null
  >(null);
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivateUser(
          `/booking-check-in/${userInfo?._id}`
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

    fetchData();
  }, [userInfo?._id]);

  console.log(myBooking);

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

  const openMapModal = (index: number) => {
    setSelectedBookingIndex(index);
    setIsMapModalOpen(true);
  };
  const openReviewModal = (index: number) => {
    setSelectedBookingIndex(index);
    setIsReviewModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
    setSelectedBookingIndex(null);
  };
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedBookingIndex(null);
  };
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  // console.log(myBookingPackage[0]?.package._id);

  const handleSubmit = (selectedBookingIndex: number) => {
    const reviewer = userInfo?._id;
    const reviewData = {
      reviewer,
      rating,
      content,
      packageId: myBooking[selectedBookingIndex]?.package
        ? myBooking[selectedBookingIndex]?.package._id
        : null,
      homestay: myBooking[selectedBookingIndex]?.homestay
        ? myBooking[selectedBookingIndex].homestay._id
        : null,
    };
    submitReview(reviewData); // ฟังก์ชันสำหรับส่งข้อมูลรีวิว
    closeReviewModal(); // ปิด modal หลังจากส่งข้อมูล
  };
  const submitReview = async (reviewData: reviewData) => {
    try {
      await axiosPrivateUser.post(
        "/review/createReview",
        reviewData
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-50">
        {isMapModalOpen && selectedBookingIndex !== null && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
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
          </>
        )}
        {isReviewModalOpen && selectedBookingIndex !== null && (
          <>
            {/* Backdrop พื้นหลังมืด */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

            {/* Modal */}
            <dialog id="review" open={isReviewModalOpen} className="modal z-50">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">เขียนรีวิว</h3>
                <p className="py-4">
                  <div className="flex flex-col gap-5 w-full b shadow-boxShadow rounded-lg p-10">
                    <div className="flex flex-row justify-between w-full">
                      <div className=" xl:w-2/3 pr-2 flex flex-col gap-5">
                        <div className="flex justify-between ">
                          <span className="text-lg font-bold ">
                            {
                              myBooking[selectedBookingIndex]?.detail_offer[0]
                                .name_type_room
                            }
                          </span>
                          <div className="bg-green-400 px-3 rounded-full text-white xl:hidden">
                            {myBooking[selectedBookingIndex].bookingStatus}
                          </div>
                        </div>

                        <div className=" flex md:items-center gap-2">
                          <FaMapLocationDot className="text-red-700 text-2xl" />
                          <div className="flex flex-wrap text-sm gap-1">
                            <div>
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].house_no
                              }
                            </div>
                            <div>
                              ม.
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].village_no
                              }
                            </div>
                            <div>
                              ต.
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].subdistrict_location
                              }
                            </div>
                            <div>
                              อ.
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].district_location
                              }
                            </div>
                            <div>
                              จ.
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].province_location
                              }
                            </div>
                            <div>
                              {
                                myBooking[selectedBookingIndex]?.homestay
                                  .location[0].zipcode_location
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span>
                            {formatBookingDates(
                              myBooking[selectedBookingIndex]?.bookingStart,
                              myBooking[selectedBookingIndex]?.bookingEnd
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="rating">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <input
                            key={value}
                            type="radio"
                            name="rating-2"
                            className="mask mask-star-2 bg-primaryUser"
                            onClick={() => handleRatingChange(value)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full shadow-boxShadow rounded-lg">
                      <textarea
                        className="textarea w-full bg-white"
                        placeholder="เขียนรีวิว"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </p>
                <div className="modal-action">
                  <button
                    onClick={() => handleSubmit(selectedBookingIndex)}
                    className=" bg-green-500 text-white px-5 py-2 hover:bg-green-700 rounded-full w-[100px]"
                  >
                    รีวิว
                  </button>
                  <button
                    onClick={closeReviewModal}
                    className=" bg-red-500 text-white px-5 py-2 hover:bg-red-700 rounded-full w-[100px]"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </dialog>
          </>
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
                    <div className="bg-green-400 px-3 rounded-full flex items-center text-white xl:hidden">
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
                        <IoPeopleSharp /> {myBooking[index]?.detail_offer[0].adult}
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
                  <div className="bg-green-400 px-3 rounded-full text-white hidden xl:block">
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
                  <div>
                    <button
                      className="bg-primaryBusiness py-2 px-5 rounded-lg text-white hover:bg-primaryNoRole"
                      onClick={() => openReviewModal(index)}
                    >
                      เขียนรีวิว
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

export default HistoryHomeStay;
