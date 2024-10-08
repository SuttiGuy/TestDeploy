import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext/auth.provider";
import { useContext } from "react";

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
  name_homeStay?: string;
  detail_homeStay?: string;
  price_homestay?: number;
  review_rating_homeStay?: number;
}

interface CardProps {
  item: Item;
}

const Card: React.FC<CardProps> = ({ item }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/homeStayDetail/${item._id}`);
  };

  return (
    <div>
      {item ? (
            <div
            className="card-box max-w-full rounded overflow-hidden shadow relative mx-6 my-6 h-full hover:scale-105 transform transition duration-300"
          >
            <div onClick={handleCardClick}>
              <img
                id="imageCard-Home"
                src={item?.image[0].image_upload}
                alt="images to cards"
                className="w-full h-[15rem] object-cover"
              />
      
              <div id="detailCard-Home" className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  {truncateText(item.name_homeStay || "", 15)}
                </div>
                <p id="Province-HomeStay" className="text-base">
                  {truncateText(item?.location[0].province_location || "", 30)}
                </p>
              </div>
              <div className="flex items-center justify-center mt-5">
                <div
                  id="Stars-HomeStay"
                  className="absolute left-0 font-bold px-6 py-4 text-primaryUser"
                >
                  <div className="flex">
                    {renderStars(item?.review_rating_homeStay || 0)}
                  </div>
                </div>
                <div
                  id="Price-HomeStay"
                  className="absolute right-0 font-bold px-6 py-4"
                >
                  <span className="mx-1">฿</span>
                  {item?.room_type[0].offer[0].price_homeStay || 0}
                </div>
              </div>
            </div>
          </div>
      ): (
        <div>

        </div>
      )}
    </div>

  );
};

export default Card;
