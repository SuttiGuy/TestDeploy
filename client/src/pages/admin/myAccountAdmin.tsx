import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../AuthContext/auth.provider";
import axiosPrivateUser from "../../hook/axiosPrivateAdmin";
import { TbPointFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { LuEye, LuEyeOff } from "react-icons/lu";
import axios from "axios";
import { BsCamera } from "react-icons/bs";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../Firebase/firebase.config";
import { FaEdit } from "react-icons/fa";
import { Password, User } from "../../type";

const myAccount = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo, setUserInfo } = authContext;
  // const [openUpdateFrom, setOpenUpdateFrom] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>();
  const [openUpdatePassword, setOpenUpdatePassword] = useState<boolean>(false);
  const [openUpdateBirthday, setOpenUpdateBirthday] = useState<boolean>(false);
  const [openUpdatePhone, setOpenUpdatePhone] = useState<boolean>(false);
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

  const [updatedUserInfo, setUpdatedUserInfo] = useState<User>({} as User);
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return ""; // Return empty string if date is undefined or falsy
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Return YYYY-MM-DD
  };

  const [dob, setDob] = useState(formatDate(userData?.birthday));
  const [phone, setPhone] = useState(userData?.phone);

  // Update dob when userData changes
  useEffect(() => {
    setDob(formatDate(userData?.birthday));
  }, [userData]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosPrivateUser.get(`/user/adminData`);
        const filteredData = response.data.filter((user : User) => user._id === userInfo?._id);
        console.log(filteredData[0]);
        setUserData(filteredData[0]);
        setPasswords({
          email: filteredData[0].email,
          password: "",
          newPass: "",
          confirmPass: "",
        });
        setUpdatedUserInfo(filteredData[0].data);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [
    userInfo?._id,
    openUpdateUser,
    openUpdateBirthday,
    openUpdatePhone,
  ]);

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswords((prevPassword) => ({
      ...prevPassword,
      [name]: value, // ตั้งค่า value โดยตรง
    }));
  };

  const handleSubmitBirthday = (e: React.FormEvent) => {
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
          await axiosPrivateUser.put(`/user/updateUser/${userInfo?._id}`, {
            role: userInfo?.role,
            birthday: dob,
          });
          setOpenUpdateBirthday(false);

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

  const handleSubmitPhone = (e: React.FormEvent) => {
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
            let formattedPhone = phone;

            // ถ้า phone เริ่มต้นด้วย '0' ให้ตัดออก
            if(formattedPhone){
              if (formattedPhone.startsWith('0')) {
                formattedPhone = formattedPhone.slice(1);
              }  
            }

          await axiosPrivateUser.put(`/user/updateUser/${userInfo?._id}`, {
            role: userInfo?.role,
            phone: `+66${formattedPhone}`,
          });
          setOpenUpdatePhone(false);

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
      const change = await axiosPrivateUser.put(
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
      await axiosPrivateUser.put(
        `/user/updateUser/${userInfo?._id}`,
        updatedUserInfo
      );
      // setUserInfo(updatedUserInfo)
      Swal.fire({
        title: "สำเร็จ!",
        text: "ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว.",
        icon: "success",
      });

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
      const response = await axiosPrivateUser.put(
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
          <div className="shadow-boxShadow pb-10  rounded-lg">
            {openUpdateUser === false ? (
              <div className="flex justify-between items-center hover:bg-gray-300 p-5">
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
                        src={userInfo?.image}
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

            <div className=" hover:bg-gray-300 p-5">
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
                  <div className="flex justify-between items-center hover:bg-gray-300 p-5 transition-all duration-700 ease-in-out">
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

            {openUpdateBirthday === false && openUpdatePhone === false ? (
              <div className="flex flex-row">
                <div className="w-1/2 flex justify-between items-center hover:bg-gray-300 p-5 transition-all duration-700 ease-in-out">
                  <div className="flex justify-between w-[50%] gap-5 items-center">
                    <div className="flex flex-col">
                      <span className="text-sm">วันเดือนปีเกิด</span>
                      <div className="mt-3">
                        <span>
                          {userData?.birthday
                            ? new Date(userData.birthday).toLocaleDateString(
                                "th-TH"
                              )
                            : "ยังไม่มีข้อมูล"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setOpenUpdateBirthday(true)}>
                    <button>
                      <FaEdit size={24} />
                    </button>
                  </div>
                </div>
                <div className="w-1/2 flex justify-between items-center hover:bg-gray-300 p-5 transition-all duration-700 ease-in-out">
                  <div className="flex justify-between w-[50%] gap-5 items-center">
                    <div className="flex flex-col">
                      <span className="text-sm">เบอร์โทร</span>
                      <div className="mt-3">
                        <span>
                          {userData?.phone ? userData?.phone : "ยังไม่มีข้อมูล"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div onClick={() => setOpenUpdatePhone(true)}>
                    <button>
                      <FaEdit size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ) : openUpdateBirthday === true ? (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="flex justify-between shadow-boxShadow p-5 rounded-lg">
                  <div>
                    <span className="text-sm">
                      วันเดือนปีเกิด (เลือกจากปฎิทิน)
                    </span>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="input input-bordered w-full mt-2"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end items-center">
                    <button
                      onClick={() => setOpenUpdateBirthday(false)}
                      className="bg-red-500 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-red-700 w-32 h-10 my-2"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSubmitBirthday}
                      className="bg-green-400 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-green-600 w-32 h-10 my-2"
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>
              </div>
            ) : openUpdatePhone === true ? (
              <div className="p-5 transition-all duration-700 ease-in-out">
                <div className="flex justify-between shadow-boxShadow p-5 rounded-lg">
                  <form
                    className="flex justify-between w-full"
                    onSubmit={handleSubmitPhone}
                  >
                    <div>
                      <span className="text-sm">
                        เบอร์โทร (กรุณากรอกเบอร์ที่ถูกต้อง)
                      </span>
                      <input
                        type="number"
                        placeholder="กรุณากรอกเบอร์มือถือ"
                        onChange={(e) => setPhone(e.target.value)}
                        className="input input-bordered w-full mt-2"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end items-center">
                      <button
                        onClick={() => setOpenUpdatePhone(false)}
                        className="bg-red-500 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-red-700 w-32 h-10 my-2"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-green-400 mx-2 px-3 w-18 py-1 rounded-full text-white hover:bg-green-600 w-32 h-10 my-2"
                      >
                        แก้ไข
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}

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

export default myAccount;
