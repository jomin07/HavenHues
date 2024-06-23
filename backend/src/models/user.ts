import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserType } from "../shared/types";
import { generateReferralCode } from "../helpers/user/userHelper";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  wallet: { type: Number, default: 0 },
  walletHistory: [
    {
      date: { type: Date },
      amount: { type: Number },
      message: { type: String },
    },
  ],
  referralCode: { type: String, unique: true },
  isReferred: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
