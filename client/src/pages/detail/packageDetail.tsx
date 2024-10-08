import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosPrivateUser from "../../hook/axiosPrivateUser";

const PackageDetail = () => {
  const [item, setItem] = useState<any >([]);
  const { id } = useParams(); // Destructure id from useParams
  console.log(id);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosPrivateUser.get(`/package/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Error fetching package detail:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]); // Add id to dependency array

  if (!item) {
    return <p>No item data available</p>;
  }

  if (!item.image || item.image.length === 0) {
    return <p>No image available</p>;
  }


  // console.log(item.image[0].image_upload);
  
  return (<div>
      <img src={item.image[0].image_upload} alt="" />
  </div> 
  )
};

export default PackageDetail;
