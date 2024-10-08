import React, { useEffect, useState, useContext } from "react";
import axiosPublic from "../hook/axiosPublic";
import { AuthContext } from "../AuthContext/auth.provider";
import Card from "./Card-Recomment-Package";

interface Image {
  image_upload: string;
}

interface Item {
  _id: string;
  image: Image[];
  name_package?: string;
  detail_package?: string;
  price_package?: number;
  type_package?: string;
}

const Filterpackage: React.FC = () => {
  const [dataPackage, setDataPackage] = useState<Item[]>([]);
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [isType, setIsType] = useState<string>("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setLoadPage } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPublic.get("/package");
        const data = await response.data;
        if (data) {
          setDataPackage(data);
          setFilteredData(data);
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

  const filterByType = (type: string) => {
    const filtered =
      type === ""
        ? dataPackage
        : dataPackage.filter((item) => item.type_package === type);
    setFilteredData(filtered);
    setIsType(type);
  };

  return (
    <div className="container mx-auto my-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Recommended Packages</h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          id="ทั้งหมด[P]"
          onClick={() => filterByType("")}
          className={`btn px-4 py-2 rounded-md ${
            isType === ""
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
          }`}
        >
          ทั้งหมด
        </button>
        <button
          id="การท่องเที่ยวธรรมชาติ"
          onClick={() => filterByType("การท่องเที่ยวธรรมชาติ")}
          className={`btn px-4 py-2 rounded-md ${
            isType === "การท่องเที่ยวธรรมชาติ"
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
          }`}
        >
          ธรรมชาติ
        </button>
        <button
          id="ทางน้ำ"
          onClick={() => filterByType("การท่องเที่ยวทางน้ำ")}
          className={`btn px-4 py-2 rounded-md ${
            isType === "การท่องเที่ยวทางน้ำ"
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
          }`}
        >
          ทางน้ำ
        </button>
        <button
          id="วัฒนธรรม"
          onClick={() => filterByType("การท่องเที่ยวเชิงวัฒนธรรม")}
          className={`btn px-4 py-2 rounded-md ${
            isType === "การท่องเที่ยวเชิงวัฒนธรรม"
              ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white"
              : "border border-blue-500 text-blue-500 hover:bg-gradient-to-r from-blue-500 to-teal-400 hover:text-white menu-SupportDarkMode"
          }`}
        >
          วัฒนธรรม
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.slice(0, 4).map((item) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Filterpackage;
