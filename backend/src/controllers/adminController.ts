import { Request, Response } from "express";
import User from "../models/user";
import Coupon from "../models/coupon";
import { CouponType } from "../shared/types";

export const getUsers = async (req: Request, res: Response) =>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({ isAdmin: false })
                                .skip(skip)
                                .limit(limit)
                                .exec();

        const totalUsers = await User.countDocuments({ isAdmin: false });

        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
    }
}

export const toggleUserStatus = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the user's blocked status
        user.isBlocked = !user.isBlocked;
        
        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCoupons = async (req: Request, res: Response) =>{
    try {
        const coupons = await Coupon.find();
        res.status(200).send(coupons);
    } catch (error) {
        console.log(error);
    }
}

export const addCoupon = async (req: Request, res: Response) =>{
    try {
        const newCoupon: CouponType = req.body;

        const coupon = new Coupon(newCoupon);
        await coupon.save();
        
        res.status(201).send(coupon);
    } catch (error) {
        console.log(error);
    }
}

export const getCouponById = async (req: Request, res: Response) =>{
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).send({ message: "Coupon not found" });
        }
        res.status(200).send(coupon);
    } catch (error) {
        console.log(error);
    }
}

export const updateCouponById = async (req: Request, res: Response) =>{
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) {
            return res.status(404).send({ message: "Coupon not found" });
        }
        res.status(200).send(coupon);
    } catch (error) {
        console.log(error);
    }
}