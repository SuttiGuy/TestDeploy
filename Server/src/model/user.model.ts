import { Schema, model, Document } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  lastName: string;
  birthday?: Date;
  phone: string;
  image?: string;
  address: Address[];
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

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
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
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user"],
    default: "user",
  },
});

const UserModel = model<User>("User", UserSchema);

export default UserModel;
