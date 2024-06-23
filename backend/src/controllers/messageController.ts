import { Request, Response } from "express";
import Message from "../models/message";
import User from "../models/user";
import Chat from "../models/chat";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.userID,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName");
    message = await message.populate("chat");
    let populatedMessage = await User.populate(message, {
      path: "chat.users",
      select: "firstName email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: populatedMessage,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};
