import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { RxExit } from "react-icons/rx";
import { IoRemoveOutline } from "react-icons/io5";
import { IoPeopleSharp } from "react-icons/io5";
import { LiaChildSolid } from "react-icons/lia";
import { MdFamilyRestroom } from "react-icons/md";
import { MdFilterList } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axiosPublic from "../../hook/axiosPublic";
import CardHomeStay from "../../components/Card-Search-HomeStay";
import CardPackage from "../../components/Card-Search-Package";
import { AuthContext } from "../../AuthContext/auth.provider";

interface Coordinate {
  _id: string;
}

interface Image {
  image_upload: string;
}
interface Location {
  name_location: string;
  province_location: string;
  house_no?: string;
  village?: string;
  village_no?: string;
  alley?: string;
  street?: string;
  district_location?: string;
  subdistrict_location?: string;
  latitude_location: string;
  zipcode_location?: number;
}

interface MaxPeople {
  adult: number;
  child: number;
}

interface Offer {
  price_homeStay: number;
  price_package: number;
  max_people: MaxPeople;
  roomCount: number;
}

interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  max_people: {
    adult: number;
    child: number;
  };
  roomCount: number;
  offer: Offer[];
}

interface Homestay {
  _id: string;
}

interface Item {
  _id: string;
  image: Image[];
  room_type: RoomType[];
  location: Location[];
  homestay: Homestay[];
  name_package?: string;
  name_homeStay?: string;
  price_package?: number;
  price_homestay?: number;
  type_homestay?: string;
  max_people?: number;
  review_rating_homeStay?: number;
  review_rating_package?: number;
  isChildren: boolean;
  isFood: boolean;
  time_start_package: Date;
}

interface MapData {
  HomeStay: Coordinate[];
  Packages: Coordinate[];
}

interface CoordinateHomeStay {
  _id: string;
  name_homeStay?: string;
  location?: Location[];
}

interface CoordinatePackages {
  _id: string;
  name_package?: string;
  location?: Location[];
}

