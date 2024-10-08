import { Schema, model, Document } from "mongoose";

export interface Booking extends Document {
  booker: Schema.Types.ObjectId;
  homestay?: Schema.Types.ObjectId;
  detail_offer: {
    image_room: {
      image: string;
    }[];
    name_type_room: string;
    totalPrice: number;
    adult: number;
    child: number;
    room: number;
    discount: number;
  }[];
  package?: Schema.Types.ObjectId;
  bookingStart: Date;
  bookingEnd: Date;
  night: number;
  bookingStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<Booking>(
  {
    booker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    homestay: {
      type: Schema.Types.ObjectId,
      ref: "HomeStay",
      required: false,
    },
    detail_offer: {
      type: [
        {
          name_type_room: { type: String, required: false },
          adult: { type: Number, required: false },
          child: { type: Number, required: false },
          room: { type: Number, required: false },
          discount: { type: Number, default: 0 },
          totalPrice: { type: Number },
          image_room: {
            type: [
              {
                image: { type: String },
              },
            ],
          },
        },
      ],
      required: false,
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: false,
    },
    bookingStart: {
      type: Date,
      required: true,
    },
    bookingEnd: {
      type: Date,
      required: true,
    },
    night: {
      type: Number,
    },
    bookingStatus: {
      type: String,
      required: true,
      enum: ["Confirmed", "Check-in", "Money-transferredUser" , "Money-transferredBusiness", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

const BookingModel = model<Booking>("Booking", BookingSchema);

export default BookingModel;
