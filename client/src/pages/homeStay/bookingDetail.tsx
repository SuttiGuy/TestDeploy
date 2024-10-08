import React, { useState, useEffect } from "react";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import DetailBooking from "../../components/detailBooking";
import { IoMdTime } from "react-icons/io";
import { MdOutlinePolicy } from "react-icons/md";
import axiosPrivateUser from "../../hook/axiosPrivateUser";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import Swal from "sweetalert2";

export interface Image_room {
  _id: string;
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
  _id: string;
}

export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

const BookingDetail: React.FC = () => {
  const { paymentData, dataNav } = usePaymentContext();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [feeAndTax, setFeeAndTax] = useState<number>(0);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { userInfo } = authContext;
console.log(dataNav);


  useEffect(() => {
    if (paymentData && dataNav) {
      const price =
        paymentData.totalPrice *
        dataNav?.numRoom *
        dataNav.dateRange.numberOfNights;
      const taxRate = 0.03;
      const feeRate = 0.05;

      const fee = price * feeRate;
      const tax = (price + fee) * taxRate;
      const feeAndTax = fee + tax;
      const total = price + feeAndTax;

      setFeeAndTax(feeAndTax);
      setTotalPrice(total);
    }
  }, [paymentData?.totalPrice]);

  const email = userInfo?.email;
  const homeStayName = paymentData?.homeStayName;

  // การจัดการวันที่เริ่มต้น (start date)
  const startStr = dataNav?.dateRange.startDate_Time;
  let bookingStart: string;
  console.log(startStr);
  

  if (startStr) {
    const dateStart = new Date(startStr);
    console.log(dateStart);
    
    const offset = dateStart.getTimezoneOffset() * 60000; // Offset เป็น milliseconds
    const localDate = new Date(dateStart.getTime() - offset);
    bookingStart = localDate.toISOString().split("T")[0];
  } else {
    console.log("Start date is not defined");
    bookingStart = "default-start-date";
  }
  const endStr = dataNav?.dateRange.endDate_Time;
  let bookingEnd: string;
  console.log(endStr);
  

  if (endStr) {
    const dateEnd = new Date(endStr);
    bookingEnd = dateEnd.toISOString().split("T")[0];
  } else {
    console.log("End date is not defined");
    bookingEnd = "default-end-date"; // หรือกำหนดค่าเริ่มต้นที่คุณต้องการ
  }
  
  const offer = {
    discount: paymentData?.offer.discount,
    adult: dataNav?.numPeople,
    child: dataNav?.numChildren,
    room: dataNav?.numRoom,
    name_type_room: paymentData?.roomType.name_type_room,
    image_room: paymentData?.roomType.image_room,
    totalPrice: totalPrice,
  };

  const booker = paymentData?.bookingUser._id;
  const homestayId = paymentData?.homeStayId;

  const checkBookingAvailable = async () => {
    try {
      const isAvailable = await axiosPrivateUser.post("/checkBooking", {
        homestay: homestayId,
        bookingStart,
        bookingEnd,
        booker,
        packageId: null,
      });


      if (isAvailable.data.message === "คุณต้องการทำการจองซ้ำอีกครั้งหรือไม่?") {
        Swal.fire({
          title: "คุณต้องการทำการจองซ้ำอีกครั้งหรือไม่?",
          text: "ข้อมูลการจองนี้ยังคงมีอยู่ในระบบ หากคุณต้องการทำการจองใหม่ โปรดยืนยันเพื่อดำเนินการต่อ",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ใช่, ทำการจองใหม่",
          cancelButtonText: "ยกเลิก"
        }).then((result) => {
          if (result.isConfirmed) {
            // เรียกใช้ฟังก์ชันการจองใหม่ที่นี่
            makePayment();
          }
        });
      }else if (isAvailable.data.message === "ยังไม่เคยจอง") {
        makePayment()
      }
    } catch (error) {
      console.error("Error checking booking:", error);
    }
  };

  const makePayment = async () => {
    try {
      const response = await axiosPrivateUser.post("/create-checkout-session", {
        name: homeStayName,
        totalPrice,
        email: email,
      });

      if (response.data) {
        const { sessionUrl } = response.data;

        // เก็บข้อมูลการจองใน localStorage
        const bookingDetails = {
          bookingStart,
          bookingEnd,
          booker,
          homestayId,
          offer,
        };
        localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

        // เปลี่ยนไปยังหน้าการชำระเงิน
        window.location.href = sessionUrl;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Error making payment:", error.response.data.message);
    }
  };
  return (
    <div>
      {paymentData && dataNav ? (
        <div className="container-xl mx-6 md:mx-8 lg:mx-12 xl:mx-40">
          <div className="flex gap-5 mt-5 flex-wrap-reverse lg:flex-nowrap">
            <div className="w-full md:w-full  lg:w-3/5 flex flex-col gap-5">
              {/* ผู้เข้าพัก */}
              <div>
                <div className="shadow-boxShadow rounded-lg p-10">
                  <div className="text-xl font-bold">ผู้เข้าพัก</div>
                  <div className="flex gap-2 mt-5 text-md">
                    <div>
                      <div>ชื่อเต็ม</div>
                      <div>อีเมล</div>
                    </div>
                    <div>
                      <div>
                        : {paymentData.bookingUser.name}{" "}
                        {paymentData.bookingUser.lastName}
                      </div>
                      <div>: {paymentData.bookingUser.email}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* policy */}
              <div>
                <div id="policy">
                  <div className="w-full rounded-lg shadow-boxShadow p-5">
                    <div className="text-xl font-bold mb-5">
                      นโยบายที่พักและข้อมูลทั่วไปของ -{" "}
                      {paymentData.homeStayName}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-md font-bold">
                        <IoMdTime /> เช็คอิน/เช็คเอ้า
                      </div>
                      <div className="ml-10">
                        <div>
                          เช็คอินตั้งแต่ : {paymentData.time_checkIn_homeStay}{" "}
                          น.
                        </div>
                        <div>
                          เช็คเอ้าก่อน : {paymentData.time_checkOut_homeStay} น.
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-md font-bold mt-5">
                        <MdOutlinePolicy />
                        นโยบาย
                      </div>
                      <div className="ml-10">
                        {paymentData.policy_cancel_homeStay}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* รายละเอียดราคา */}
              <div>
                <div className="shadow-boxShadow rounded-lg p-5">
                  <div className="text-xl font-bold">รายละเอียดราคา</div>
                  <div className="gap-2 mt-5 text-md border-b pb-5">
                    <div className="flex justify-between">
                      <div>ราคาห้องพัก</div>
                      <div>
                        {" "}
                        {(
                          paymentData.totalPrice * dataNav?.numRoom
                        ).toLocaleString("th-TH", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                        })}{" "}
                        บาท
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>ภาษีและค่าธรรมเนียม</div>
                      <div>
                        {" "}
                        {feeAndTax.toLocaleString("th-TH", {
                          style: "decimal",
                          minimumFractionDigits: 2,
                        })}{" "}
                        บาท
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-5">
                    <div className="font-bold text-xl">รวมทั้งสิ้น</div>
                    <div className="font-bold text-xl text-alert">
                      {totalPrice.toLocaleString("th-TH", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                      })}
                      บาท
                    </div>
                  </div>

                  <div>
                    <button
                      className="border w-full my-5 p-3 rounded-lg bg-primaryUser text-white font-bold text-xl hover:scale-105
                      transition-transform duration-300"
                      onClick={checkBookingAvailable}
                    >
                      ชำระเงิน
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-full lg:w-2/5 ">
              <DetailBooking totalPrice={totalPrice} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <LoadingTravel />
        </div>
      )}
    </div>
  );
};

export default BookingDetail;
