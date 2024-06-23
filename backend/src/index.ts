import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin";
import adminAuthRoutes from "./routes/adminAuth";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import myBookingsRoutes from "./routes/my-bookings";
import chatRoutes from "./routes/chat";
import messageRoutes from "./routes/message";
import { Server } from "socket.io";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", myBookingsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(7000, () => {
  console.log("Server started!");
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData.userID);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user: { _id: string | string[] }) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
