import { useEffect, useState } from "react";
import axiosPublic from "../../hook/axiosPublic";
import Card from "../../components/Card-Detail-Business";

// ที่อยู่ของ business user
interface Address {
  houseNumber: string;
  village: string;
  street: string;
  district: string;
  subdistrict: string;
  city: string;
  country: string;
  postalCode: string;
  _id: string;
}

// ข้อมูลของ business user
interface BusinessUser {
  _id: string;
  email: string;
  businessName: string;
  name: string;
  lastName: string;
  birthday: string | null;
  image: string;
  idcard: string;
  BankingName: string;
  BankingUsername: string;
  BankingUserlastname: string;
  BankingCode: string;
  isVerified: boolean;
  role: string;
  address: Address[];
  __v: number;
}

// ข้อมูลของ homestay
interface Homestay {
  _id: string;
  business_user: BusinessUser[];
}

// ข้อมูลของ Package
interface Package {
  _id: string;
  business_user: BusinessUser;
}

// รูปภาพของห้องพัก
interface ImageRoom {
  image: string;
  _id: string;
}

// ข้อเสนอสำหรับห้องพัก
interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  room: number;
  discount: number;
  totalPrice: number;
  image_room: ImageRoom[];
  _id: string;
}

// ข้อมูลการจอง
interface Booking {
  _id: string;
  booker: string;
  homestay: Homestay;
  package: Package;
  detail_offer: DetailOffer[];
  bookingStart: string;
  bookingEnd: string;
  night: number;
  bookingStatus: string;
  __v: number;
}

const BookingBusiness = () => {
  const [businesses, setBusinesses] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPackage, setIsPackage] = useState<boolean>(false);

  const clickToPackage = () => {
    setIsPackage(true);
  };

  const clickToHome = () => {
    setIsPackage(false);
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axiosPublic.get("/getBookingForAdmin");
        const confirmedBookings = response.data.filter(
          (booking:Booking) => booking.bookingStatus === "Check-in"
        );
        setBusinesses(confirmedBookings);
      } catch (err) {
        setError("Failed to load businesses");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [businesses]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (businesses.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
          <button
            id="button-homestaySearch-Select"
            className={
              !isPackage
                ? "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
                : "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToHome}
          >
            ผู้ใช้ ( จำนวนสุทธิ )
          </button>
          <button
            id="button-homestaySearch-noSelect"
            className={
              !isPackage
                ? "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
                : "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToPackage}
          >
            ผู้ขาย (จำนวนสุทธิ)
          </button>
        </div>
        <div className="min-h-screen flex items-center justify-center">
          <p>ไม่พบข้อมูล</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center w-full shadow-lg rounded-[10px] ">
        <button
          id="button-homestaySearch-Select"
          className={
            !isPackage
              ? "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
              : "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
          }
          onClick={clickToHome}
        >
          ผู้ใช้ ( จำนวนสุทธิ )
        </button>
        <button
          id="button-homestaySearch-noSelect"
          className={
            !isPackage
              ? "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
              : "bg-gradient-to-r from-primaryAdmin to-secondAdmin text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
          }
          onClick={clickToPackage}
        >
          ผู้ขาย (จำนวนสุทธิ)
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 p-4">
        {businesses.map((business) => (
          <div key={business?._id} className="w-full">
            <Card item={business} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingBusiness;
