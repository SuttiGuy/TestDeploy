import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RxExit } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { MdFamilyRestroom } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const [isPackage, setIsPackage] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<Date[]>([new Date(), new Date()]);
  const [showPeopleMenu, setShowPeopleMenu] = useState<boolean>(false);
  const [numPeople, setNumPeople] = useState<number>(1);
  const [numChildren, setNumChildren] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const navigate = useNavigate();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    setDateRange([tomorrow, dayAfterTomorrow]);
  }, []);

  const handleDateChange = (dates: Date[] | undefined | null) => {
    if (dates !== null && dates !== undefined) {
      const filteredDates = dates.filter((date): date is Date => date !== null);
      if (filteredDates.length === 2) {
        setDateRange(filteredDates);
        setShowCalendar(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("th-TH", { month: "long" });
    const buddhistYear = date.getFullYear() + 543;
    const shortYear = buddhistYear.toString().slice(-2);
    return `${day} ${month} ${shortYear}`;
  };

  const handleDecreasePeople = () => {
    if (numPeople > 0) {
      setNumPeople(numPeople - 1);
    }
  };

  const handleIncreasePeople = () => {
    setNumPeople(numPeople + 1);
  };

  const handleDecreaseChildren = () => {
    if (numChildren > 0) {
      setNumChildren(numChildren - 1);
    }
  };

  const handleIncreaseChildren = () => {
    setNumChildren(numChildren + 1);
  };

  const togglePeopleMenu = () => {
    setShowPeopleMenu(!showPeopleMenu);
    if (showCalendar) {
      setShowCalendar(false);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showPeopleMenu) {
      setShowPeopleMenu(false);
    }
  };

  const clickToPackage = () => {
    setIsPackage(true);
  };

  const clickToHome = () => {
    setIsPackage(false);
  };

  const handleSearch = () => {
    // ตรวจสอบจำนวนผู้ใหญ่และจำนวนรวม
    if (numPeople === 0 && numChildren === 0) {
      Swal.fire({
        icon: "warning",
        title: "จำนวนคนไม่ถูกต้อง",
        text: "กรุณาเพิ่มจำนวนผู้ใหญ่หรือเด็ก",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (numPeople === 0 && numChildren > 0) {
      Swal.fire({
        icon: "warning",
        title: "ไม่มีผู้ใหญ่",
        text: "กรุณาเพิ่มจำนวนผู้ใหญ่ด้วย",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const searchType = isPackage ? "Package" : "Homestay";
    const startDate = dateRange[0] ? formatDate(dateRange[0]) : "Not selected";
    const endDate = dateRange[1] ? formatDate(dateRange[1]) : "Not selected";
    const startDate_Time = dateRange[0];
    const endDate_Time = dateRange[1];
    const dataSearch = {
      searchText,
      numPeople,
      numChildren,
      dateRange: {
        startDate,
        endDate,
        startDate_Time,
        endDate_Time,
      },
      searchType,
    };
    navigate("/search/search-result", { state: { dataSearch } });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    } else {
      return;
    }
  };

  return (
    <div className="mx-auto">
      <div className="relative bg-white bg-opacity-50 p-6 rounded-[20px] w-full h-full flex flex-col items-center justify-center shadow-lg">
        <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
          <button
            id="button-homestaySearch-Select"
            className={`p-2 rounded-tl-[10px] rounded-bl-[10px] w-full ${
              !isPackage
                ? "bg-gradient-to-r from-primaryNoRole to-secondNoRole text-white"
                : "bg-white text-dark border border-whiteSmoke"
            }`}
            onClick={clickToHome}
          >
            ที่พัก
          </button>
          <button
            id="button-homestaySearch-noSelect"
            className={`p-2 rounded-tr-[10px] rounded-br-[10px] w-full ${
              isPackage
                ? "bg-gradient-to-r from-primaryNoRole to-secondNoRole text-white"
                : "bg-white text-dark border border-whiteSmoke"
            }`}
            onClick={clickToPackage}
          >
            แพ็คเกจ
          </button>
        </div>
        <div className="w-full h-1 my-5 bg-gradient-to-r from-primaryNoRole to-secondNoRole shadow-lg rounded-full" />
        <div className="flex items-center justify-center w-full relative">
          <input
            id="search-text"
            type="text"
            placeholder="ค้นหาที่พักที่สนใจ"
            className="bg-white text-dark p-2 mb-2 rounded-tl-[10px] rounded-bl-[10px] block h-[3.5rem] w-full"
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            id="search-Homestay"
            className="bg-gradient-to-r from-primaryNoRole to-secondNoRole p-2 mb-2 block text-white rounded-tr-[10px] rounded-br-[10px] w-40 h-[3.5rem]"
            onClick={handleSearch}
          >
            ค้นหา
          </button>
        </div>
        <div className="flex flex-col items-center justify-center mt-4 sm:flex-row sm:justify-between w-full">
          <div className="relative w-full mb-5">
            <button
              id="people-buttonHomstay"
              className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 w-full h-[5rem] sm:w-[16rem]"
              onClick={togglePeopleMenu}
            >
              <span className="flex items-center justify-center font-bold">
                <MdFamilyRestroom className="w-5 h-5 mr-3" />
                <span>ผู้ใหญ่</span>
                <span className="mx-2">{numPeople}</span>
                <span className="mr-3">/</span>
                <span>เด็ก</span>
                <span className="mx-2">{numChildren}</span>
              </span>
            </button>
            {showPeopleMenu && (
              <div className="flex items-start justify-center">
                <div className="absolute z-10 mt-2 bg-white text-dark text-darkmode-oneColor shadow-lg p-4 w-full rounded-[1.25rem] rounded-tl-[0rem]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <IoPeopleSharp className="w-5 h-5 mr-5" />
                      <span className="w-5 h-5">ผู้ใหญ่</span>
                    </div>
                    <div>
                      <button
                        id="Decrease[1]"
                        className="text-primaryBusiness rounded-full p-2 mr-2"
                        onClick={handleDecreasePeople}
                      >
                        -
                      </button>
                      <span className="text-lg">{numPeople}</span>
                      <button
                        id="Increase[1]"
                        className="text-primaryUser rounded-full p-2 ml-2"
                        onClick={handleIncreasePeople}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <LiaChildSolid className="w-5 h-5 mr-5" />
                      <span className="w-5 h-5">เด็ก</span>
                    </div>
                    <div>
                      <button
                        id="Decrease[2]"
                        className="text-primaryBusiness rounded-full p-2 mr-2"
                        onClick={handleDecreaseChildren}
                      >
                        -
                      </button>
                      <span className="text-lg">{numChildren}</span>
                      <button
                        id="Increase[2]"
                        className="text-primaryUser rounded-full p-2 ml-2"
                        onClick={handleIncreaseChildren}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-5" />
          <div className="relative w-full mb-5 flex flex-col items-center justify-center">
            <button
              id="date-buttonHomstay"
              className="bg-white text-dark rounded-[10px] p-2 mb-2 sm:mb-0 w-full h-[5rem] sm:w-[23rem]"
              onClick={toggleCalendar}
            >
              {dateRange[0] && dateRange[1] ? (
                <span className="flex items-center justify-center font-bold relative">
                  <RxExit className="w-5 h-5 mr-3" />
                  {formatDate(dateRange[0])}
                  <IoRemoveOutline className="w-5 h-5 mx-3 rotate-90" />
                  {formatDate(dateRange[1])}
                  <RxExit className="w-5 h-5 ml-3 transform -scale-x-100" />
                </span>
              ) : (
                <span className="font-bold flex items-center justify-center">
                  <RxExit className="w-5 h-5 mr-3" />
                  วันที่เช็คอิน - เช็คเอาท์
                </span>
              )}
            </button>
            {showCalendar && (
              <div className="flex items-start justify-center">
                <div className="absolute z-10 mt-2 bg-white text-dark text-darkmode-oneColor shadow-lg p-4 w-full rounded-[1.25rem] rounded-tr-[0rem]">
                  <div
                    id="Calendar"
                    className="flex items-center justify-center"
                  >
                    <Calendar
                      onChange={(dates) => {
                        if (dates) {
                          handleDateChange(dates as Date[]);
                        }
                      }}
                      value={[dateRange[0], dateRange[1]]}
                      selectRange={true}
                      minDate={tomorrow}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
