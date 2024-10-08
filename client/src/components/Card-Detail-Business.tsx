import React from "react";
import Swal from "sweetalert2";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebase/firebase.config";
import axiosPublic from "../hook/axiosPublic";
import LoaddingTravel from "../assets/loadingAPI/loaddingTravel";

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

const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      Math.min(maxWidth / img.width, maxHeight / img.height);

      canvas.width = maxWidth;
      canvas.height = maxHeight;
      ctx?.drawImage(img, 0, 0, maxWidth, maxHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
          });
          resolve(resizedFile);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, file.type);
    };
    img.onerror = (err) => reject(err);
  });
};

const handleUpload = async (file: File, pathImage: string) => {
  const storageRef = ref(storage, pathImage);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

const Card: React.FC<{ item: Booking }> = ({ item }) => {
  
  const [loading, setLoading] = React.useState<boolean>(false);

  const apiSendImage = async (imageURL: string) => {
    if (imageURL) {
      const sendImage = {
        bookingId: item?._id,
        imageUrl: imageURL,
      };
      const response = await axiosPublic.post(
        `/sendMoney`,
        sendImage
      );
  
      if (!response) {
        throw new Error(`Error: ${response}`);
      } else {
        Swal.fire("ยืนยันการโอนเงินสำเร็จ", "", "success");
        setLoading(false)
      }
    }
  };

  const handlePaymentClick = async () => {
    console.log(item);
    
    const { value: file } = await Swal.fire({
      title: "ข้อมูลสำหรับโอนเงิน",
      html: `
      <div style="text-align: left;">
        <p style="margin-bottom: 10px; font-weight: bold;">รายละเอียดบัญชี</p>
        <ul style="margin-bottom: 20px;">
          <li><strong>ชื่อธนาคาร:</strong> ${item.homestay?.business_user?.[0]?.BankingName || item.package?.business_user?.BankingName}</li>
          <li><strong>ชื่อ:</strong> ${item.homestay?.business_user?.[0]?.BankingUsername || item.package?.business_user?.BankingUsername}</li>
          <li><strong>นามสกุล:</strong> ${item.homestay?.business_user?.[0]?.BankingUserlastname || item.package?.business_user?.BankingUserlastname}</li>
          <li><strong>เลขบัญชี:</strong> ${item.homestay?.business_user?.[0]?.BankingCode || item.package?.business_user?.BankingCode}</li>
        </ul>
        <p style="margin-bottom: 10px; font-weight: bold;">กรุณาอัปโหลดหลักฐานการโอนเงิน</p>
        <div style="display: flex; justify-start: flex-end;">
          <input type="file" id="file-upload" accept="image/*" style="margin-top: 15px;">
        </div>
        <div id="error-message" style="color: #dc143c; display: none; margin-top: 15px;">กรุณาแนบหลักฐานการโอนเงิน</div>
      </div>
    `,    
      focusConfirm: false,
      preConfirm: () => {
        const fileInput = document.getElementById("file-upload") as HTMLInputElement | null;
        const errorMessage = document.getElementById("error-message");
  
        if (fileInput) {
          if (fileInput.files) {
            if (!fileInput.files.length) {
              if (errorMessage) {
                errorMessage.style.display = "block";
              }
              return false;
            }
            return fileInput.files[0];
          }
        }
        return null;
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยันโอน",
      cancelButtonText: "ยกเลิก",
      didOpen: () => {
        const errorMessage = document.getElementById("error-message");
        if (errorMessage) {
          errorMessage.style.display = "none";
        }
      },
    });
  
    if (file) {
      try {
        const resizedFile = await resizeImage(file, 500, 500);
        const pathImage = `imagesPayment/${item?._id}`;
        setLoading(true)
        await handleUpload(resizedFile, pathImage);
        const storageRef = ref(storage, pathImage);
        const imageURL = await getDownloadURL(storageRef);
        await apiSendImage(imageURL);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการประมวลผลไฟล์",
          text: `${error}`,
        });
      }
    } else {
      Swal.fire("การโอนเงินถูกยกเลิก", "", "info");
    }
  };
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoaddingTravel />
      </div>
    );
  }

  return (
    <div className="card-box flex flex-col xl:flex-row max-w-full rounded overflow-hidden shadow-boxShadow relative my-6 h-full">
      <div
        id="image-Business"
        className="relative w-full xl:w-[25%] flex flex-col justify-center items-center"
      >
        {/* เส้นหมุน */}
        <div className="absolute w-[200px] h-[200px] rounded-full border-t-4 border-transparent border-t-blue-300 animate-spin-slow"></div>
        <div className="absolute w-[170px] h-[170px] rounded-full border-t-4 border-transparent border-t-blue-400 animate-spin-reverse"></div>
        <div className="absolute w-[140px] h-[140px] rounded-full border-t-4 border-transparent border-t-blue-500 animate-spin-slow"></div>
        <div className="absolute w-[110px] h-[110px] rounded-full border-t-4 border-transparent border-t-blue-600 animate-spin-reverse"></div>
        <div className="absolute w-[80px] h-[80px] rounded-full border-t-4 border-transparent border-t-gray-700 animate-spin-slow"></div>

        {/* รูปวงกลม */}
        <img
          id="imageCard-Home"
          src={
            item.homestay?.business_user?.[0]?.image ||
            item.package?.business_user?.image ||
            "https://www.thebetter.co.th/upload/news/thumb/2803.png?t=1727486225"
          }
          alt="images to cards"
          className="w-[100px] h-[100px] rounded-full object-cover z-10 my-2"
        />
      </div>
      <div id="center-card-Package" className="w-full xl:w-[50%] mt-5">
        <div className="flex justify-between my-1 mx-5 text-xl">
          <div className="flex flex-row">
            <div className="mx-2">
              {item.homestay?.business_user?.[0]?.name ||
                item.package?.business_user?.name}
            </div>
            <div className="mx-2">
              {item.homestay?.business_user?.[0]?.lastName ||
                item.package?.business_user?.lastName}
            </div>
          </div>
          <div className="w-28 text-sm text-white rounded-full bg-blue-600 flex items-center justify-center">
            <div>พร้อมรับเงิน</div>
          </div>
        </div>
        <div className="mb-2 mx-7 text-sm">
          (
          {item.homestay?.business_user?.[0]?.businessName ||
            item.package?.business_user?.businessName}
          )
        </div>
        <div className="flex flex-col mb-5 mx-7 text-md">
          <div>
            รายการ: {item.detail_offer[0]?.name_type_room || "ไม่มีข้อมูล"}
          </div>
          <div>จำนวน: {item.night || "ไม่มีข้อมูล"} คืน</div>
          <div>
            เช็คอิน:{" "}
            {item.bookingStart
              ? new Date(item.bookingStart).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "ไม่มีข้อมูล"}
          </div>
          <div>
            เช็คเอ้าท์:{" "}
            {item.bookingEnd
              ? new Date(item.bookingEnd).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "ไม่มีข้อมูล"}
          </div>
        </div>
        <div className="flex flex-col items-end justify-end mx-5 mb-5">
          <div className="text-sm">ยอดที่ต้องจ่าย</div>
          <div className="text-2xl">
            {item.detail_offer[0]?.totalPrice && item.night
              ? `${(
                  item.detail_offer[0].totalPrice *
                  (1 - 0.04 * Math.min(item.night, 2))
                )
                  .toFixed(2)
                  .toLocaleString()} บาท`
              : "ไม่มีข้อมูล"}
          </div>
        </div>
      </div>
      <button
        id="right-card"
        className="w-full xl:w-[25%] card-box hover:bg-whiteSmoke hover:text-blue-600"
        onClick={handlePaymentClick}
      >
        <div className="flex items-center justify-center h-full text-[35px] shadow-text">
          ชำระเงิน
        </div>
      </button>
    </div>
  );
};

export default Card;
