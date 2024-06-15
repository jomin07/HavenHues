import mongoose from "mongoose";
import { CouponType } from "../shared/types";

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    startingDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    minimumAmount: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discountType: {
        type: String,
        required: true,
    },
    maxDiscount: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: true,
    },
    limit: {
        type: Number,
        required: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const Coupon = mongoose.model<CouponType>("Coupon", couponSchema);

export default Coupon;