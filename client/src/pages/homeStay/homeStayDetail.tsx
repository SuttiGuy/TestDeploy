import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OpenStreetMapShoData from "../../components/OpenStreetMapShowData";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar-data";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import { AuthContext } from "../../AuthContext/auth.provider";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import axios from "axios";
import { FaChildReaching } from "react-icons/fa6";
import { MdOutlineBathroom } from "react-icons/md";
import { FaStar, FaStarHalfAlt, FaRegStar, FaMale } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import { TbRuler3 } from "react-icons/tb";
import { LuBedSingle, LuBedDouble } from "react-icons/lu";
import { Facilities_Room, HomeStay, Offer, PaymentData, Review } from "../../type";


const homeStayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<HomeStay>();
  const [review, setReview] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const alertRef = useRef<HTMLDivElement | null>(null);
  const { setPaymentData, dataNav } = usePaymentContext();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userInfo?.role == "user") {
          const res = await axiosPrivateUser.get(`/homestay/${id}`);
          if (res.data) {
            setItem(res.data);
          }
        } else if (userInfo?.role == "business") {
          const res = await axiosPrivateBusiness.get(`/homestay/${id}`);
          if (res.data) {
            setItem(res.data);
          }
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงรายละเอียด homestay:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewsResponse = await axios.get<Review[]>("/review.json");
        if (reviewsResponse.data) {
          const filteredReviews = reviewsResponse.data.filter(
            (review) => review.homestay === id
          );

          setReview(filteredReviews);
        }
      } catch (reviewError) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:", reviewError);
      }
    };

    fetchReview();
  }, [id]);

  const images = item?.image.slice(1, 7).map((img: any, index: number) => {
    const specialClasses: { [key: number]: string } = {
      2: "rounded-tr-lg",
      5: "rounded-br-lg",
    };

    return (
      <div key={index} className="w-full h-full">
        <img
          className={`w-[250px] md:w-60 h-[100px] md:h-[140px] object-cover rounded-md ${
            specialClasses[index] || ""
          }`}
          src={img.image_upload}
          alt=""
        />
      </div>
    );
  });

  // ตรวจสอบว่า item.facilities ถูกกำหนดก่อนการ map
  const facilities = item?.facilities.map((facility: any, index: number) => (
    <div
      key={index}
      className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center text-sm md:text-md gap-4"
    >
      <div>✓</div>
      {facility.facilities_name}
    </div>
  ));

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const handleScrollToElement =
    (id: string) =>
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      event.preventDefault();
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    };

  // ฟังก์ชันคำนวณค่าเฉลี่ยของ rating
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return parseFloat(averageRating.toFixed(1));
  };

  // ฟังก์ชันคำนวณความก้าวหน้า (progress)
  const radialProgress = (rating: number): number => {
    if (rating) {
      return (rating * 100) / 5;
    }
    return 0;
  };

  useEffect(() => {
    if (review.length > 0) {
      const averageRating = calculateAverageRating(review);
      const progress = radialProgress(averageRating);
      setAverageRating(averageRating);
      setProgress(progress);
    }
  }, [review]);

  const reviews = review?.map((reviewHomeStay: Review, reviewIndex: number) => {
    // console.log(reviewHomeStay);
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    };

    return (
      <div
        key={reviewIndex}
        className="flex flex-wrap gap-4 my-5 shadow-boxShadow rounded-xl p-5"
      >
        <div className="w-full p-5 flex flex-wrap justify-between">
          <div className="flex gap-2 items-center text-xl">
            <div className="avatar">
              <div className="w-12 rounded-full object-cover">
                <img src={reviewHomeStay?.reviewer.image} />
              </div>
            </div>
            <div>{reviewHomeStay?.reviewer?.name}</div>
            <div className="bg-primaryUser rounded-2xl px-3 py-1 text-white">
              <div className="text-sm">{reviewHomeStay?.rating}/5</div>
            </div>
          </div>
          <div>
            <div>
              <div>{formatDate(reviewHomeStay?.createdAt)}</div>
            </div>
          </div>
        </div>
        <div className="w-full  rounded-lg">
          <div>{reviewHomeStay?.content}</div>
        </div>
      </div>
    );
  });

  const calculatePercentages = (review: Review[]) => {
    const totalReviews = review.length;
    const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 = 1 ดาว, Index 1 = 2 ดาว, etc.

    // นับจำนวนรีวิวสำหรับแต่ละดาว
    review.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    // คำนวณเปอร์เซ็นต์
    const percentages = ratingCounts.map(
      (count) => (count / totalReviews) * 100
    );

    return percentages;
  };
  // console.log(numRoom);
  const percentages = calculatePercentages(review);
  const roomTypes = item?.room_type || [];
  const [currentIndices, setCurrentIndices] = useState<number[]>(
    roomTypes.map(() => 0)
  );

  // ใช้ useEffect เพื่อตั้งค่า currentIndices เมื่อ roomTypes เปลี่ยนแปลง
  useEffect(() => {
    setCurrentIndices(roomTypes.map(() => 0));
  }, [roomTypes]);

  const handlePrev = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = roomTypes[i]?.image_room.length ?? 0;

        return i === index
          ? currentIndex === 0
            ? imageRoomLength - 1
            : currentIndex - 1
          : currentIndex;
      })
    );
  };

  const handleNext = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = roomTypes[i]?.image_room.length ?? 0;

        return i === index
          ? currentIndex === imageRoomLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex;
      })
    );
  };

  const carousel = roomTypes.map((roomType, index) => {
    const offer = roomType.offer.map((offer: Offer, i: number) => {
      const price = offer.price_homeStay;
      const discount = offer.discount;
      const totalPrice =
        discount > 0 ? price * ((100 - discount) / 100) : price;
      const facilitiesRoom = offer?.facilitiesRoom.map(
        (facility: Facilities_Room, index: number) => {
          return (
            <div key={index} className="flex items-center gap-4">
              <div>✓</div>
              {facility.facilitiesName}
            </div>
          );
        }
      );

      const handleSelectAndProceed = () => {
        if (
          dataNav &&
          dataNav.numPeople !== undefined &&
          dataNav.numRoom !== undefined
        ) {
          if (
            dataNav.numPeople >= 1 &&
            dataNav.numRoom >= 1 &&
            dataNav.dateRange.endDate !== "Not selected" &&
            dataNav.dateRange.startDate !== "Not selected"
          ) {
            // ทำบางสิ่งที่ต้องการ
            if (item && userInfo && id) {
              // Set payment data
              const roomTypeIndex =
                Array.isArray(item.room_type) && item.room_type.length > 0
                  ? i < item.room_type.length
                    ? i
                    : 0
                  : 0;
              const paymentData: PaymentData = {
                homeStayId: id,
                homeStayName: item.name_homeStay,
                totalPrice: totalPrice,
                pricePerRoom: price,
                location: item?.location,
                roomType: item.room_type[roomTypeIndex],
                offer: roomType.offer[i],
                bookingUser: userInfo,
                rating: averageRating,
                time_checkIn_homeStay: item.time_checkIn_homeStay,
                time_checkOut_homeStay: item.time_checkOut_homeStay,
                policy_cancel_homeStay: item.policy_cancel_homeStay,
              };

              localStorage.setItem("paymentData", JSON.stringify(paymentData));

              setPaymentData(paymentData);
              navigate("/bookingDetail");
            }
          } else {
            setShowAlert(true);
            // เลื่อนหน้าไปยังตำแหน่งของ alert
            if (alertRef.current) {
              alertRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      };

      return (
        <div key={i}>
          <div className="shadow-boxShadow flex rounded-lg px-5 py-10">
            <div className="w-2/6 border-r text-sm">{facilitiesRoom}</div>
            {roomType.offer[i].max_people.child > 0 &&
            roomType.offer[i].max_people.adult > 0 &&
            roomType.offer[i].max_people.adult < 2 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" />
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : roomType.offer[i].max_people.child > 0 &&
              roomType.offer[i].max_people.adult > 1 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" /> <FaMale className="text-xl" />{" "}
                  <FaChildReaching className="text-md" />
                </div>
              </div>
            ) : roomType.offer[i].max_people.child <= 0 &&
              roomType.offer[i].max_people.adult > 1 ? (
              <div className="w-1/6 border-r">
                <div className="flex justify-center items-end">
                  <FaMale className="text-xl" /> <FaMale className="text-xl" />
                </div>
              </div>
            ) : (
              <div className="w-1/6 flex justify-center border-r">
                <FaMale className="text-xl" />
              </div>
            )}

            <div className="w-2/6 flex flex-col justify-end border-r p-2">
              {offer.discount <= 0 ? (
                <p className="flex justify-end font-bold text-alert text-3xl">
                  {totalPrice} บาท
                </p>
              ) : (
                <div>
                  <div className=" text-white w-full md:w-[100px] rounded-xl flex justify-center item-center bg-alert text-sm">
                    SALE! ลด {offer.discount} %
                  </div>
                  <p className="flex justify-end text-sm ">
                    <del>{offer.price_homeStay}</del> บาท
                  </p>
                  <p className="flex justify-end font-bold text-alert text-3xl">
                    {totalPrice} บาท
                  </p>
                </div>
              )}

              <p className="flex justify-end text-xs">ราคาต่อคืน</p>
              <p className="flex justify-end text-xs">
                (ก่อนรวมภาษีและค่าธรรมเนียม)
              </p>
            </div>
            {userInfo?.role == "user" && (
              <div className="w-1/6 flex flex-col items-center pl-3">
                <button
                  className=" bg-primaryUser shadow-boxShadow px-8 lg:px-6 lg:ml-4 h-10 rounded-3xl hover:scale-110 
                transition-transform duration-300 text-white"
                  onClick={() => handleSelectAndProceed()}
                >
                  จอง
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });

    return (
      <div key={index} className="mb-8 relative">
        <h2 className="text-xl font-bold mb-4">{roomType.name_type_room}</h2>
        <div className="flex flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap shadow-boxShadow p-5 gap-2 rounded-lg">
          <div className="w-full md:full lg:w-1/3">
            <div
              id={`carousel-${index}`}
              className="relative w-full shadow-boxShadow rounded-xl"
              data-carousel="slide"
            >
              <div className="relative h-60 rounded-lg">
                {roomType.image_room.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`duration-700 ease-in-out ${
                      currentIndices[index] === imageIndex ? "block" : "hidden"
                    }`}
                    data-carousel-item
                  >
                    <img
                      src={image.image}
                      className="absolute block w-full h-full object-cover rounded-xl"
                      alt={`Slide ${imageIndex + 1}`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                  onClick={() => handlePrev(index)}
                  data-carousel-prev
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                      className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 1 1 5l4 4"
                      />
                    </svg>
                    <span className="sr-only">Previous</span>
                  </span>
                </button>
                <button
                  type="button"
                  className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                  onClick={() => handleNext(index)}
                  data-carousel-next
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg
                      className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <span className="sr-only">Next</span>
                  </span>
                </button>
              </div>
            </div>
            <div className="my-5">
              <div className="flex items-center gap-2">
                <MdOutlineBathroom className="text-xl" />
                {roomTypes[index].bathroom_homeStay} ห้อง
              </div>
              <div className="flex items-center gap-2">
                {roomTypes[index].bedroom_homeStay < 2 ? (
                  <LuBedSingle className="text-xl" />
                ) : (
                  <LuBedDouble className="text-xl" />
                )}
                {roomTypes[index].bedroom_homeStay} เตียง
              </div>
              <div className="flex items-center gap-2">
                <TbRuler3 className="text-xl" />
                {roomTypes[index].sizeBedroom_homeStay}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:full lg:w-2/3">
            {offer}
          </div>
        </div>
      </div>
    );
  });
  console.log(userInfo?.role);

  return (
    <div>
      {item ? (
        <div>
          <div
            id="homeStayDetail"
            ref={alertRef}
            className="container-xl mx-6 md:mx-8 lg:mx-24 xl:mx-40"
          >
            <div className="mt-5 ">
              {userInfo?.role == "user" && <Navbar />}
              <div className="mt-2  flex  justify-end">
                {showAlert && (
                  <div className="alert alert-error text-white w-1/3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 shrink-0 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>เงื่อนไขไม่ผ่าน กรุณาใส่ข้อมูลให้ครบ</span>
                  </div>
                )}
              </div>
            </div>
            {/* รูปภาพ */}
            <div className="flex justify-center gap-4 mt-10 mb-5 ">
              <div>
                <img
                  className="w-[400px] md:w-[600px] h-[220px] md:h-[300px]  object-cover rounded-lg"
                  src={item?.image[0].image_upload}
                  alt=""
                />
              </div>
              <div className="grid grid-cols-3 gap-4 ">{images}</div>
            </div>

            <div className="sticky z-10 top-0 bg-white flex shadow-boxShadow rounded-lg w-full mb-5 p-5">
              <div className="flex items-center gap-4 w-full">
                <a
                  id="buttonHomeStayDetail"
                  href="homeStayDetail"
                  className="text-decoration text-md "
                  onClick={handleScrollToElement("homeStayDetail")}
                >
                  รายละเอียดที่พัก
                </a>
                <a
                  id="buttonFacilities"
                  href="facilities"
                  className="text-decoration"
                  onClick={handleScrollToElement("facilities")}
                >
                  สิ่งอำนวยความสะดวก
                </a>
                <a
                  id="buttonDetailRoom"
                  href="detailRoom"
                  className="text-decoration"
                  onClick={handleScrollToElement("detailRoom")}
                >
                  ห้องพัก
                </a>
                <a
                  id="buttonReview"
                  href="review"
                  className="text-decoration"
                  onClick={handleScrollToElement("review")}
                >
                  รีวิว
                </a>
              </div>
            </div>

            {/* homeStay Detail */}
            <div className="flex flex-row flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap mb-10 gap-4">
              {/* Left Column */}
              <div className="flex flex-col w-full md:w-full lg:w-3/4 xl:w-3/4">
                <div className="rounded-lg shadow-boxShadow p-10 mb-5">
                  <div className="flex items-center">
                    <div className="flex items-center flex-wrap gap-4">
                      <div id="homeStayName" className="font-bold text-xl">
                        {item.name_homeStay}
                      </div>
                      {/* ดาว */}
                      <div className="flex items-center font-bold mb-2 text-primaryUser">
                        {renderStars(averageRating)}
                        <div className="flex gap-2 mx-2">
                          <div>{averageRating}</div>
                          <div className="flex gap-1">
                            <div>{review.length} </div>
                            <div>รีวิว</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-2">{item.detail_homeStay}</div>
                  </div>
                </div>
                {/* Facilities */}
                <div
                  id="facilities"
                  className="rounded-lg shadow-boxShadow p-10 mb-5"
                >
                  <h1 className="font-bold text-xl mb-5">สิ่งอำนวยความสะดวก</h1>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {facilities}
                  </div>
                </div>
              </div>

              {/* Maps */}
              <div
                id="maps"
                className="flex flex-col w-full md:w-full lg:w-1/4 xl:w-1/4"
              >
                <div className="shadow-boxShadow rounded-lg">
                  <OpenStreetMapShoData
                    lat={item?.location[0].latitude_location}
                    lng={item?.location[0].longitude_location}
                  />
                </div>
              </div>
            </div>

            {/* ส่วนการ์ดประเภทห้อง */}
            <div id="detailTypeRoom" className="mb-5">
              <h1 id="detailRoom" className="font-bold text-3xl">
                ประเภทห้อง
              </h1>
              <h1 className="text-lg mb-5">
                ห้องพัก {item?.room_type.length} ประเภท | มี{" "}
                {item.room_type.reduce(
                  (total, room) => total + room.offer.length,
                  0
                )}{" "}
                ข้อเสนอ
              </h1>
              <div>
                <div>{carousel}</div>
              </div>
            </div>
            {/* policy */}
            <div id="policy" className=" my-10">
              <div className="text-2xl font-bold my-5">
                นโยบายที่พักและข้อมูลทั่วไปของ - {item.name_homeStay}
              </div>
              <div className="w-full rounded-lg shadow-boxShadow p-5">
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold">
                    <IoMdTime /> เช็คอิน/เช็คเอ้า
                  </div>
                  <div className="ml-10">
                    <div>เช็คอินตั้งแต่ : {item.time_checkIn_homeStay} น.</div>
                    <div>เช็คเอ้าก่อน : {item.time_checkOut_homeStay} น.</div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-bold mt-5">
                    <MdOutlinePolicy />
                    นโยบาย
                  </div>
                  <div className="ml-10">{item.policy_cancel_homeStay}</div>
                </div>
              </div>
            </div>

            {/* review */}
            <div>
              <div id="review" className="text-2xl font-bold mb-5">
                รีวิวจากผู้เข้าพักจริง - {item.name_homeStay}
              </div>
              <div id="review" className="shadow-boxShadow rounded-lg p-10">
                <div className="text-xl"> คะแนนรีวิวโดยรวม</div>
                <div>
                  <div className="flex  flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap gap-10 justify-around items-center p-10">
                    <div
                      className="radial-progress text-primaryUser text-5xl font-bold"
                      style={
                        {
                          "--value": `${progress}`,
                          "--size": "12rem",
                          "--thickness": "2rem",
                        } as React.CSSProperties
                      }
                      role="progressbar"
                    >
                      {averageRating}
                    </div>
                    <div className="flex flex-row items-center gap-10">
                      <div className="flex flex-col-reverse">
                        {percentages.map((percentage, index) => (
                          <div key={index}>
                            <div>{`${index + 1} ดาว`}</div>
                            <progress
                              className="progress progress-info w-[15rem] md:w-[500px] lg:w-[400px] xl:w-[500px] h-5"
                              value={percentage}
                              max="100"
                            ></progress>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Review */}
                {reviews}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingTravel />
      )}
    </div>
  );
};

export default homeStayDetail;
