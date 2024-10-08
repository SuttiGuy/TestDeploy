import { useEffect } from "react";
import axiosPrivateUser from "../../hook/axiosPrivateUser";

const paymentSuccess = () => {

  const createBooking = async () => {
    const Data = localStorage.getItem("bookingDetails");
  
    if (Data) {
      try {
        const bookingData = JSON.parse(Data);
        console.log("Parsed booking data:", bookingData);
  
        // ส่งข้อมูลการจองแพ็คเกจ
        const packageResponse = await axiosPrivateUser.post("/bookingPackage", {
          bookingData: bookingData  // ส่งข้อมูลการจองใน bookingData
        });
        console.log("Package booking response:", packageResponse.data);
  
        // ลบข้อมูลการจองจาก localStorage
        localStorage.removeItem("bookingDetails");
      } catch (error: any) {
        console.error("Error creating booking:", error.response?.data || error.message);
      }
    } else {
      console.log("No booking data found in localStorage.");
    }
  };
  


  // เรียกใช้ฟังก์ชันใน useEffect
  useEffect(() => {
    createBooking();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold text-center text-green-800">
          การชำระเงินสำเร็จ!
        </h1>
        <p className="mt-4 text-center text-gray-600">
          การชำระเงินของคุณได้รับการดำเนินการเรียบร้อยแล้ว
        </p>
        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default paymentSuccess;
