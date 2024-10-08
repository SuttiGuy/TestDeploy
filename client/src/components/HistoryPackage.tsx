import { useEffect, useState } from "react";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/auth.provider";
import OpenStreetMapShowData from "../components/OpenStreetMapShowData";
import { FaMapLocationDot } from "react-icons/fa6";
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

export interface HomeStay {
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
  booker: Booker;
  bookingStart: string;
  bookingEnd: string;
  bookingStatus: string;
  detail_offer: DetailOffer[];
  package: HomeStay;
  night: number;
}

export interface reviewData {
  reviewer: string | undefined;
  rating: number;
  content: string;
  packageId: string | null;
  homestay: string | null;
}

const HistoryPackage = () => {
  const [myBookingPackage, setMyBookingPackage] = useState<any[]>([]);
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
  }, [userInfo?._id]);

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
  const handleSubmit = (selectedBookingIndex: number) => {
    const reviewer = userInfo?._id;
    const reviewData = {
      reviewer,
      rating,
      content,
      packageId: myBookingPackage[selectedBookingIndex]?.package
        ? myBookingPackage[selectedBookingIndex]?.package._id
        : null,
      homestay: myBookingPackage[selectedBookingIndex]?.homestay
        ? myBookingPackage[selectedBookingIndex].homestay._id
        : null,
    };
    console.log(reviewData);

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
                      myBookingPackage[selectedBookingIndex]?.package
                        .location[0].latitude_location
                    }
                    lng={
                      myBookingPackage[selectedBookingIndex]?.package
                        .location[0].longitude_location
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
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="review" open={isReviewModalOpen} className="modal">
              <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">เขียนรีวิว</h3>
                <div className="py-4">
                  <div className="flex flex-col gap-5 w-full shadow-boxShadow rounded-lg p-10">
                    <div className="flex flex-row justify-between w-full">
                      <div className="xl:w-2/3 pr-2 flex flex-col gap-5">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold">
                            {
                              myBookingPackage[selectedBookingIndex]?.package
                                .name_package
                            }
                          </span>
                          <div className="bg-green-400 px-3 rounded-full text-white xl:hidden">
                            {
                              myBookingPackage[selectedBookingIndex].bookingStatus
                            }
                          </div>
                        </div>

                        <div className="flex md:items-center gap-2">
                          <FaMapLocationDot className="text-red-700 text-2xl" />
                          <div className="flex flex-wrap text-sm gap-1">
                            <div>
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].house_no
                              }
                            </div>
                            <div>
                              ม.
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].village_no
                              }
                            </div>
                            <div>
                              ต.
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].subdistrict_location
                              }
                            </div>
                            <div>
                              อ.
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].district_location
                              }
                            </div>
                            <div>
                              จ.
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].province_location
                              }
                            </div>
                            <div>
                              {
                                myBookingPackage[selectedBookingIndex]?.package
                                  .location[0].zipcode_location
                              }
                            </div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span>
                            {formatBookingDates(
                              myBookingPackage[selectedBookingIndex]
                                ?.bookingStart,
                              myBookingPackage[selectedBookingIndex]?.bookingEnd
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
                </div>
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
                    <div className="bg-green-400 px-3 rounded-full text-white block xl:hidden">
                      {booking.bookingStatus}
                    </div>
                  </div>
                  <div
                    className=" flex items-center gap-2"
                    onClick={() => openMapModal(index)}
                  >
                    <FaMapLocationDot className="text-red-700" />
                    <div className="flex text-sm gap-1">
                      {/* <div>{myBookingPackage[0]?.package.location[0].house_no}</div> */}
                      {/* <div>ม.{myBookingPackage[0]?.package.location[0].village_no}</div> */}
                      <div>
                        ต.
                        {
                          myBookingPackage[index]?.package.location[0]
                            .subdistrict_location
                        }
                      </div>
                      <div>
                        อ.
                        {
                          myBookingPackage[index]?.package.location[0]
                            .district_location
                        }
                      </div>
                      <div>
                        จ.
                        {
                          myBookingPackage[index]?.package.location[0]
                            .province_location
                        }
                      </div>
                      <div>
                        {
                          myBookingPackage[index]?.package.location[0]
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
          <span className="loading loading-infinity loading-lg"></span>
          <span className="text-2xl flex items-center gap-5">
            ไม่พบประวัติการจองแพ็กเกจ
          </span>
        </div>
      )}
    </div>
  );
};

export default HistoryPackage;
