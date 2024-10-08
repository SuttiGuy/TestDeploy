export interface Booker {
  _id: string;
  email: string;
  name: string;
  lastName: string;
}

export interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  room: number;
  discount: number;
  totalPrice: number;
  image_room: {
    image: string;
  }[];
}
export interface Image_room {
  _id: string;
  image: string;
}
export interface Facilities_Room {
  facilitiesName: string;
}

export interface Offer {
  price_homeStay: number;
  max_people: {
    adult: number;
    child: number;
  };
  discount: number;
  facilitiesRoom: Facilities_Room[];
  roomCount: number;
  quantityRoom: number;
}
export interface RoomType {
  name_type_room: string;
  bathroom_homeStay: number;
  bedroom_homeStay: number;
  sizeBedroom_homeStay: string;
  offer: Offer[];
  image_room: Image_room[];
}

export interface Facility {
  _id: string;
  facilities_name: string;
}
export interface Image {
  _id: string;
  image: string;
}
export interface Image_upload {
  _id: string;
  image_upload: string;
}
interface Location {
  name_location: string;
  province_location: string;
  house_no: string;
  village?: string;
  village_no: string;
  alley?: string;
  street?: string;
  district_location: string;
  subdistrict_location: string;
  zipcode_location: number;
  latitude_location: number;
  longitude_location: number;
  radius_location: number;
}

export interface HomeStay {
  _id: string;
  name_homeStay: string;
  room_type: RoomType[];
  max_people: number;
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: Location[];
  image: Image_upload[];
  business_user: string[]; // Assuming you use ObjectId as string
  review_rating_homeStay: number;
  facilities: Facility[];
  status_sell_homeStay: string;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
}



export interface BookingHomeStayBusinessProps {
  bookingData: Booking[];
}

export interface Reviewer {
  image: string;
  name: string;
  email: string;
}
export interface Review {
  _id: string;
  reviewer: Reviewer;
  content: string;
  rating: number;
  package: string;
  homestay: string;
  createdAt: string;
}

export interface Address {
  houseNumber: string;
  street: string;
  village: string;
  subdistrict: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
}
export interface User {
  _id?: string;
  name?: string;
  lastName?: string;
  businessName?: string;
  email: string;
  password: string;
  phone: string | undefined;
  image: string;
  address: Address[];
  birthday: Date;
  role: string;
}

export interface PaymentData {
  homeStayId: string;
  homeStayName: string;
  totalPrice: number;
  pricePerRoom: number;
  location: Location[];
  roomType: RoomType;
  offer: Offer;
  bookingUser: User;
  rating: number;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
  numberOfNights: number;
  startDate_Time: Date | null;
  endDate_Time: Date | null;
}

export interface DataNav {
  numPeople: number;
  numChildren: number;
  numRoom: number;
  dateRange: DateRange;
}

export interface IPackage {
  _id: string;
  name_package: string;
  type_package: string;
  max_people: number;
  detail_package: string;
  activity_package: {
    activity_days: {
      activity_name: string;
    }[];
  }[];
  time_start_package: Date;
  time_end_package: Date;
  policy_cancel_package: string;
  location: {
    name_location: string;
    province_location: string;
    district_location: string;
    subdistrict_location: string;
    zipcode_location: number;
    latitude_location: string;
    longitude_location: string;
    radius_location: number;
  }[];
  image: { image_upload: string }[];
  price_package: number;
  discount: number;
  homestay?: HomeStay;
  business_user: string;
  review_rating_package: number;
}

export interface Password {
  email: string;
  password: string;
  newPass: string;
  confirmPass: string;
}

export interface Business {
  _id?: string;
  name: string;
  lastName: string;
  businessName?: string;
  email: string;
  password: string;
  phone: string | undefined;
  image: string;
  address: Address[];
  birthday: Date;
  BankingName: string;
  BankingUsername: string;
  BankingUserlastname: string;
  BankingCode: string;
  role: string;
}

export interface DetailOffer {
  name_type_room: string;
  adult: number;
  child: number;
  discount: number;
  totalPrice: number;
  image_room: {
    image: string;
  }[];
}

export interface Activity {
  activity_days: {
    activity_name: string;
  }[];
}[];

export interface Booking {
  _id: string;
  booker: Booker;
  bookingStart: string;
  bookingEnd: string;
  bookingStatus: string;
  detail_offer: DetailOffer[];
  homestay: HomeStay;
  package: IPackage;
  night: number;
}
