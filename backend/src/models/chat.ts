import mongoose, { Document } from "mongoose";
import { ChatType } from "../shared/types";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model<ChatType>("Chat", chatSchema);

export default Chat;
