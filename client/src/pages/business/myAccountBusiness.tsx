import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect, useContext, useRef } from "react";
import axiosPrivateBusiness from "../../hook/axiosPrivateBusiness";
import { AuthContext } from "../../AuthContext/auth.provider";
import { storage } from "../../Firebase/firebase.config";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BsCamera } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { Address, Business, Password } from "../../type";

const banks = [
  "ธนาคารกรุงเทพ",
  "ธนาคารกสิกรไทย",
  "ธนาคารกรุงไทย",
  "ธนาคารไทยพาณิชย์",
  "ธนาคารทหารไทยธนชาต",
  "ธนาคารออมสิน",
  "ธนาคารธนชาต",
  // เพิ่มธนาคารอื่น ๆ ตามต้องการ
];

const myAccountBusiness = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, setUserInfo } = authContext;
  // const [openUpdateFrom, setOpenUpdateFrom] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [userData, setUserData] = useState<Business>();
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false);
  const [openUpdateAddress, setOpenUpdateAddress] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState<Password>({
    email: "",
    password: "",
    newPass: "",
    confirmPass: "",
  });
  const [address, setAddress] = useState<Address>({
    houseNumber: userData?.address[0]?.houseNumber || "",
    street: userData?.address[0]?.street || "",
    village: userData?.address[0]?.village || "",
    subdistrict: userData?.address[0]?.subdistrict || "",
    district: userData?.address[0]?.district || "",
    city: userData?.address[0]?.city || "",
    country: userData?.address[0]?.country || "",
    postalCode: userData?.address[0]?.postalCode || "",
  });
  const [updatedUserInfo, setUpdatedUserInfo] = useState<Business>(
    {} as Business
  );
  const [openUpdateBanking, setOpenUpdateBanking] = useState(false);

  const [updatedBankingInfo, setUpdatedBankingInfo] = useState({
    BankingName: "",
    BankingUsername: "",
    BankingUserlastname: "",
    BankingCode: "",
    role: userInfo?.role,
  });

  const handleBankingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedBankingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitBanking = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, อัปเดตเลย!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivateBusiness.put(`/user/updateUser/${userInfo?._id}`, {
            role: userInfo?.role,
            BankingName: updatedBankingInfo.BankingName,
            BankingUsername: updatedBankingInfo.BankingUsername,
            BankingUserlastname: updatedBankingInfo.BankingUserlastname,
            BankingCode: updatedBankingInfo.BankingCode,
          });
          setOpenUpdateBanking(false);

          // แจ้งเตือนว่าการอัปเดตสำเร็จ
          Swal.fire({
            title: "อัปเดตแล้ว!",
            text: "ที่อยู่ของคุณได้รับการอัปเดตแล้ว.",
            icon: "success",
          });
        } catch (error) {
          // แจ้งเตือนหากเกิดข้อผิดพลาด
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "เกิดปัญหาในการอัปเดตที่อยู่ของคุณ.",
            icon: "error",
          });
        }
      }
    });
  };

  const navigate = useNavigate();

  // console.log(userData);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivateBusiness.get(
          `/user/businessData/${userInfo?._id}`
        );
        setUserData(response.data);
        setAddress(response.data.address[0]);
        setPasswords({
          email: response.data.email,
          password: "",
          newPass: "",
          confirmPass: "",
        });
        setUpdatedUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // console.log(userInfo?.role);

    fetchUserData();
  }, [userInfo?._id, openUpdateAddress, openUpdateUser, openUpdateBanking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ["houseNumber", "postalCode", "village"];
    const numericValue = numericFields.includes(name)
      ? value.replace(/[^0-9/-]/g, "")
      : value.replace(/[^a-zA-Zก-๙/-]/g, "");

    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: numericValue,
    }));
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords((prevPassword) => ({
      ...prevPassword,
      [name]: value, // ตั้งค่า value โดยตรง
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถย้อนกลับได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, อัปเดตเลย!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosPrivateBusiness.put(
            `/user/updateAddress/${userInfo?._id}`,
            {
              role: userInfo?.role,
              address: {
                houseNumber: address.houseNumber,
                village: address.village,
                street: address.street,
                district: address.district,
                subdistrict: address.subdistrict,
                city: address.city,
                country: address.country,
                postalCode: address.postalCode,
              },
            }
          );
          setOpenUpdateAddress(false);

          // แจ้งเตือนว่าการอัปเดตสำเร็จ
          Swal.fire({
            title: "อัปเดตแล้ว!",
            text: "ที่อยู่ของคุณได้รับการอัปเดตแล้ว.",
            icon: "success",
          });
        } catch (error) {
          // แจ้งเตือนหากเกิดข้อผิดพลาด
          Swal.fire({
            title: "ข้อผิดพลาด!",
            text: "เกิดปัญหาในการอัปเดตที่อยู่ของคุณ.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleDeleteUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        navigate("/");
      }
    });
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const changePassword = async () => {
    try {
      const change = await axiosPrivateBusiness.put(
        "/user/update-password",
        passwords
      );
      if (change.status === 200) {
        Swal.fire({
          title: "สำเร็จ!",
          text: "รหัสผ่านของคุณได้ถูกเปลี่ยนเรียบร้อยแล้ว.",
          icon: "success",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: error.response.data.message,
          icon: "error",
        });
        console.log(error.response.data.message);
      } else {
        Swal.fire({
          title: "ข้อผิดพลาด!",
          text: "เกิดข้อผิดพลาดบางอย่าง!",
          icon: "error",
        });
        console.log("Unknown error:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserInfo((prev) => {
      const prevUserInfo = prev || {
        email: "",
        password: "",
        phone: undefined,
        image: "",
        address: [],
        role: userInfo?.role,
      };

      return {
        ...prevUserInfo,
        [name]: value,
      };
    });
  };

  const handleSave = async () => {
    try {
      const updateData = await axiosPrivateBusiness.put(
        `/user/updateUser/${userInfo?._id}`,
        updatedUserInfo
      );
      // setUserInfo(userData)
      if (updateData.status === 200) {
        Swal.fire({
          title: "สำเร็จ!",
          text: "ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว.",
          icon: "success",
        });
      }

      console.log(updateData);

      setOpenUpdateUser(false);
    } catch (error) {
      Swal.fire({
        title: "ข้อผิดพลาด!",
        text: "ไม่สามารถอัปเดตข้อมูลได้ โปรดลองอีกครั้ง.",
        icon: "error",
      });
      console.error("Error updating user:", error);
    }
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const resizedFile = await resizeImage(selectedFile, 500, 500);
      const pathImage = `imagesAvatar/${userInfo?._id}`;

      Swal.fire({
        title: "Are you sure you want to change the image?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // setLoadPage(false);
            await handleUpload(resizedFile, pathImage);
            const storageRef = ref(storage, pathImage);
            const imageURL = await getDownloadURL(storageRef);
            await apiUpdateImage(imageURL);
            // setLoadPage(true);
            setOpenUpdateUser(false);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "There was an error updating.",
              text: `${error}`,
            });
          }
        } else if (result.isDismissed) {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          console.log("User canceled the image change");
        }
      });
    }
  };

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

  const apiUpdateImage = async (imageURL: string) => {
    if (userInfo) {
      const updateImage = {
        image: imageURL,
        role: userInfo.role,
      };
      const response = await axiosPrivateBusiness.put(
        `/user/updateUser/${userInfo._id}`,
        updateImage
      );

      if (!response) {
        throw new Error(`Error: ${response}`);
      } else {
        setUserInfo(response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Avatar image change successful!",
        });
      }
    }
  };

  return (
    <div className="my-5 w-full">
      <div className="mb-5">
        <span className="text-2xl">ข้อมูลผู้ใช้</span>
      </div>
      {userInfo && userData ? (
        <div>
          <div className="shadow-boxShadow p-10  rounded-lg">
            {/* <div className="hover:bg-gray-300 rounded-lg p-5 transition-all duration-700 ease-in-out">
              <div>
                <span className="text-sm">ชื่อธุรกิจ</span>
              </div>
              <div>
                <span className="text-md">{userData?.businessName}</span>
              </div>
            </div> */}

            {openUpdateUser === false ? (
              <div className="flex justify-between items-center rounded-lg hover:bg-gray-300 pr-5 transition-all duration-700 ease-in-out">
                <div className="flex gap-5 items-center p-5">
                  <div>
                    <img
                      src={userData?.image}
                      className="rounded-full w-14 h-14 bg-black"
                      alt="รูปโปรไฟล์"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">ชื่อผู้ใช้</span>
                    <span className="text-lg">
                      {userData?.name} {userData?.lastName}
                    </span>
                  </div>
                </div>
                <div onClick={() => setOpenUpdateUser(true)}>
                  <button>
                    <FaEdit size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-between items-center hover:bg-gray-300 p-5">
                <div className="w-full xl:w-3/4 flex gap-5 items-end p-5">
                  <div className="relative group ">
                    <div className="rounded-full h-14 w-14 object-cover bg-dark">
                      <img
                        src={userData?.image}
                        alt="Profile"
                        className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-30 rounded-full"
                      />
                    </div>
                    <label
                      className="absolute inset-0 bg-opacity-50 text-white text-lg cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ textAlign: "center" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs">
                        <div className="flex flex-col items-center justify-center">
                          <p>
                            <BsCamera />
                          </p>
                          <p>เปลี่ยนรูป</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleChangeImage}
                      />
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">ชื่อผู้ใช้</span>
                    <span className="text-lg flex gap-5 mt-2">
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="ชื่อ"
                          value={updatedUserInfo.name}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="นามสกุล"
                          value={updatedUserInfo.lastName}
                          onChange={handleInputChange}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </span>
                  </div>
                </div>
                <div className="w-full xl:w-1/4 flex justify-end items-end">
                  <button
                    onClick={() => setOpenUpdateUser(false)}
                    className="bg-red-500 mx-2 px-2 py-1 rounded-full text-white hover:bg-red-700"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-400 mx-2 px-2 py-1 rounded-full text-white hover:bg-green-600"
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            )}

            <div className="hover:bg-gray-300 rounded-lg p-5 transition-all duration-700 ease-in-out">
              <div className="flex gap-5 items-center  ">
                <div className="flex flex-col">
                  <span className="text-sm">อีเมล</span>
                  <span className="text-lg flex items-center gap-5 mt-3">
                    {userInfo?.email}{" "}
                    {userInfo?.isVerified === true ? (
                      <div className="text-xs bg-green-400 rounded-full px-1">
                        ยืนยันแล้ว
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {userData.password ? (
              <div>
                {openUpdatePassword === false ? (
                  <div className="flex justify-between items-center hover:bg-gray-300 rounded-lg p-5 transition-all duration-700 ease-in-out">
                    <div className="flex gap-5 items-center">
                      <div className="flex flex-col">
                        <span className="text-sm">รหัสผ่าน</span>
                        <div className="flex space-x-1 mt-3">
                          {Array.from({ length: 10 }).map((_, index) => (
                            <span key={index} className="text-sm">
                              <TbPointFilled />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div onClick={() => setOpenUpdatePassword(true)}>
                      <button>
                        <FaEdit size={24} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 transition-all duration-700 ease-in-out">
                    <div className="shadow-boxShadow p-5 rounded-lg">
                      <div className="text-lg mb-5 font-bold">
                        <span>แก้ไขรหัสผ่าน</span>
                      </div>
                      <div>
                        {/* รหัสผ่านปัจจุบัน */}
                        <div>
                          <span>รหัสผ่านปัจจุบัน</span>
                          <div className="flex gap-2 my-5">
                            <input
                              name="password"
                              value={passwords.password}
                              onChange={handleChangePassword}
                              type={showPasswords.current ? "text" : "password"}
                              placeholder="รหัสผ่านปัจจุบัน"
                              className="input input-bordered w-full"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("current")
                              }
                            >
                              {showPasswords.current ? <LuEye /> : <LuEyeOff />}
                            </button>
                          </div>
                        </div>

                        {/* รหัสผ่านใหม่ */}
                        <div>
                          <span>รหัสผ่านใหม่</span>
                          <div className="flex gap-2 my-5">
                            <input
                              name="newPass"
                              value={passwords.newPass}
                              onChange={handleChangePassword}
                              type={showPasswords.new ? "text" : "password"}
                              placeholder="รหัสผ่านใหม่"
                              className="input input-bordered w-full"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {showPasswords.new ? <LuEye /> : <LuEyeOff />}
                            </button>
                          </div>
                        </div>

                        {/* ยืนยันรหัสผ่านใหม่ */}
                        <div>
                          <span>ยืนยันรหัสผ่านใหม่</span>
                          <div className="flex gap-2 my-5">
                            <input
                              name="confirmPass"
                              value={passwords.confirmPass}
                              onChange={handleChangePassword}
                              type={showPasswords.confirm ? "text" : "password"}
                              placeholder="ยืนยันรหัสผ่านใหม่"
                              className="input input-bordered w-full"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                togglePasswordVisibility("confirm")
                              }
                            >
                              {showPasswords.confirm ? <LuEye /> : <LuEyeOff />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpenUpdatePassword(false)}
                          className="bg-red-500 mx-2 px-5 py-2 rounded-full text-white hover:bg-red-700"
                        >
                          ยกเลิก
                        </button>
                        <button
                          onClick={changePassword}
                          className="bg-green-400 mx-2 px-5 py-2 rounded-full text-white hover:bg-green-600"
                        >
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {openUpdateAddress === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 rounded-lg p-5 transition-all duration-700 ease-in-out">
                <div className="flex gap-5 items-center">
                  <div className="flex flex-col">
                    <span className="text-sm">ที่อยู่</span>
                    <div className="mt-3">
                      <span>
                        {userData?.address[0].houseNumber} ถนน.
                        {userData?.address[0].street} ม.
                        {userData?.address[0].village} ต.
                        {userData?.address[0].subdistrict} อ.
                        {userData?.address[0].district} จ.
                        {userData?.address[0].city}{" "}
                        {userData?.address[0].postalCode}
                      </span>
                    </div>
                  </div>
                </div>
                <div onClick={() => setOpenUpdateAddress(true)}>
                  <button>
                    <FaEdit size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="shadow-boxShadow p-5 rounded-lg">
                  <div>
                    <div className="text-lg mb-5 font-bold">
                      <span>ที่อยู่</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">บ้านเลขที่</span>
                            </div>
                            <input
                              type="text"
                              name="houseNumber"
                              value={address.houseNumber}
                              onChange={handleChange}
                              placeholder="บ้านเลขที่"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ถนน / ซอย</span>
                            </div>
                            <input
                              type="text"
                              name="street"
                              value={address.street}
                              onChange={handleChange}
                              placeholder="ถนน / ซอย"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">หมู่</span>
                            </div>
                            <input
                              type="text"
                              name="village"
                              value={address.village}
                              onChange={handleChange}
                              placeholder="หมู่"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ตำบล</span>
                            </div>
                            <input
                              type="text"
                              name="subdistrict"
                              value={address.subdistrict}
                              onChange={handleChange}
                              placeholder="ตำบล"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">อำเภอ</span>
                            </div>
                            <input
                              type="text"
                              name="district"
                              value={address.district}
                              onChange={handleChange}
                              placeholder="อำเภอ"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">จังหวัด</span>
                            </div>
                            <input
                              type="text"
                              name="city"
                              value={address.city}
                              onChange={handleChange}
                              placeholder="จังหวัด"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">ประเทศ</span>
                            </div>
                            <input
                              type="text"
                              name="country"
                              value={address.country}
                              onChange={handleChange}
                              placeholder="ประเทศ"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                        <div>
                          <label className="form-control w-full max-w-xs">
                            <div className="label">
                              <span className="label-text">รหัสไปรษณีย์</span>
                            </div>
                            <input
                              type="text"
                              name="postalCode"
                              value={address.postalCode}
                              onChange={handleChange}
                              placeholder="รหัสไปรษณีย์"
                              className="input input-bordered w-full"
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setOpenUpdateAddress(false)}
                          className="bg-red-500 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-red-700"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="submit"
                          className="bg-green-400 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-green-600"
                        >
                          แก้ไข
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="shadow-boxShadow p-10 rounded-lg my-5">
            {openUpdateBanking === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 rounded-lg p-5 transition-all duration-700 ease-in-out">
                <div className="flex flex-col">
                  <span className="text-sm">ชื่อธนาคาร</span>
                  <span className="text-lg mb-5">
                    {userData?.BankingName || "ไม่มีข้อมูล"}
                  </span>
                  <span className="text-sm">ชื่อบัญชี</span>
                  <span className="text-lg mb-5">
                    {userData?.BankingUsername} {userData?.BankingUserlastname}
                  </span>
                  <span className="text-sm">เลขบัญชี</span>
                  <span className="text-lg">
                    {userData?.BankingCode || "ไม่มีข้อมูล"}
                  </span>
                </div>
                <div onClick={() => setOpenUpdateBanking(true)}>
                  <button>
                    <FaEdit size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="shadow-boxShadow p-5 rounded-lg">
                  <div className="text-lg mb-5 font-bold">
                    <span>แก้ไขข้อมูลธนาคาร</span>
                  </div>
                  <form onSubmit={handleSubmitBanking}>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text w-20">ชื่อธนาคาร</span>
                          <select
                            name="BankingName"
                            value={updatedBankingInfo.BankingName}
                            onChange={() => handleBankingChange}
                            className="input input-bordered w-full"
                            required
                          >
                            <option value="">เลือกธนาคาร</option>
                            {banks.map((bank, index) => (
                              <option key={index} value={bank}>
                                {bank}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-col md:flex-col lg:flex-row">
                        <div className="flex-1">
                          <label className="label">
                            <span className="label-text w-20">ชื่อ</span>
                            <input
                              type="text"
                              name="BankingUsername"
                              value={updatedBankingInfo.BankingUsername}
                              onChange={handleBankingChange}
                              placeholder="ชื่อผู้ใช้"
                              className="input input-bordered w-full"
                              required
                            />
                          </label>
                        </div>
                        <div className="flex-1">
                          <label className="label">
                            <span className="label-text w-20">นามสกุล</span>
                            <input
                              type="text"
                              name="BankingUserlastname"
                              value={updatedBankingInfo.BankingUserlastname}
                              onChange={handleBankingChange}
                              placeholder="นามสกุลผู้ใช้"
                              className="input input-bordered w-full"
                              required
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text w-20">เลขบัญชี</span>
                          <input
                            type="text"
                            name="BankingCode"
                            value={updatedBankingInfo.BankingCode}
                            onChange={handleBankingChange}
                            placeholder="รหัสธนาคาร"
                            className="input input-bordered w-full"
                            required
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end mt-5">
                      <button
                        onClick={() => setOpenUpdateBanking(false)}
                        className="bg-red-500 mx-2 px-3 py-1 rounded-full text-white hover:bg-red-700"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-green-400 mx-2 px-3 py-1 rounded-full text-white hover:bg-green-600"
                      >
                        แก้ไข
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDeleteUser}
              className="p-3 bg-red-500 hover:bg-red-700 rounded-lg my-3 text-xs text-white"
            >
              ลบบัญชีผู้ใช้
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full p-20">
          <span className="loading loading-infinity loading-lg"></span>
          <span className="text-2xl">ไม่พบข้อมูล</span>
        </div>
      )}
    </div>
  );
};

export default myAccountBusiness;
