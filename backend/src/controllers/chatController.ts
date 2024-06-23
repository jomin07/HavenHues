import { Request, Response } from "express";
import { chats } from "../data/data";
import Chat from "../models/chat";
import User from "../models/user";

// export const getChats = async (req: Request, res: Response) => {
//   res.send(chats);
// };

// export const getSingleChat = async (req: Request, res: Response) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// };

export const accessChat = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.userID } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  const populatedChats = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName email",
  });

  if (populatedChats.length > 0) {
    res.send(populatedChats[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.userID, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      console.log(error);
    }
  }
};

export const fetchChats = async (req: Request, res: Response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.userID } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        const populatedChats = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName email",
        });
        res.status(200).send(populatedChats);
      });
  } catch (error) {
    res.status(400);
    console.log(error);
  }
};
