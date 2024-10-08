import { Schema, model, Document } from "mongoose";

// Define the interface for the User schema
export interface Review extends Document {
  reviewer: Schema.Types.ObjectId;
  content: string;
  rating: number;
  package: Schema.Types.ObjectId;
  homestay: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<Review>({
  reviewer: {
    type: Schema.Types.ObjectId , ref:"User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  package: {
    type: Schema.Types.ObjectId , ref:"Package",
    default: null,
  },

  homestay: {
    type:Schema.Types.ObjectId, ref:"HomeStay",
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

});

const reviewModel = model<Review>("Review", reviewSchema);

export default reviewModel;
