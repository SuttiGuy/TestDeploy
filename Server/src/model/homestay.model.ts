import { Schema, model, Document } from "mongoose";

interface HomeStay extends Document {
  name_homeStay: string;
  room_type: {
    image_room: {
      image: string;
    }[];
    name_type_room: string;
    bathroom_homeStay: number;
    bedroom_homeStay: number;
    sizeBedroom_homeStay: string;
    Offer: {
      price_homeStay: number;
      max_people: {
        adult: number;
        child: number;
      };
      discount: number;
      facilitiesRoom: {
        facilitiesName: string;
      }[];
      roomCount: number;
      quantityRoom: number;
    }[];
  }[];
  detail_homeStay: string;
  time_checkIn_homeStay: string;
  time_checkOut_homeStay: string;
  policy_cancel_homeStay: string;
  location: {
    name_location: string;
    province_location: string;
    house_no: string;
    village: string;
    village_no: string;
    alley: string;
    street: string;
    district_location: string;
    subdistrict_location: string;
    zipcode_location: number;
    latitude_location: string;
    longitude_location: string;
    radius_location: number;
  }[];
  image: { image_upload: string }[];
  business_user: Schema.Types.ObjectId[];
  review_rating_homeStay: number;
  facilities: { facilities_name: string }[];
  status_sell_homeStay: string;
  createdAt: Date;
  updatedAt: Date;
}

const HomeStaySchema = new Schema<HomeStay>(
  {
    name_homeStay: {
      type: String,
      required: true,
    },
    room_type: {
      type: [
        {
          name_type_room: { type: String, required: true },
          bathroom_homeStay: { type: Number, required: true },
          bedroom_homeStay: { type: Number, required: true },
          sizeBedroom_homeStay: { type: String, required: true },
          image_room: {
            type: [
              {
                image: { type: String },
              },
            ],
          },
          offer: {
            type: [
              {
                price_homeStay: { type: Number, required: true },
                max_people: {
                  type: {
                    adult: Number,
                    child: Number,
                  },
                },
                discount: { type: Number, default: 0 },
                facilitiesRoom: {
                  type: [
                    {
                      facilitiesName: {
                        type: String,
                        required: true,
                      },
                    },
                  ],
                },
                roomCount: { type: Number },
                quantityRoom: { type: Number, default: 1 },
              },
            ],
          },
        },
      ],
    },
    detail_homeStay: {
      type: String,
      required: true,
    },
    time_checkIn_homeStay: {
      type: String,
      required: true,
    },
    time_checkOut_homeStay: {
      type: String,
      required: true,
    },
    policy_cancel_homeStay: {
      type: String,
      required: true,
    },
    location: {
      type: [
        {
          name_location: { type: String, required: true },
          province_location: { type: String, required: true },
          house_no: { type: String, required: true },
          village: { type: String, required: false },
          village_no: { type: String, required: true },
          alley: { type: String, required: false },
          street: { type: String, required: false },
          district_location: { type: String, required: true },
          subdistrict_location: { type: String, required: true },
          zipcode_location: { type: Number, required: true },
          latitude_location: { type: String, required: true },
          longitude_location: { type: String, required: true },
          radius_location: { type: Number, required: true },
        },
      ],
    },
    image: {
      type: [
        {
          image_upload: {
            type: String,
            required: true,
          },
        },
      ],
    },
    business_user: [
      {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },
    ],
    review_rating_homeStay: {
      type: Number,
      required: true,
    },
    facilities: [
      {
        facilities_name: {
          type: String,
          required: true,
        },
      },
    ],
    status_sell_homeStay: {
      type: String,
      required: true,
      enum: ["Ready", "NotReady"],
      default: "Ready",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const HomeStayModel = model<HomeStay>("HomeStay", HomeStaySchema);
export default HomeStayModel;
