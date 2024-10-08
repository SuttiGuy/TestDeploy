import mongoose, { Schema, Document, Model } from "mongoose";

// กำหนด interface สำหรับ Package
export interface IPackage extends Document {
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
  homestay?: mongoose.Types.ObjectId;
  business_user: mongoose.Types.ObjectId;
  review_rating_package: number;
  status_sell_package: string;
}

// กำหนด Schema สำหรับ Package
const PackageSchema: Schema = new Schema(
  {
    name_package: { type: String, required: true },
    type_package: { type: String, required: true },
    max_people: { type: Number, required: true },
    detail_package: { type: String, required: true },
    activity_package: {
      type: [
        {
          activity_days: {
            type: [
              {
                activity_name: { type: String, required: true },
              },
            ],
            required: true,
          },
        },
      ],
      required: true,
    },
    time_start_package: { type: Date, required: true },
    time_end_package: { type: Date, required: true },
    policy_cancel_package: { type: String, required: true },
    location: {
      type: [
        {
          name_location: { type: String, required: true },
          province_location: { type: String, required: true },
          district_location: { type: String, required: true },
          subdistrict_location: { type: String, required: true },
          zipcode_location: { type: Number, required: true },
          latitude_location: { type: String, required: true },
          longitude_location: { type: String, required: true },
          radius_location: { type: Number, required: true },
        },
      ],
      required: true,
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
      required: true,
    },
    price_package: { type: Number, required: true },
    discount: { type: Number, required: true },
    homestay: { type: Schema.Types.ObjectId, ref: "Homestay" },
    business_user: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    review_rating_package: { type: Number, required: true },
    isChildren: { type: Boolean, required: true },
    isFood: { type: Boolean, required: true },
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

// สร้างโมเดลจาก Schema
const Package: Model<IPackage> = mongoose.model<IPackage>(
  "Package",
  PackageSchema
);

export default Package;
