// DetailPayment.tsx
import React, { useEffect, useState } from "react";
import axiosPublic from "../../hook/axiosPublic";
import DetailBooking from "../../components/detailBooking";
import { usePaymentContext } from "../../AuthContext/paymentContext";
import LoadingTravel from "../../assets/loadingAPI/loaddingTravel";

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
}

export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

const DetailPayment: React.FC = () => {
  const [isLoading, setLoadPage] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);
  const { paymentData } = usePaymentContext();

  if (!paymentData) {
    <LoadingTravel />;
  }

  if (isLoading == true) {
    <LoadingTravel />;
  }
  // const { totalPrice } = paymentData;
  console.log(paymentData);

  useEffect(() => {
    setLoadPage(true);
    const generateQR = async () => {
      const amount = paymentData?.totalPrice;
      try {
        const response = await axiosPublic.post("/payment/generateQR", {
          amount,
        });
        setQrCodeUrl(response.data.Result);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    generateQR();
    setLoadPage(false);
  }, []);

  return (
    <div>
      {paymentData ? (
        <div className="container-sm mx-10 md:mx-40">
          <div className="flex flex-col items-center">
            <div className="flex justify-end w-full my-5">
              <ul className="steps steps-vertical lg:steps-horizontal">
                <li data-content="✓" className="step step-primary">
                  ข้อมูลการจอง
                </li>
                <li data-content="✓" className="step step-primary">
                  ข้อมูลการชำระเงิน
                </li>
                <li className="step">ชำระเงิน</li>
                <li className="step">รอการยืนยัน</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <div className="w-2/3 shadow-boxShadow rounded-xl ">
              <div className="flex items-center p-5">
                <h1 className="font-bold text-lg ml-4">ชำระเงินด้วย QR Code</h1>
              </div>
              <div className="flex flex-col">
                <div className="flex justify-center">
                  {qrCodeUrl && (
                    <img
                      id="imgqr"
                      src={qrCodeUrl}
                      alt="QR Code"
                      style={{ width: "300px", objectFit: "contain" }}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-4 mt-10 px-10 pb-5">
                  <p>
                    1. เปิดแอปพลิเคชันของธนาคารบนอุปกรณ์มือถือที่ต้องการใช้งาน
                  </p>
                  <p>
                    2. สแกน QR Code หรือบันทึกรูป QR Code
                    และเปิดรูปในแอปพลิเคชั่นธนาคารของท่าน
                  </p>
                  <p>3. ตรวจสอบรายละเอียดและยืนยันการชำระเงิน</p>
                  <p>4. เราจะส่งใบยืนยันการจองไปยังอีเมลที่ท่านใช้ในการจอง</p>
                </div>
              </div>
            </div>
            <DetailBooking totalPrice={paymentData?.totalPrice} />
          </div>
        </div>
      ) : (
        <LoadingTravel />
      )}
    </div>
  );
};

export default DetailPayment;
