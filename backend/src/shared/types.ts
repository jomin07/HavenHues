import mongoose from "mongoose";

export type CouponType = {
  _id: string;
  name: string;
  description: string;
  startingDate: Date;
  expiryDate: Date;
  minimumAmount: number;
  discount: number;
  discountType: string;
  maxDiscount?: number;
  status: boolean;
  limit: number;
  users: string[];
};

export type WalletHistoryType = {
  date: Date;
  amount: number;
  message: string;
};

export type HotelType = {
  _id: string;
  userID: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  extraBedCount: number;
  extraBedCharge: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
  approvalStatus: string;
  isBlocked: boolean;
  latitude: number;
  longitude: number;
};

export type BookingType = {
  _id: string;
  userID: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  age: number;
  gender: string;
  adultCount: number;
  childCount: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  extraBedCount: number;
  status: string;
  cancellationReason?: string;
  discountObtained: number;
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};

export type UserType = {
  userID: any;
  _id: string;
  email: string;
  mobile: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  wallet: number;
  walletHistory: WalletHistoryType[];
  referralCode: string;
  isReferred: boolean;
  subscriptionPlan: string;
};

export type ChatType = {
  _id: string;
  chatName: string;
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
};

export type MessageType = {
  _id: string;
  sender: mongoose.Types.ObjectId;
  content: string;
  chat: mongoose.Types.ObjectId;
};
