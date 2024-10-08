import React, { useEffect, useState, useContext } from "react";
import axiosPublic from "../hook/axiosPublic";
import Card from "./Card-Recomment-HomeStay";
import { AuthContext } from "../AuthContext/auth.provider";

interface Image {
  image_upload: string;
}

interface Offer {
  price_homeStay: number;
}

interface Room {
  offer: Offer[];
}

interface Location {
  province_location: string;
}

interface Item {
  _id: string;
  image: Image[];
  room_type: Room[];
  location: Location[];
  name_package?: string;
  name_homestay?: string;
  price_package?: number;
  price_homestay?: number;
  type_homestay?: string;
}

const Filterpackage: React.FC = () => {
  const [dataHomeStays, setDataHomeStays] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [isType, setIsType] = useState<string>("");
  const [randomProvinces, setRandomProvinces] = useState<string[]>([]);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setLoadPage } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/homestay");
        const data = await response.data;
        if (data) {
          setDataHomeStays(data);
          setFilteredData(data);
          setRandomProvinces(getRandomProvinces(data, 3));
          setLoadPage(true);    
        } else {
          setLoadPage(false);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [setLoadPage]);

  const getRandomProvinces = (data: Item[], count: number): string[] => {
    const provinces = Array.from(
      new Set(data.map((item) => item.location[0].province_location))
    );
    const shuffledProvinces = provinces.sort(() => 0.5 - Math.random());
    return shuffledProvinces.slice(0, count);
  };

  const filterByProvince = (province: string) => {
    const filtered =
      province === ""
        ? dataHomeStays
        : dataHomeStays.filter(
            (item) => item.location[0].province_location === province
          );
    setFilteredData(filtered);
    setIsType(province);
  };

  return (
    <div className="container mx-auto mt-12 px-4">
      <h1 className="text-2xl font-semibold mb-4">
        Homestays Recommend
      </h1>
      <div className="flex gap-4 mb-4 flex-wrap">
        <button
          id="ทั้งหมด[H]"
          onClick={() => filterByProvince("")}
          className={`btn px-4 py-2 rounded-md ${
            isType === ""
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
          }`}
        >
          ทั้งหมด
        </button>
        {randomProvinces.map((province) => (
          <button
            id={province}
            key={province}
            onClick={() => filterByProvince(province)}
            className={`btn px-4 py-2 rounded-md ${
              isType === province
                ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
                : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
            }`}
          >
            {province}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.slice(0, 4).map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Filterpackage;