const SearchResult: React.FC = () => {
  const location = useLocation();
  const dataSearch = location.state?.dataSearch;

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { mapData, drawerData, setDrawerData, setMapData } = authContext;

  const [isPackage, setIsPackage] = useState<boolean>(
    dataSearch?.searchType === "Homestay"
      ? false
      : dataSearch?.searchType === "Package"
      ? true
      : false
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(dataSearch?.dateRange.startDate_Time ?? null),
    new Date(dataSearch?.dateRange.endDate_Time ?? null),
  ]);
  const [showPeopleMenu, setShowPeopleMenu] = useState<boolean>(false);
  const [numPeople, setNumPeople] = useState<number>(
    dataSearch?.numPeople ?? 0
  );
  const [numChildren, setNumChildren] = useState<number>(
    dataSearch?.numChildren ?? 0
  );
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [dataHomeStays, setDataHomeStays] = useState<Item[]>([]);
  const [
    dataHomeStaysForPriceFilter,
    setDataHomeStaysdataHomeStaysForPriceFilter,
  ] = useState<Item[]>([]);
  const [dataPackageForPriceFilter, setDataPackagedataHomeStaysForPriceFilter] =
    useState<Item[]>([]);
  const [dataPackage, setDataPackage] = useState<Item[]>([]);
  const [homeStayCount, setHomeStayCount] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [sortText, setSortText] = useState<string | null>("กรองข้อมูล");
  const [packageCount, setPackageCount] = useState<number>(0);
  const PackageCount = React.useRef(0);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  //Filter Price
  useEffect(() => {
    if (drawerData?.drawerPrice.endPrice !== 0) {
      const filteredDataPackage = dataPackage.filter((offer) => {
        if (offer === undefined || offer.price_package === undefined) {
          return false;
        }

        const startPrice = drawerData?.drawerPrice?.startPrice ?? 0;
        const endPrice = drawerData?.drawerPrice?.endPrice ?? Number.MAX_VALUE;

        return (
          offer.price_package > startPrice && offer.price_package <= endPrice
        );
      });

      const validDataPackage = filteredDataPackage.filter(
        (item) => item !== undefined
      );

      const sortedDataPackage = validDataPackage.sort((a, b) => {
        const priceA = a.price_package ?? Infinity;
        const priceB = b.price_package ?? Infinity;

        return priceA - priceB;
      });

      const formattedData = dataHomeStays
        .map((location) => {
          const allOffers = location.room_type.flatMap(
            (roomType) => roomType.offer
          );

          const filteredOffers = allOffers.filter((offer) => {
            if (!offer || offer.price_homeStay === undefined) return false;

            const startPrice = drawerData?.drawerPrice?.startPrice ?? 0;
            const endPrice =
              drawerData?.drawerPrice?.endPrice ?? Number.MAX_VALUE;

            return (
              offer.price_homeStay >= startPrice &&
              offer.price_homeStay <= endPrice
            );
          });

          if (filteredOffers.length > 0) {
            return {
              ...location,
              room_type: location.room_type.map((roomType) => ({
                ...roomType,
                offer: roomType.offer.filter((offer) =>
                  filteredOffers.includes(offer)
                ),
              })),
            };
          }

          return null;
        })
        .filter((location) => location !== null);

      const nonNullFormattedData = formattedData.filter(
        (item): item is Item => item !== null
      );

      if (Array.isArray(nonNullFormattedData)) {
        setDataHomeStaysdataHomeStaysForPriceFilter(nonNullFormattedData);
      } else {
        console.error("Formatted data contains null values or is not an array");
      }
      setDataPackagedataHomeStaysForPriceFilter(sortedDataPackage);
    } else {
      setDataHomeStaysdataHomeStaysForPriceFilter([]);
      setDataPackagedataHomeStaysForPriceFilter([]);
    }
  }, [drawerData, dataHomeStays, dataPackage]);

  //Set Start Loads null in page
  useEffect(() => {
    return () => {
      setDrawerData(null);
      setMapData(null);
    };
  }, []);

  //FillData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseHomestay = await axiosPublic.get("/homestay");
        const responsePackage = await axiosPublic.get("/package");
        const dataHomestay = await responseHomestay.data;
        const dataPackage = await responsePackage.data;
        const searchMessage = await dataSearch;
        const searchMessageDrawer = drawerData;

        let HomeStayData = [];
        let PackageData = [];
        if (mapData) {
          const dataforFilter: MapData[] = mapData.coordinates;

          if (drawerData != null) {
            const filteredResultsHomestay = dataforFilter[0].HomeStay.filter(
              (item: CoordinateHomeStay) =>
                (item.name_homeStay
                  ?.toLowerCase()
                  .includes(
                    searchMessageDrawer?.drawerTextSearch?.toLowerCase() ?? ""
                  ) ??
                  false) ||
                (item.location &&
                  item.location.length > 0 &&
                  item.location[0]?.province_location?.toLowerCase() ===
                    searchMessageDrawer?.drawerTextSearch?.toLowerCase())
            );

            HomeStayData = filteredResultsHomestay;

            const filteredResultsPackage = dataforFilter[0].Packages.filter(
              (item: CoordinatePackages) =>
                (item.name_package
                  ?.toLowerCase()
                  .includes(
                    searchMessageDrawer?.drawerTextSearch.toLowerCase() ?? ""
                  ) ??
                  false) ||
                (item.location &&
                  item.location.length > 0 &&
                  item.location[0]?.province_location?.toLowerCase() ===
                    searchMessageDrawer?.drawerTextSearch?.toLowerCase())
            );

            PackageData = filteredResultsPackage;
          } else {
            HomeStayData = dataforFilter[0].HomeStay;
            PackageData = dataforFilter[0].Packages;
          }
        } else {
          const filteredResultsHomestay = dataHomestay.filter((item: Item) => {
            const searchText =
              searchMessageDrawer && searchMessageDrawer.drawerTextSearch
                ? searchMessageDrawer.drawerTextSearch.toLowerCase()
                : searchMessage.searchText.toLowerCase();

            return (
              (item.name_homeStay?.toLowerCase().includes(searchText) ??
                false) ||
              item.location[0]?.province_location?.toLowerCase() === searchText
            );
          });

          HomeStayData = filteredResultsHomestay;

          const filteredResultsPackage = dataPackage.filter((item: Item) => {
            const searchText =
              searchMessageDrawer && searchMessageDrawer.drawerTextSearch
                ? searchMessageDrawer.drawerTextSearch.toLowerCase()
                : searchMessage.searchText.toLowerCase();

            return (
              (item.name_package?.toLowerCase().includes(searchText) ??
                false) ||
              item.location[0]?.province_location?.toLowerCase() === searchText
            );
          });

          PackageData = filteredResultsPackage;
        }
        setDataHomeStays(HomeStayData);
        setDataPackage(PackageData);
        setHomeStayCount(HomeStayData.length);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataSearch, mapData, drawerData]);

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
    if (numPeople > 1) {
      setNumPeople(numPeople - 1);
    } else {
      return;
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
    if (showFilterMenu) {
      setShowFilterMenu(false);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showPeopleMenu) {
      setShowPeopleMenu(false);
    }
    if (showFilterMenu) {
      setShowFilterMenu(false);
    }
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
    if (showCalendar) {
      setShowCalendar(false);
    }
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

  const sortData = (data: Item[]) => {
    if (!sortOption) return data;

    const sortedData = [...data];

    switch (sortOption) {
      case "ราคามากไปน้อย":
        return sortedData.sort((a, b) => {
          const offersA = a.room_type?.[0]?.offer || [];
          const offersB = b.room_type?.[0]?.offer || [];

          const minPriceA = offersA.length
            ? Math.min(...offersA.map((o) => o.price_homeStay))
            : Infinity;

          const minPriceB = offersB.length
            ? Math.min(...offersB.map((o) => o.price_homeStay))
            : Infinity;

          const packagePriceA = a.price_package ?? Infinity;
          const packagePriceB = b.price_package ?? Infinity;

          return minPriceB - minPriceA || packagePriceB - packagePriceA;
        });
      case "ราคาน้อยไปมาก":
        return sortedData.sort((a, b) => {
          const offersA = a.room_type?.[0]?.offer || [];
          const offersB = b.room_type?.[0]?.offer || [];

          const minPriceA = offersA.length
            ? Math.min(...offersA.map((o) => o.price_homeStay))
            : Infinity;

          const minPriceB = offersB.length
            ? Math.min(...offersB.map((o) => o.price_homeStay))
            : Infinity;

          const packagePriceA = a.price_package ?? Infinity;
          const packagePriceB = b.price_package ?? Infinity;

          return minPriceA - minPriceB || packagePriceA - packagePriceB;
        });

      case "คะแนนมากไปน้อย":
        return sortedData.sort(
          (a, b) =>
            (b.review_rating_homeStay ?? b.review_rating_package ?? 0) -
            (a.review_rating_homeStay ?? a.review_rating_package ?? 0)
        );
      case "คะแนนน้อยไปมาก":
        return sortedData.sort(
          (a, b) =>
            (a.review_rating_homeStay ?? a.review_rating_package ?? 0) -
            (b.review_rating_homeStay ?? b.review_rating_package ?? 0)
        );
      default:
        return data;
    }
  };

  const handleFilterClick = (filter: string) => {
    setSortOption(filter);
    setSortText(filter);
    setShowFilterMenu(false);
  };

  const filterByDate = (items:Item[]) => {
    const filteredItems = items.filter((item) => {
      const startDate = new Date(item.time_start_package);
      if (!item.isChildren && numChildren > 0) {
        return false;
      } else if (item.max_people && numPeople > item.max_people) {
        return false;
      } else {
        return startDate >= dateRange[0] && startDate <= dateRange[1];
      }
    });
    PackageCount.current = filteredItems.length;
    return filteredItems;
  };

  useEffect(() => {
    setPackageCount(PackageCount.current);
  }, [numPeople, numChildren, dataPackage, dataPackageForPriceFilter]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full mt-10">
      <div id="main-search" className="w-full my-5">
        <div className="flex items-center justify-center w-full shadow-lg rounded-[10px]">
          <button
            id="button-homestaySearch-Select"
            className={
              !isPackage
                ? "bg-gradient-to-r from-primaryNoRole to-secondNoRole text-white p-2 rounded-tl-[10px] rounded-bl-[10px] w-full"
                : "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToHome}
          >
            ที่พัก (
            {(drawerData?.drawerPrice?.endPrice ?? 0) > 0
              ? dataHomeStaysForPriceFilter.length
              : homeStayCount}
            )
          </button>
          <button
            id="button-homestaySearch-noSelect"
            className={
              !isPackage
                ? "card-box p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
                : "bg-gradient-to-r from-primaryNoRole to-secondNoRole text-white p-2 rounded-tr-[10px] rounded-br-[10px] w-full"
            }
            onClick={clickToPackage}
          >
            แพ็คเกจ ({packageCount})
          </button>
        </div>
        <div id="header">
          <div className="flex flex-col items-center justify-between mt-4 xl:flex-row w-full">
            <div className="relative w-full flex justify-start">
              <button
                id="people-buttonPackage"
                className="card-box text-xs sm:text-sm rounded-[10px] p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem] shadow-md"
                onClick={togglePeopleMenu}
              >
                <span className="flex items-center justify-center font-bold">
                  <MdFamilyRestroom className="w-4 h-4 mr-2 sm:mr-3" />
                  <span>ผู้ใหญ่</span>
                  <span className="mx-1 sm:mx-2">{numPeople}</span>
                  <span className="mr-2 sm:mr-3">/</span>
                  <span>เด็ก</span>
                  <span className="mx-1 sm:mx-2">{numChildren}</span>
                </span>
              </button>
              {showPeopleMenu && (
                <div className="flex items-start justify-center">
                  <div className="absolute left-0 z-10 mt-[4.5rem] semi-bg shadow-2xl p-4 w-full rounded-[1.25rem] rounded-tl-[0rem]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <IoPeopleSharp className="w-5 h-5 mr-5" />
                        <span className="w-5 h-5">ผู้ใหญ่</span>
                      </div>
                      <div>
                        <button
                          className="text-primaryBusiness rounded-full p-2 mr-2"
                          onClick={handleDecreasePeople}
                        >
                          -
                        </button>
                        <span className="text-lg">{numPeople}</span>
                        <button
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
                          className="text-primaryBusiness rounded-full p-2 mr-2"
                          onClick={handleDecreaseChildren}
                        >
                          -
                        </button>
                        <span className="text-lg">{numChildren}</span>
                        <button
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
            <div className="my-3" />
            <div className="relative w-full flex justify-center mx-10">
              <button
                id="date-buttonHomstay"
                className="card-box text-xs sm:text-sm rounded-[10px] p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem] shadow-md"
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
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-[4.5rem] left-0 right-0 semi-bg text-dark shadow-lg p-4 w-full rounded-[1.25rem]">
                    <div className="flex items-center justify-center">
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
            <div className="my-3" />
            <div className="relative w-full flex justify-end">
              <button
                id="sort-buttonPackage"
                className="card-box text-xs sm:text-sm rounded-[10px] p-1 sm:p-2 mb-2 sm:mb-0 w-full h-[4rem] sm:h-[4rem] shadow-md"
                onClick={toggleFilterMenu}
              >
                <span className="flex items-center justify-center font-bold">
                  <MdFilterList className="w-4 h-4 mr-2 sm:mr-3" />
                  <span>{sortText}</span>
                </span>
              </button>
              {showFilterMenu && (
                <div className="flex items-start justify-center">
                  <div className="absolute z-10 mt-[4.5rem] right-0 semi-bg shadow-lg p-4 w-full rounded-[1.25rem] rounded-tr-[0rem]">
                    <div className="flex flex-col items-start">
                      <button
                        id="PriceHightToLow"
                        className="w-full text-left p-2 hover:bg-gradient-to-r from-primaryNoRole to-secondNoRole rounded"
                        onClick={() => handleFilterClick("ราคามากไปน้อย")}
                      >
                        ราคามากไปน้อย
                      </button>
                      <button
                        id="PriceLowToHight"
                        className="w-full text-left p-2 hover:bg-gradient-to-r from-primaryNoRole to-secondNoRole rounded"
                        onClick={() => handleFilterClick("ราคาน้อยไปมาก")}
                      >
                        ราคาน้อยไปมาก
                      </button>
                      <button
                        id="StarHightToLow"
                        className="w-full text-left p-2 hover:bg-gradient-to-r from-primaryNoRole to-secondNoRole rounded"
                        onClick={() => handleFilterClick("คะแนนมากไปน้อย")}
                      >
                        คะแนนมากไปน้อย
                      </button>
                      <button
                        id="StarLowToHight"
                        className="w-full text-left p-2 hover:bg-gradient-to-r from-primaryNoRole to-secondNoRole rounded"
                        onClick={() => handleFilterClick("คะแนนน้อยไปมาก")}
                      >
                        คะแนนน้อยไปมาก
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full h-full">
          {isPackage ? (
            <div className="w-full">
              {dataPackage.length > 0 ? (
                <>
                  {(drawerData?.drawerPrice?.endPrice ?? 0) > 0 ? (
                    <>
                      {sortData(filterByDate(dataPackageForPriceFilter)).map(
                        (item, index) => (
                          <div key={index} className="w-full">
                            <CardPackage
                              item={item}
                              numPeople={numPeople}
                              numChildren={numChildren}
                              dateRange={dateRange}
                            />
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <>
                      {sortData(filterByDate(dataPackage)).map(
                        (item, index) => (
                          <div key={index} className="w-full">
                            <CardPackage
                              item={item}
                              numPeople={numPeople}
                              numChildren={numChildren}
                              dateRange={dateRange}
                            />
                          </div>
                        )
                      )}
                    </>
                  )}
                </>
              ) : (
                <div
                  id="Package_notFound"
                  className="flex items-center justify-center h-[40rem]"
                >
                  <span>NOT FOUND PACKAGE</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              {dataHomeStays.length > 0 ? (
                <>
                  {(drawerData?.drawerPrice?.endPrice ?? 0) > 0 ? (
                    <>
                      {sortData(dataHomeStaysForPriceFilter).map(
                        (item, index) => (
                          <div key={index} className="w-full">
                            <CardHomeStay
                              item={item}
                              numPeople={numPeople}
                              numChildren={numChildren}
                              dateRange={dateRange}
                            />
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <>
                      {sortData(dataHomeStays).map((item, index) => (
                        <div key={index} className="w-full">
                          <CardHomeStay
                            item={item}
                            numPeople={numPeople}
                            numChildren={numChildren}
                            dateRange={dateRange}
                          />
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div
                  id="Homestay_notFound"
                  className="flex items-center justify-center h-[40rem]"
                >
                  <span>NOT FOUND HOMESTAY</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
