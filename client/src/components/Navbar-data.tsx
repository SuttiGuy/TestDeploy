import { useState, useEffect } from "react";
import { MdFamilyRestroom } from "react-icons/md";
import { IoPeopleSharp, IoRemoveOutline } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { RxExit } from "react-icons/rx";
import Calendar from "react-calendar";
import { useLocation } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { usePaymentContext } from "../AuthContext/paymentContext";

const Navbar = () => {
  const location = useLocation();
  const sendSearchToDetail = location.state?.sendSearchToDetail;
  const { setDataNav } = usePaymentContext();

  const [showPeopleMenu, setShowPeopleMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [numPeople, setNumPeople] = useState<number>(
    sendSearchToDetail?.numPeople ?? 1
  );
  const [numChildren, setNumChildren] = useState<number>(
    sendSearchToDetail?.numChildren ?? 0
  );
  const [numRoom, setNumRoom] = useState<number>(
    sendSearchToDetail?.resultRoom ?? 1
  );

  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const initialStartDate = sendSearchToDetail?.dateRange?.startDate_Time
    ? new Date(sendSearchToDetail.dateRange.startDate_Time)
    : null;
  const initialEndDate = sendSearchToDetail?.dateRange?.endDate_Time
    ? new Date(sendSearchToDetail.dateRange.endDate_Time)
    : null;

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialStartDate,
    initialEndDate,
  ]);

  console.log(dateRange);
  
  const togglePeopleMenu = () => {
    setShowPeopleMenu(!showPeopleMenu);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowPeopleMenu(false);
  };

  const handleDecreasePeople = () =>
    setNumPeople(numPeople > 1 ? numPeople - 1 : 1);

  const handleIncreasePeople = () => setNumPeople(numPeople + 1);

  const handleDecreaseChildren = () =>
    setNumChildren(numChildren > 0 ? numChildren - 1 : 0);

  const handleIncreaseChildren = () => setNumChildren(numChildren + 1);

  const handleDecreaseRoom = () => setNumRoom(numRoom > 1 ? numRoom - 1 : 1);

  const handleIncreaseRoom = () => setNumRoom(numRoom + 1);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    setShowCalendar(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date";

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const startDate = dateRange[0] ? formatDate(dateRange[0]) : "Not selected";
  const endDate = dateRange[1] ? formatDate(dateRange[1]) : "Not selected";
  const startDate_Time = dateRange[0];
  const endDate_Time = dateRange[1];

  
  const calculateNights = (
    startDateTime?: Date | null,
    endDateTime?: Date | null
  ): number => {
    console.log(startDateTime);
    console.log(endDateTime);
    
    if (!startDateTime || !endDateTime) {
      console.error("Start date or end date is missing or invalid");
      return 0;
    }

    // ตรวจสอบว่าค่าเป็น Date หรือไม่ ถ้าไม่ใช่ให้แปลง
    const start =
      typeof startDateTime === "string"
        ? new Date(startDateTime)
        : startDateTime;
    const end =
      typeof endDateTime === "string" ? new Date(endDateTime) : endDateTime;

      console.log(start);
      console.log(end);
      
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error("Invalid start or end date");
      return 0;
    }

    const differenceInTime = end.getTime() - start.getTime();
  
    
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    console.log(differenceInDays);
    
    
    return differenceInDays;
  };

  

  const numberOfNights = calculateNights(startDate_Time, endDate_Time);
  // console.log(`จำนวนคืน: ${numberOfNights}`);

  useEffect(() => {
    const newDataNav = {
      numPeople: numPeople,
      numChildren: numChildren,
      numRoom: numRoom,
      dateRange: {
        startDate: startDate,
        endDate: endDate,
        startDate_Time: startDate_Time,
        endDate_Time: endDate_Time,
        numberOfNights: numberOfNights,
      },
    };

    setDataNav(newDataNav);
  }, [
    numPeople,
    numChildren,
    numRoom,
    startDate,
    endDate,
    startDate_Time,
    endDate_Time,
  ]);

  return (
    <nav className="bg-white-frosted sticky top-0 left-0 w-full z-40 shadow-b-md">
      <div className="flex flex-col items-center justify-between xl:flex-row w-full">
        {/* People Button */}
        <div className="relative w-full flex justify-start">
          <button
            id="people-buttonPackage"
            className="text-xs sm:text-sm p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem]"
            onClick={togglePeopleMenu}
          >
            <span className="flex items-center justify-center font-bold">
              <MdFamilyRestroom className="w-4 h-4 mr-2 sm:mr-3" />
              <span>ผู้ใหญ่</span>
              <span className="mx-1 sm:mx-2">{numPeople}</span>
              <span className="mr-2 sm:mr-3">/</span>
              <span>เด็ก</span>
              <span className="mx-1 sm:mx-2">{numChildren}</span>
              <span className="mr-2 sm:mr-3">/</span>
              <span>หลัง</span>
              <span className="mx-1 sm:mx-2">{numRoom}</span>
            </span>
          </button>
          {showPeopleMenu && (
            <div className="absolute left-0 z-10 mt-[4.5rem] semi-bg shadow-2xl p-4 w-full rounded-[1.25rem] rounded-tl-[0rem]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IoPeopleSharp className="w-5 h-5 mr-5" />
                  <span className="w-5 h-5">ผู้ใหญ่</span>
                </div>
                <div>
                  <button
                    id="DecreasePeople"
                    className="text-primaryBusiness rounded-full p-2 mr-2"
                    onClick={handleDecreasePeople}
                  >
                    -
                  </button>
                  <span className="text-lg">{numPeople}</span>
                  <button
                    id="IncreasePeople"
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
                    id="DecreaseChildren"
                    className="text-primaryBusiness rounded-full p-2 mr-2"
                    onClick={handleDecreaseChildren}
                  >
                    -
                  </button>
                  <span className="text-lg">{numChildren}</span>
                  <button
                    id="IncreaseChildren"
                    className="text-primaryUser rounded-full p-2 ml-2"
                    onClick={handleIncreaseChildren}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <GoHome className="w-5 h-5 mr-5" />
                  <span className="w-5 h-5">ห้อง</span>
                </div>
                <div>
                  <button
                    id="DecreaseRoom"
                    className="text-primaryBusiness rounded-full p-2 mr-2"
                    onClick={handleDecreaseRoom}
                  >
                    -
                  </button>
                  <span className="text-lg">{numRoom}</span>
                  <button
                    id="IncreaseRoom"
                    className="text-primaryUser rounded-full p-2 ml-2"
                    onClick={handleIncreaseRoom}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Date Button */}
        <div className="relative w-full flex justify-center">
          <button
            id="date-buttonHomstay"
            className="text-xs sm:text-sm p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem]"
            onClick={toggleCalendar}
          >
            {dateRange[0] && dateRange[1] ? (
              <span className="flex items-center justify-center font-bold relative">
                <RxExit className="w-4 h-4 mr-2 sm:mr-3" />
                {formatDate(dateRange[0])}
                <IoRemoveOutline className="w-4 h-4 mx-1 sm:mx-3 rotate-90" />
                {formatDate(dateRange[1])}
                <RxExit className="w-4 h-4 ml-2 sm:ml-3 transform -scale-x-100" />
              </span>
            ) : (
              <span className="font-bold flex items-center justify-center">
                <RxExit className="w-4 h-4 mr-2 sm:mr-3" />
                วันที่เช็คอิน - เช็คเอาท์
              </span>
            )}
          </button>
          {showCalendar && (
            <div className="absolute z-20 mt-[4.5rem] left-0 right-0 semi-bg text-dark shadow-lg p-4 w-full rounded-[1.25rem] rounded-tr-[0rem]">
              <div className="flex items-center justify-center">
                <Calendar
                  onChange={(dates) => {
                    if (dates) {
                      handleDateChange(dates as [Date | null, Date | null]);
                    }
                  }}
                  value={dateRange}
                  selectRange={true}
                  minDate={tomorrow}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
