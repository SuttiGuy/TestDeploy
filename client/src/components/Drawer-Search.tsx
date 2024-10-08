import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import OpenStreetMap from "./OpenStreetMap";
import { RxHamburgerMenu, RxArrowLeft, RxArrowRight } from "react-icons/rx";
import { AuthContext } from "../AuthContext/auth.provider";

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

const Drawer: React.FC = () => {
  const [minValue, setMinValue] = useState(0);
  const [rangeValue, setRangeValue] = useState(25000);
  const [searchText, setSearchText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const inputRef = useRef<HTMLInputElement>(null);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { mapData, setDrawerData } = authContext;

  const handleMinBlur = () => {
    if (isNaN(minValue)) {
      setMinValue(0);
    }
    handleSearch();
  };
  
  const handleRangeBlur = () => {
    if (isNaN(rangeValue)) {
      setRangeValue(minValue);
    }else if(rangeValue < minValue){
      setRangeValue(minValue);
    }
    handleSearch();
  };

  
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '') {
      setMinValue(NaN);
    } else {
      setMinValue(parseInt(value, 10));
      

      if (rangeValue < parseInt(value, 10)) {
        setRangeValue(parseInt(value, 10));
      }
    }
  };
  
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '') {
      setRangeValue(NaN);
    }else{
      setRangeValue(parseInt(value, 10));
    }
  };
  
  const handleRangeMouseUp = () => {
    handleSearch();
  };
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    if (mapData?.places) {
      setData(mapData.places);
    }
  }, [mapData]);

  const handleSearch = useCallback(() => {
    const dataSearch = {
      drawerTextSearch: searchText,
      drawerPrice: {
        startPrice: minValue,
        endPrice: rangeValue,
      },
    };

    setDrawerData(dataSearch);
  }, [searchText, rangeValue, minValue, setDrawerData]);

  useEffect(() => {
    handleSearch();
  }, [searchText]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (inputRef.current) {
        const currentValue = inputRef.current.value.trim();

        if (currentValue === "") {
          setSearchText("");
        } else {
          setSearchText(currentValue);
        }

        inputRef.current.value = "";
      }
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentPage = Math.floor(currentIndex / itemsPerPage) + 1;

  const handleNext = () => {
    if (currentPage === totalPages) {
      setCurrentIndex(0); // Go to the first page
    } else {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (currentPage === 1) {
      setCurrentIndex((totalPages - 1) * itemsPerPage); // Go to the last page
    } else {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const displayedData = data.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div>
      <div className="md:w-1/4">
        <div className="drawer xl:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col items-center justify-center">
            <label
              id="HamburgerMenu"
              htmlFor="my-drawer-2"
              className="btn btn-circle btn-primary drawer-button xl:hidden bg-gradient-to-b from-primaryNoRole to-secondNoRole"
            >
              <RxHamburgerMenu />
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer-2"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="menu p-4 w-[85%] xl:w-96 min-h-full text-xl menu-SupportDarkMode">
              <div className="w-full ">
                <div className="w-full flex items-center justify-center my-5">
                  <input
                    id="SearchAll"
                    type="text"
                    ref={inputRef}
                    placeholder="ค้นหาสิ่งที่สนใจ"
                    className="input text-sm p-2 mb-2 rounded-md block w-full shadow-lg border border-whiteSmoke focus:ring-2 focus:ring-primary-500 focus:border-transparent transition duration-150 ease-in-out"
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-full flex items-center justify-center my-5 h-52 shadow-lg">
                  <OpenStreetMap />
                </div>
                <div className="w-full rounded-md shadow-lg relative card-box">
                  <div className="flex flex-col w-full h-full text-sm">
                    <span className="font-bold text-lg mt-5 mx-5">
                      ช่วงราคา (ห้อง / คืน)
                    </span>
                    <div className="w-[100%] flex flex-col items-center justify-center my-5">
                      <div className="w-[80%] mb-3 flex items-center">
                        <span className="flex justify-start">
                          เริ่มต้น: {isNaN(minValue) ? 0 : minValue}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="MinrangePrice"
                        name="MinrangePrice"
                        min="0"
                        max="25000"
                        value={minValue}
                        onChange={handleMinChange}
                        onMouseUp={handleRangeMouseUp}
                        className="w-[80%] accent-primaryBusiness"
                      />
                      <div className="w-[80%] my-3 flex items-center">
                        <span className="flex justify-end">
                          สูงสุด: {isNaN(rangeValue) ? 0 : rangeValue}
                        </span>
                      </div>
                      <input
                        type="range"
                        id="MaxrangePrice"
                        name="MaxrangePrice"
                        min="0"
                        max="25000"
                        value={rangeValue}
                        onChange={handleRangeChange}
                        onMouseUp={handleRangeMouseUp}
                        className="w-[80%] accent-primaryBusiness"
                      />
                      <div className="w-[80%] my-5 mx-3 flex items-center justify-between relative">
                      
                        <div className="relative w-32 z-10">
                          <input
                            id="minInput"
                            type="number"
                            min="0"
                            max="25000"
                            value={minValue}
                            onChange={handleMinChange}
                            onBlur={handleMinBlur}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch(); // Call your submit function here
                              }
                            }}
                            className="w-full h-8 px-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-700 text-sm transition-colors peer no-arrows"
                          />
                          <label
                            htmlFor="minInput"
                            className="absolute left-3 -top-2 bg-white px-1 text-gray-500 text-xs transition-all peer-focus:-top-3 peer-focus:text-blue-400"
                          >
                            Min
                          </label>
                        </div>

                        <div className="absolute inset-x-0 top-1/2 -translate-y-1 h-px border-t-2 border-dashed border-gray-300 z-0"></div>

                        <div className="relative w-32">
                          <input
                            id="maxInput"
                            type="number"
                            min="0"
                            max="25000"
                            value={rangeValue}
                            onChange={handleRangeChange}
                            onBlur={handleRangeBlur}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSearch(); // Call your submit function here
                              }
                            }}
                            className="w-full h-8 px-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-400 text-gray-700 text-sm transition-colors peer no-arrows"
                          />
                          <label
                            htmlFor="maxInput"
                            className="absolute left-3 -top-2 bg-white px-1 text-gray-500 text-xs transition-all peer-focus:-top-3 peer-focus:text-blue-400"
                          >
                            Max
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-md overflow-hidden shadow-lg relative my-5 h-full card-box">
                  <div className="flex flex-col w-full h-full text-sm">
                    <span className="font-bold text-lg my-5 mx-5">
                      สถานที่เที่ยวใกล้ที่พัก
                    </span>
                    {data.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mb-20 mt-12">
                        <label className="flex justify-start font-semibold">
                          ไม่พบข้อมูล
                        </label>
                        <p className="flex justify-end font-medium">
                          ( โปรดใช้ Map ในการค้นหาสถานที่ )
                        </p>
                      </div>
                    ) : (
                      <div className="mb-2">
                        {displayedData.map((item) => (
                          <p key={item} id={item} className="mx-10 mb-2">
                            <div className="flex items-center justify-start">
                              <label className="font-medium">
                                {truncateText(item, 35)}
                              </label>
                            </div>
                          </p>
                        ))}
                        <div className="flex justify-between items-center mx-5 mt-10 mb-5">
                          <button
                            id="BackDrawwer"
                            onClick={handlePrev}
                            disabled={data.length === 0}
                            className="w-8 h-8 bg-smoke text-white rounded-full flex justify-center items-center hover:bg-primaryBusiness hover:text-dark"
                          >
                            <RxArrowLeft size={20} />
                          </button>
                          <span className="text-sm font-semibold">
                            หน้า {currentPage} / {totalPages}
                          </span>
                          <button
                            id="NextDrawwer"
                            onClick={handleNext}
                            disabled={data.length === 0}
                            className="w-8 h-8 bg-smoke text-white rounded-full flex justify-center items-center hover:bg-primaryBusiness hover:text-dark"
                          >
                            <RxArrowRight size={20} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
