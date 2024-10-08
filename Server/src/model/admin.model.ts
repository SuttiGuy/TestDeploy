import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface Admin extends Document {
  email: string;
  password: string;
  name: string;
  lastName: string;
  birthday: Date;
  phone: string;
  image: string;
  isVerified: boolean;
  role: string;
}

const AdminSchema = new Schema<Admin>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
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
    minlength: 12,
    maxlength: 12,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/previews/022/123/337/original/user-icon-profile-icon-account-icon-login-sign-line-vector.jpg",
    required: true,
  },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["admin"], default: "admin" },
});

const AdminModel = model<Admin>("Admin", AdminSchema);
export default AdminModel;
