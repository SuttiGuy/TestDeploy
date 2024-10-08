import { Schema, model, Document } from "mongoose";

export interface Chat extends Document {
  userId?: string;
  businessId?: string;
  adminId?: string;
  messages: Message[];
  isClosed: boolean;
}

export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}

const ChatSchema = new Schema<Chat>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  businessId: { type: Schema.Types.ObjectId, ref: "Business" },
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
  messages: [
    {
      sender: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  isClosed: { type: Boolean, default: false },
});

const ChatModel = model<Chat>("Chat", ChatSchema);
export default ChatModel;
