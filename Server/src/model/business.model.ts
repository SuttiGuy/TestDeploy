import { Schema, model, Document } from "mongoose";

export interface Business extends Document {
  email: string;
  password: string;
  businessName: string;
  name: string;
  lastName: string;
  birthday: Date;
  phone: string;
  image: string;
  address: Address[];
  idcard: string;
  BankingName: string;
  BankingUsername: string;
  BankingUserlastname: string;
  BankingCode: string;
  isVerified: boolean;
  role: string;
}

export interface Address {
  houseNumber: string;
  village: string;
  street: string;
  district: string;
  subdistrict: string;
  city: string;
  country: string;
  postalCode: string;
}

const AddressSchema = new Schema<Address>({
  houseNumber: {
    type: String,
    default: "",
  },
  village: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  subdistrict: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  postalCode: {
    type: String,
    default: "",
  },
});

const BusinessSchema = new Schema<Business>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  businessName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  birthday: {
    type: Date,
    default: null,
  },
  phone: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    default:
      "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg",
  },
  address: {
    type: [AddressSchema],
    default: [
      {
        houseNumber: "-",
        village: "-",
        street: "-",
        subdistrict: "-",
        district: "-",
        city: "-",
        country: "-",
        postalCode: "-",
      },
    ],
  },
  idcard: {
    type: String,
    maxlength: 13,
    default: "",
  },
  BankingName: {
    type: String,
    default: "",
  },
  BankingUsername: {
    type: String,
    default: "",
  },
  BankingUserlastname: {
    type: String,
    default: "",
  },
  BankingCode: {
    type: String,
    default: "",
  },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["business"], default: "business" },
});

const BusinessModel = model<Business>("Business", BusinessSchema);
export default BusinessModel;
