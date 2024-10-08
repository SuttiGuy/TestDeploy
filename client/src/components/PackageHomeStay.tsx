import React, { useState, useEffect, useContext } from "react";
import { LuBedSingle, LuBedDouble } from "react-icons/lu";
import { MdOutlineBathroom } from "react-icons/md";
import { FaChildReaching } from "react-icons/fa6";
import { TbRuler3 } from "react-icons/tb";
import { FaMale } from "react-icons/fa";
import axiosPrivateUser from "../hook/axiosPrivateUser";
import { Facilities_Room, Image_room, Offer } from "../type";
import axiosPrivateBusiness from "../hook/axiosPrivateBusiness";
import { AuthContext } from "../AuthContext/auth.provider";


interface PackageHomeStayProps {
  id: string;
}

const PackageHomeStay: React.FC<PackageHomeStayProps> = ({ id }) => {
  const [item, setItem] = useState<any>();
  const roomTypes = item?.homestay.room_type || [];
  const [currentIndices, setCurrentIndices] = useState<number[]>(
    roomTypes.map(() => 0)
  );
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        if (userInfo?.role === "user") {
          response = await axiosPrivateUser.get(`/package/${id}`);
          setItem(response.data);
        }else if (userInfo?.role === "business") {
          response = await axiosPrivateBusiness.get(`/package/${id}`);
          setItem(response.data);
        }
      } catch (error) {
        console.error("Error fetching package detail:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    setCurrentIndices(roomTypes.map(() => 0));
  }, []);

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

  const carousel = roomTypes.map((roomType: any, index: number) => {
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

            <div className="w-2/6 flex flex-col justify-end p-2">
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
          </div>
        </div>
      );
    });

    return (
      <div
        key={index}
        className="my-5 relative  shadow-boxShadow p-5 rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4">{roomType.name_type_room}</h2>
        <div className="flex flex-wrap md:flex-wrap lg:flex-nowrap xl:flex-nowrap gap-2 ">
          <div className="w-full md:full lg:w-1/3">
            <div
              id={`carousel-${index}`}
              className="relative w-full shadow-boxShadow rounded-xl"
              data-carousel="slide"
            >
              <div className="relative h-60 rounded-lg">
                {roomType.image_room.map(
                  (image: Image_room, imageIndex: number) => (
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
                        src={image.image}
                        className="absolute block w-full h-full object-cover rounded-xl"
                        alt={`Slide ${imageIndex + 1}`}
                      />
                    </div>
                  )
                )}
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

  


  return (
    <div>
      <div>{carousel}</div>
    </div>
  );
};

export default PackageHomeStay;
