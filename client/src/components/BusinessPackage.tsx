import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/auth.provider";
import axiosPrivateBusiness from "../hook/axiosPrivateBusiness";
// import Loader from "../assets/loadingAPI/loaddingTravel";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { GoProjectSymlink, GoShieldCheck } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { MdAddHomeWork } from "react-icons/md";
import {
  FaRegCalendarCheck,
  FaRegEdit,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { LuActivity } from "react-icons/lu";
import Swal from "sweetalert2";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Activity, IPackage } from "../type";

const BusinessPackage = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
  const [myPackage, setMyPackage] = useState<IPackage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const fetchData = async () => {
    try {
      const response = await axiosPrivateBusiness.get(
        `/business-package/${userInfo?._id}`
      );
      if (response.data) {
        setMyPackage(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [currentIndices, setCurrentIndices] = useState<number[]>(
    myPackage.map(() => 0)
  );

  // ใช้ useEffect เพื่อตั้งค่า currentIndices เมื่อ myPackage เปลี่ยนแปลง
  useEffect(() => {
    setCurrentIndices(myPackage.map(() => 0));
  }, [myPackage]);

  const handlePrev = (index: number) => {
    setCurrentIndices((prevIndices) =>
      prevIndices.map((currentIndex, i) => {
        const imageRoomLength = myPackage[i]?.image.length ?? 0;

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
        const imageRoomLength = myPackage[i]?.image.length ?? 0;

        return i === index
          ? currentIndex === imageRoomLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex;
      })
    );
  };

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
  const formatThaiDate = (date: Date): string => {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const deletePackage = async (index: number) => {
    Swal.fire({
      title: "ยืนยันการลบแพ็กเกจ?",
      text: "คุณไม่สามารถย้อนกลับได้หลังจากลบ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ทำการลบแพ็กเกจ
          const delData = await axiosPrivateBusiness.delete(
            `/package/${myPackage[index]?._id}`
          );

          // เช็คสถานะการลบ
          if (delData.status === 200) {
            await fetchData();
            Swal.fire({
              title: "ถูกลบแล้ว!",
              text: "แพ็กเกจของคุณได้ถูกลบเรียบร้อยแล้ว.",
              icon: "success",
            });
            // อาจจะมีการอัปเดต state หรือรีเฟรชข้อมูลที่นี่
          }
        } catch (error) {
          console.error("Error deleting package:", error);
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถลบแพ็กเกจได้, กรุณาลองใหม่อีกครั้ง.",
            icon: "error",
          });
        }
      }
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myPackage.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      {myPackage?.length > 0 ? (
        <div>
          {currentItems?.map((item: any, index) => (
            <div key={index} className="px-0 xl:px-10">
              <div className="w-full my-5 shadow-boxShadow rounded-xl flex gap-2 flex-wrap xl:flex-nowrap">
                <div className="w-full lg:h-full xl:w-1/3 rounded-l-lg ">
                  <div
                    id={`carousel-${index}`}
                    className="relative w-full shadow-boxShadow rounded-xl"
                    data-carousel="slide"
                  >
                    <div className="relative h-60 rounded-lg">
                      {item.image.map((image: any, imageIndex: number) => (
                        <div
                          key={imageIndex}
                          className={`duration-700 ease-in-out ${
                            currentIndices[index] === imageIndex
                              ? "block"
                              : "hidden"
                          }`}
                          data-carousel-item
                        >
                          <img
                            src={image.image_upload}
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
                </div>
                <div className="pl-10 pt-5 md:pr-5 xl:p-2 flex flex-col xl:flex-row w-full xl:w-2/3">
                  <div className=" xl:w-4/6 pr-2 flex flex-col gap-5">
                    <div className="flex h-full ">
                      <div className="flex flex-col w-full gap-2">
                        <span className="text-md font-bold flex items-start justify-between w-full gap-3">
                          {item?.name_package}
                          <div className="flex items-center text-yellow-300">
                            {renderStars(item?.review_rating_package)}
                            {item?.review_rating_package}
                          </div>
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center gap-2">
                            <FaRegCalendarCheck className="text-lg" />
                            {formatThaiDate(item?.time_start_package)} ถึง{" "}
                            {formatThaiDate(item?.time_end_package)}
                          </span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <div className="pt-1">
                            <LuActivity />
                          </div>
                          <div>
                            {item?.activity_package.map(
                              (day: Activity, i: number) => {
                                const activityIndex =
                                  item?.activity_package[i].activity_days
                                    .length;
                                const activity = day.activity_days.map(
                                  (activity: any, index: number) => {
                                    return (
                                      <div key={index} className="flex gap-2">
                                        <span>{activity.activity_name}</span>
                                        {activityIndex == index + 1 ? (
                                          <div></div>
                                        ) : (
                                          <span>,</span>
                                        )}
                                      </div>
                                    );
                                  }
                                );

                                return (
                                  <div key={i}>
                                    <div className="flex gap-2">
                                      <span>วันที่ {i + 1})</span>
                                      {activity}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        <div
                          id="location"
                          className=" flex md:items-center  gap-2"
                        >
                          <FaLocationDot className="text-red-600" />
                          <div className="flex flex-wrap text-sm gap-1">
                            <div>{item.location[0].house_no}</div>
                            <div>ม.{item.location[0].village_no}</div>
                            <div>
                              ต.
                              {item.location[0].subdistrict_location}
                            </div>
                            <div>
                              อ.
                              {item.location[0].district_location}
                            </div>
                            <div>
                              จ.
                              {item.location[0].province_location}
                            </div>
                            <div>{item.location[0].zipcode_location}</div>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm flex items-center gap-3">
                            <div>
                              <GoShieldCheck className="text-lg" />
                            </div>
                            {item?.policy_cancel_package}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="xl:w-2/6 flex flex-col w-full xl:border-l p-1">
                    <div className="flex flex-col justify-between h-full w-full gap-2">
                      <div className="w-full flex flex-col items-end justify-end">
                        {new Date() < new Date(item?.time_start_package) ? (
                          <div className="text-sm bg-green-400 px-2 rounded-xl text-white">
                            ยังไม่พร้อมให้จอง
                          </div>
                        ) : new Date() > new Date(item?.time_end_package) ? (
                          <div className="text-sm bg-red-600 px-2 rounded-xl text-white">
                            แพ็กเกจหมดเขตแล้ว
                          </div>
                        ) : (
                          <div className="text-sm bg-green-400 px-2 rounded-xl text-white">
                            พร้อมให้จอง
                          </div>
                        )}

                        <div>
                          <button className="p-2">
                            <FaRegEdit className="text-xl hover:text-yellow-400" />
                          </button>
                          <button className="p-2">
                            <Link to={`/packageDetail/${item?._id}`}>
                              <GoProjectSymlink className="text-xl  hover:text-blue-500" />
                            </Link>
                          </button>
                          <button
                            onClick={() => deletePackage(index)}
                            className="p-2"
                          >
                            <IoTrashBinOutline className="text-xl  hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full text-xs flex justify-end opacity-50">
                        {item?.updatedAt ? (
                          <span>
                            อัปเดตเมื่อ {formatThaiDate(item?.updatedAt)}
                          </span>
                        ) : item?.createdAt ? (
                          <span>
                            สร้างเมื่อ {formatThaiDate(item?.createdAt)}
                          </span>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="w-full flex items-center justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={` px-3 py-3 rounded-xl mr-2 text-white ${
                currentPage === 1 ? "bg-gray-300 " : "bg-primaryBusiness"
              }`}
            >
              <GrPrevious />
            </button>
            {/* Pagination Buttons */}
            <div className="flex justify-center">
              {Array.from(
                { length: Math.ceil(myPackage.length / itemsPerPage) },
                (_, i) => (
                  <button
                    className={`transition-transform duration-300 ease-in-out transform hover:scale-110 px-3 py-2 m-0.5 rounded-md ${
                      currentPage === i + 1
                        ? "bg-primaryBusiness text-white"
                        : "bg-gray-300"
                    }`} // เปลี่ยนสีปุ่มเมื่อเลือกหน้า
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(myPackage.length / itemsPerPage)
              }
              className={` px-3 py-3 rounded-xl ml-2 text-white ${
                currentPage === Math.ceil(myPackage.length / itemsPerPage)
                  ? "bg-gray-300 "
                  : "bg-primaryBusiness"
              }`}
            >
              <GrNext />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full p-20 w-full">
          <span className="text-2xl flex items-center gap-5">
            ยังไม่มีที่พักของคุณในขณะนี้
          </span>
          <button className="flex items-center gap-3 text-lg bg-green-500 p-2 rounded-lg text-white my-2">
            <MdAddHomeWork className="text-3xl" />
            สร้างที่พักใหม่เลยตอนนี้
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessPackage;
