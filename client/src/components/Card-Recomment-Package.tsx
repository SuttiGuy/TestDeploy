import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Image {
  image_upload: string;
}

interface Item {
  _id: string;
  image: Image[];
  name_package?: string;
  detail_package?: string;
  type_package?: string;
  price_package?: number;
  review_rating_package?: number;
}

interface CardProps {
  item: Item;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  const navigate = useNavigate();
  const seeDetail = (id: string) => {
    navigate(`/packageDetail/${id}`);
  };

  return (
    <div
      className="card-box max-w-full rounded overflow-hidden relative mx-6 my-6 h-full hover:scale-105 transform transition duration-300"
      onClick={() => seeDetail(item._id)}
    >
      <img
        id="imageCard-Package"
        src={item.image[0].image_upload}
        alt="images to cards"
        className="w-full h-[15rem] object-cover"
      />
      <div className="px-6 py-4">
        <div id="Name-Package" className="font-bold text-xl mb-2">
          {truncateText(item.name_package || "", 15)}
        </div>
        <p id="Type-Package" className="text-base">
          {truncateText(item.type_package || "", 30)}
        </p>
      </div>
      <div className="flex items-center justify-center mt-5">
        <div
          id="Stars-Package"
          className="absolute left-0 font-bold px-6 py-4 text-primaryUser"
        >
          <div className="flex">
            {renderStars(item.review_rating_package || 0)}
          </div>
        </div>
        <div
          id="Price-Package"
          className="absolute right-0 font-bold px-6 py-4"
        >
          <span className="mx-1">฿</span>
          {item.price_package}
        </div>
      </div>
    </div>
  );
};

export default Card;
