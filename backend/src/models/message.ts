import mongoose from "mongoose";
import { MessageType } from "../shared/types";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

const Message = mongoose.model<MessageType>("Message", messageSchema);

export default Message;
