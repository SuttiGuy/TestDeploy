import React, { useState } from "react";
// import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import { CiImageOn } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";

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
  facilitiesRoom: Facilities_Room;
  roomCount: number;
  quantityRoom: number;
}
export interface image {
  image: string;
}
export interface RoomType {
  image_room: image[];
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
}

export interface Location {
  name_location: string;
  province_location: string;
  house_no: string;
  village: string;
  village_no: string;
  alley: string;
  street: string;
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: string;
  longitude_location: string;
  radius_location: number;
}

export interface FormData {
  name_homeStay: string;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  business_user: string;
  status_sell_homeStay: string;
}

const createHomeStay: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name_homeStay: "",
    detail_homeStay: "",
    time_checkIn_homeStay: "",
    time_checkOut_homeStay: "",
    policy_cancel_homeStay: "คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก",
    business_user: "",
    status_sell_homeStay: "",
  });
  const [location, setLocation] = useState<Location>({
    name_location: "",
    province_location: "",
    house_no: "",
    village: "",
    village_no: "",
    alley: "",
    street: "",
    district_location: "",
    subdistrict_location: "",
    zipcode_location: 0,
    latitude_location: "",
    longitude_location: "",
    radius_location: 0,
  });
  const [roomType, setRoomType] = useState<RoomType>({
    image_room: [],
    name_type_room: "",
    bathroom_homeStay: 0,
    bedroom_homeStay: 0,
    sizeBedroom_homeStay: "",
  });
  // const [offer, setOffer] = useState<Offer>({
  //   price_homeStay: 0,
  //   max_people: {
  //     adult: 0,
  //     child: 0,
  //   },
  //   discount: 0,
  //   facilitiesRoom: {
  //     facilitiesName: "",
  //   },
  //   roomCount: 0,
  //   quantityRoom: 0,
  // });
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);
  // const [checkInTime, setCheckInTime] = useState("15:00");
  // const [checkOutTime, setCheckOutTime] = useState("12:00");
  const [cancellationPolicy, setCancellationPolicy] = useState("คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก");
  const [selected, setSelected] = useState<string | null>("homestay");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [hasDiscount, setHasDiscount] = useState<boolean>(false);
  const [hasBank, setHasHasBank] = useState<boolean>(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!isPolicyAccepted) {
  //     alert("กรุณยากดยอมรับ");
  //     return;
  //   }
  //   try {
  //     const response = await axiosPrivateBusiness.post(`/homestay`);
  //     setFormData(response.data);
  //     if (response.data) {
  //       alert("ที่พักของท่านสร้างเรียบร้อยแล้ว");
  //     } else {
  //       alert("เกิดข้อผิดพลาดในการบันทึก");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
  //   }
  // };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // ตรวจสอบว่า e.target เป็น HTMLInputElement
    if (type === "radio" || type === "checkbox") {      
      let displayText = "คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก";
      switch (value) {
        case "option1":
          displayText = "คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก";
          setCancellationPolicy(displayText)
          break;
        case "option2":
          displayText = "คืนเงิน 50% หากทำการยกเลิกภายใน 3 วันก่อนการเข้าพัก";
          setCancellationPolicy(displayText)
          break;
        case "option3":
          displayText = "คืนเงิน 50% หากทำการยกเลิกภายใน 7 วันหลังการเข้าพัก";
          setCancellationPolicy(displayText)
          break;
        
      } 
      setFormData((prevState) => ({
        ...prevState,
        [name]: displayText,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } 
    
  };

  console.log(cancellationPolicy);
  console.log(formData);
  

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      const imageRoom = filesArray.map((image) => ({ image }));

      setRoomType((prevRoomType) => ({
        ...prevRoomType,
        image_room: [...prevRoomType.image_room, ...imageRoom],
      }));
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setRoomType((prevRoomType) => ({
  //     ...prevRoomType,
  //     [name]: value,
  //   }));
  // };
  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(location);
  };
  // const handleChangeRoomType = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setRoomType((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  //   console.log(roomType);
  // };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPolicyAccepted(e.target.checked);
  };
  const handleAddAmenity = () => {
    if (inputValue.trim() !== "") {
      setAmenities([...amenities, inputValue]);
      setInputValue("");
    }
  };

  const handleNextClick = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 7));
  };

  const handlePreviousClick = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleButtonClick = (typeRoom: string) => {
    setSelected(typeRoom);
  };

  const handleDeleteAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const pageSwitch = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="mb-6">
              <label className="block font-medium mb-2">
                ตั้งชื่อที่พักของท่าน
              </label>
              <input
                type="text"
                placeholder="ชื่อที่พัก"
                className="w-full border rounded-md p-2"
                name="name_homeStay"
                value={formData.name_homeStay}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6 rounded-lg">
              <label className="block font-medium mb-2">
                เลือกประเภทที่พักของท่าน
              </label>
              <div className=" shadow-boxShadow rounded-md">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-3">ประเภทที่พัก</h3>
                  <div className="flex space-x-4">
                    <button
                      className={`border h-20 w-full rounded-md p-4 flex flex-col items-center ${
                        selected === "home"
                          ? "border-black bg-blue-500 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                      onClick={() => handleButtonClick("home")}
                    >
                      <FaHome size={75} />
                      <span>บ้านพักตากอากาศ</span>
                    </button>
                    <button
                      className={`border h-20 w-full rounded-md p-4 flex flex-col items-center ${
                        selected === "homestay"
                          ? "border-black bg-blue-500 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                      }`}
                      onClick={() => handleButtonClick("homestay")}
                    >
                      <IoIosHome size={75} />
                      <span>โฮมสเตย์</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                กรอกคำอธิบายเกี่ยวกับที่พัก
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                placeholder="คำอธิบายที่พัก"
                name="detail_homeStay"
                value={formData.detail_homeStay}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                เวลาเช็คอิน/เช็คเอาท์
              </label>
              <div className=" shadow-boxShadow rounded-md ">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <label>ผู้เข้าพักสามารถเช็คอินได้ตั้งแต่</label>

                    <input
                      type="text"
                      className="border rounded-md p-2"
                      placeholder="12:00"
                      name="time_checkIn_homeStay"
                      value={formData.time_checkIn_homeStay}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>ผู้เข้าพักสามารถเช็คเอาท์ได้ถึง</label>
                    <input
                      type="text"
                      placeholder="11:00"
                      className="border rounded-md p-2"
                      name="time_checkOut_homeStay"
                      value={formData.time_checkOut_homeStay}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">
                นโยบายการยกเลิกการจอง
              </label>
              <div className=" shadow-boxShadow rounded-md ">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="p-5">
                  <div className="flex items-center mb-2">
                  <input
                      type="radio"
                      id="option1"
                      name="policy_cancel_homeStay"
                      value="option1"
                      checked={cancellationPolicy === "คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="option1">
                      คืนเงิน 100% หากทำการยกเลิกภายใน 1 วันก่อนการเข้าพัก
                    </label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      id="option2"
                      name="policy_cancel_homeStay"
                      value="option2"
                      checked={cancellationPolicy === "คืนเงิน 50% หากทำการยกเลิกภายใน 3 วันก่อนการเข้าพัก"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="option2">
                      คืนเงิน 50% หากทำการยกเลิกภายใน 3 วันก่อนการเข้าพัก
                    </label>
                  </div>
                  <div className="flex items-center">
                  <input
                      type="radio"
                      id="option3"
                      name="policy_cancel_homeStay"
                      value="option3"
                      checked={cancellationPolicy === "คืนเงิน 50% หากทำการยกเลิกภายใน 7 วันหลังการเข้าพัก"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label htmlFor="option3">
                      คืนเงิน 50% หากทำการยกเลิกภายใน 7 วันหลังการเข้าพัก
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className=" shadow-boxShadow rounded-md ">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="py-5">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        จังหวัด
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="จังหวัด"
                        name="province_location"
                        value={location.province_location}
                        onChange={handleChangeLocation}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        อำเภอ
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="อำเถอ"
                        name="district_location"
                        value={location.district_location}
                        onChange={handleChangeLocation}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ตำบล
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        name="subdistrict_location"
                        placeholder="ตำบล"
                        value={location.subdistrict_location}
                        onChange={handleChangeLocation}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        บ้านเลขที่
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="บ้านเลขที่"
                        name="house_no"
                        value={location.house_no}
                        onChange={handleChangeLocation}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        เลขที่หมู่
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        name="village_no"
                        placeholder="หมู่ที่"
                        value={location.village_no}
                        onChange={handleChangeLocation}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        รหัสไปรษณีย์ (ไม่บังคับ)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="รหัสไปรษณีย์"
                        name="zipcode_location"
                        value={location.zipcode_location || ""}
                        onChange={handleChangeLocation}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ละติจูด
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="00.0000"
                        name="latitude_location"
                        value={location.latitude_location}
                        onChange={handleChangeLocation}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ลองจิจูด
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        name="longitude_location"
                        placeholder="00.0000"
                        value={location.longitude_location}
                        onChange={handleChangeLocation}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ที่ตั้งแผนที่
                    </label>
                    <div className="w-full h-64 bg-gray-200 rounded-md">
                      {/* Placeholder for Map Image */}
                      <img
                        src="path/to/map-image.png"
                        alt="Map"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      มีปัญหากับแผนที่หรือพิกัดของสถานที่ของคุณหรือไม่?
                      หากไม่แน่ใจ ให้ลากแผนที่เพื่อกำหนดพิกัดของคุณ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold ">อัปโหลดรูปภาพ</h3>
            <p>
              รูปภาพมีความสำคัญต่อผู้ใช้
              อัปโหลดภาพคุณภาพสูงได้มากเท่าที่คุณมีสามารถเพิ่มมากขึ้นในภายหลัง
            </p>
            <div className=" border-2 border-dashed border-smoke p-2 rounded-lg flex  flex-col items-center justify-center w-full  m-3">
              <CiImageOn size={100} className=" text-smoke" />
              <div className="text-smoke flex flex-col items-center z-50 ">
                <p>กรุณาอัปโหลดรูปภาพอย่างน้อย 7 รูป</p>
                <p>ลากและวางภาพของคุณที่นี่</p>
                <div>
                  <label
                    htmlFor="file-upload"
                    className="btn border-smoke bg-white shadow-buttonShadow text-black m-3 z-50 hover:text-white "
                  >
                    เลือกรูปถ่าย
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="border w-full  grid grid-cols-3 gap-3 p-3">
                {roomType.image_room.map((img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt={`Room Image ${index}`}
                    className="w-full h-full object-cover m-2 "
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="w-full flex flex-col">
              {/* Room and Details Section */}
              <div className="shadow-boxShadow  rounded-lg p-4 mb-4 w-full">
                <h2 className="text-lg font-semibold mb-4">
                  ห้องพักและรายละเอียด
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    จำนวนคนที่สามารถรองรับได้ต่อหนึ่งห้อง
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      placeholder="1"
                      name="time_checkIn_homeStay"
                      // value={roomType.offer.}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">4</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    ห้องน้ำ
                  </label>
                  <p className="text-sm mb-2">
                    นับเฉพาะห้องน้ำในที่พักของคุณ ไม่ใช่ห้องน้ำรวมในอาคารหรือ
                    คอมเพล็กซ์ของคุณ
                  </p>
                  <div className="flex items-center">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">1</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ห้องนอน
                  </label>
                  <div className="flex items-center mb-2">
                    <button className="btn btn-outline btn-sm">-</button>
                    <span className="mx-2">1</span>
                    <button className="btn btn-outline btn-sm">+</button>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full max-w-xs"
                    placeholder="เตียงควีนไซส์"
                  />
                </div>

                <a href="#" className="text-sm text-blue-500 mt-2 inline-block">
                  เพิ่มเตียงประเภทอื่น
                </a>
              </div>

              {/* Amenities Section */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-4">
                  สิ่งอำนวยความสะดวก
                </h2>
                <p className="text-sm mb-2">เพิ่มอย่างน้อย 3 อย่าง</p>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="input input-bordered"
                    placeholder="กรอกสิ่งอำนวยความสะดวก"
                  />
                  <button
                    className=" bg-primaryBusiness text-black hover:bg-primaryNoRole px-4 py-2 rounded-lg"
                    onClick={handleAddAmenity}
                  >
                    เพิ่ม
                  </button>
                </div>

                <ul className="grid grid-rows-4 grid-flow-col gap-4 ">
                  {amenities.map((amenity, index) => (
                    <li key={index} className="flex m-3">
                      <div className="">
                        <div className="text-lg flex items-center gap-3">
                          {amenity}
                          <button
                            onClick={() => handleDeleteAmenity(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaDeleteLeft size={20} className="flex  " />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h3 className="text-xl font-semibold">ราคาต่อคืน</h3>
            <p>กรุณาระบุราคาต่อคนที่คุณต้องการสำหรับที่พักนี้</p>
            <div className="shadow-boxShadow rounded-md">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="flex flex-col ml-20 p-10">
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    ราคาต่อคืน
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                      defaultValue="0"
                    />
                    <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                      บาท
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary"
                      checked={hasDiscount}
                      onChange={() => setHasDiscount(true)}
                    />
                    <span className="ml-2">ฉันมีส่วนลด</span>
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary ml-4"
                      checked={!hasDiscount}
                      onChange={() => setHasDiscount(false)}
                    />
                    <span className="ml-2">ฉันไม่มีส่วนลด</span>
                  </div>
                  <label className="block text-smoke   text-sm font-bold mb-2">
                    หากมีส่วนลดกรุณาเลือกพร้อมกรอกฟอร์มข้างล่างต่อ
                  </label>
                </div>

                {hasDiscount && (
                  <>
                    <div className="">
                      <label className="block text-gray-700 text-sm font-bold ">
                        อัตรารายสัปดาห์
                      </label>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        ส่วนลดกรจองต่อไปนี้ใช้สำหรับ 7 คืนขึ้นไป
                      </label>
                      <div className="flex items-center">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            %
                          </span>
                        </div>
                        <div className="flex ml-5">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            บาท
                          </span>
                          <span className="ml-4 mt-1">ต่อคืนเป็นราคาขาย</span>
                        </div>
                      </div>
                    </div>

                    <div className="">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        ส่วนลดกรจองต่อไปนี้ใช้สำหรับ 28 คืนขึ้นไป
                      </label>
                      <div className="flex items-center">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            %
                          </span>
                        </div>
                        <div className="flex ml-5">
                          <input
                            type="text"
                            placeholder="0"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg"
                          />
                          <span className="shadow-buttonShadow flex bg-primaryBusiness rounded-r-lg w-14 justify-center items-center">
                            บาท
                          </span>
                          <span className="ml-4 mt-1">ต่อคืนเป็นราคาขาย</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div>
            <h3 className="text-xl font-semibold">วิธีจ่ายเงิน</h3>
            <p>โปรดเลือกวิธีจ่ายเงินที่ต้องการ</p>
            <div className="shadow-boxShadow rounded-md">
              <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
              <div className="flex flex-col ml-20 p-10">
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    เลือกบัญชีธนาคาร
                  </label>
                </div>
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary"
                      checked={!hasBank}
                      onChange={() => setHasHasBank(false)}
                    />
                    <span className="ml-2">ผูกบัญชีธนาคารไว้</span>
                    <input
                      type="radio"
                      name="discountOption"
                      className="radio radio-primary ml-4"
                      checked={hasBank}
                      onChange={() => setHasHasBank(true)}
                    />
                    <span className="ml-2">ยังไม่ได้ผูกบัญชีธนาคาร</span>
                  </div>
                </div>

                {hasBank && (
                  <>
                    <div className="">
                      <div className="flex items-center">
                        <div className="flex w-full">
                          <select className="select select-bordered w-full bg-white">
                            <option disabled selected>
                              เลือกธนาคาร
                            </option>
                            <option>กสิกร</option>
                            <option>ออมสิน</option>
                            <option>กรุงไทย</option>
                            <option>ไทยพาณิชย์</option>
                            <option>กรุงเทพ</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 ">
                        <p>เลขที่บัญชี</p>
                        <div className="flex mt-3 ">
                          <input
                            type="text"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-l-lg w-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row mt-4 w-full">
                        <div className="flex flex-col w-[50%]">
                          <div className="label">
                            <span className="label-text">ชื่อ</span>
                          </div>
                          <input
                            type="number"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-lg  "
                          />
                        </div>
                        <div className="flex flex-col ml-4 w-[50%]">
                          <div className="label">
                            <span className="label-text">นามสกุล</span>
                          </div>
                          <input
                            type="number"
                            placeholder="กรอกเลขหมายบัญชี"
                            className="shadow-boxShadow border-whiteSmoke rounded-lg "
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <form action="">
            <div>
              <h3 className="text-xl font-semibold">นโยบาย</h3>
              <div className="shadow-boxShadow rounded-md w-full h-[400px]">
                <div className="w-full py-2 bg-primaryBusiness rounded-t-lg"></div>
                <div className="flex flex-col ml-20 p-5 text-wrap">
                  <h3 className=" text-lg">
                    คุณมีหน้าที่รับผิดชอบในการตรวจสอบกฎหมายและภาษีในท้องถิ่น
                  </h3>
                  <p className=" text-sm mt-3">
                    โปรดระวังข้อบังคับ กฎหมาย
                    และภาระภาษีในท้องถิ่นของท่านก่อนทําการจอง
                    หลายประเทศและหลายเมืองมีกฎหมายเฉพาะเกี่ยวกับการใช้ทรัพย์สินของคุณเป็นการเช่าระยะสั้นสําหรับการแชร์บ้านและ
                    / หรือสําหรับการโฮสต์มืออาชีพ
                    ท่านมีหน้าที่รับผิดชอบในการทํางานภายใต้กรอบกฎหมายของประเทศของท่าน
                    ซึ่งอาจรวมถึงการได้รับใบอนุญาต ใบอนุญาต
                    หรือการลงทะเบียนที่เกี่ยวข้องก่อนทําการจอง
                    และชําระภาษีที่เกี่ยวข้องสําหรับรายได้ใดๆ
                    ที่ท่านได้รับจากการจองดังกล่าว
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center mt-4">
                <input
                  type="checkbox"
                  name="policyAccept"
                  className="mr-2"
                  checked={isPolicyAccepted}
                  onChange={handlePolicyChange}
                />
                <span className="ml-1 flex">ฉันยอมรับ</span>
              </div>
              <div className="flex justify-end items-end">
                <button className="btn btn-primary" onClick={handleNextClick}>
                  ตกลง
                </button>
              </div>
            </div>
          </form>
        );
      default:
        return null;
    }
  };
  return (
    <div className="container-lg flex flex-wrap md:flex-wrap lg:flex-wrap xl:flex-nowrap  p-4">
      {/* Left Sidebar */}
      <div className="flex lg:justify-center w-full md:w-full lg:w-full xl:w-1/5 xl:h-[500px]">
        <div className="  bg-white mx-6 flex  rounded-md shadow-md p-4">
          <ul className="steps steps-horizontal md:steps-horizontal lg:steps-horizontal xl:steps-vertical">
            <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>
              ข้อมูลพื้นฐาน
            </li>
            <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>
              สถานที่
            </li>
            <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>
              รายละเอียดที่พัก
            </li>
            <li className={`step ${currentStep >= 4 ? "step-primary" : ""}`}>
              การตั้งค่าการจอง
            </li>
            <li className={`step ${currentStep >= 5 ? "step-primary" : ""}`}>
              ราคา
            </li>
            <li className={`step ${currentStep >= 6 ? "step-primary" : ""}`}>
              ข้อกำหนด
            </li>
            <li className={`step ${currentStep >= 7 ? "step-primary" : ""}`}>
              นโยบาย
            </li>
          </ul>
        </div>
      </div>
      {/* Main Form Section */}
      <main className="w-full md:w-full lg:w-full xl:w-4/5 p-6 bg-white rounded-md shadow-md ">
        <h1 className="text-2xl font-semibold mb-4">
          สร้างที่พักของท่านที่เหมาะสม
        </h1>
        {pageSwitch()}

        <div className=" mt-4">
          {currentStep <= 1 ? (
            <div className="flex justify-end items-center">
              <button className="btn btn-primary" onClick={handleNextClick}>
                ต่อไป
              </button>
            </div>
          ) : currentStep >= 7 ? (
            <div className="flex justify-start items-start">
              <button className="btn btn-primary" onClick={handlePreviousClick}>
                ก่อนหน้า
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <button className="btn btn-primary" onClick={handlePreviousClick}>
                ก่อนหน้า
              </button>

              <button className="btn btn-primary" onClick={handleNextClick}>
                ต่อไป
              </button>
            </div>
          )}
        </div>
        {/* Updated from w-3/4 to w-2/3 */}
      </main>
    </div>
  );
};

export default createHomeStay;
