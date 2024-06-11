import { Request, Response } from "express";
import User from "../models/user";
import Coupon from "../models/coupon";
import { CouponType } from "../shared/types";
import Hotel from "../models/hotel";

export const getUsersCount = async (req: Request, res: Response) => {
    try {
      const count = await User.countDocuments();
      res.json({ count });
    } catch (error) {
      res.status(500).send(error);
    }
}
  
export const getHotelsCount = async (req: Request, res: Response) => {
    try {
      const count = await Hotel.countDocuments({ approvalStatus: 'Approved' });
      res.json({ count });
    } catch (error) {
      res.status(500).send(error);
    }
}
  
const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
};

export const getRevenue = async (req: Request, res: Response) => {
    try {
        const bookings = await Hotel.aggregate([
            { $unwind: "$bookings" },
            { $match: { "bookings.status": { $nin: ["Pending", "Cancelled"] } } },
            {
                $group: {
                    _id: {
                        month: { $month: "$bookings.checkIn" },
                        year: { $year: "$bookings.checkIn" }
                    },
                    total: { $sum: "$bookings.totalCost" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total, 0);

        const monthlyRevenue = bookings.map(booking => ({
            month: `${getMonthName(booking._id.month)} ${booking._id.year}`,
            amount: booking.total
        }));

        res.json({ total: totalRevenue, monthly: monthlyRevenue });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getTopBookingHotels = async (req: Request, res: Response) => {
    try {
        const topHotels = await Hotel.aggregate([
            { $unwind: "$bookings" },
            { $match: { "bookings.status": { $nin: ["Pending", "Cancelled"] } } },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    bookingsCount: { $sum: 1 }
                }
            },
            { $sort: { bookingsCount: -1 } },
            { $limit: 5 }
        ]);

        res.json(topHotels);
    } catch (error) {
        res.status(500).send(error);
    }
};

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

export const toggleCouponStatus = async (req: Request, res: Response) => {
    const couponId = req.params.id;

    try {
        
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        coupon.status = !coupon.status;
        
        await coupon.save();

        res.status(200).json({ message: 'Coupon status updated successfully', coupon });
    } catch (error) {
        console.error('Error toggling coupon status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getHotelById = async (req: Request, res: Response) =>{
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send({ message: "Hotel not found" });
        }
        res.status(200).send(hotel);
    } catch (error) {
        console.log(error);
    }
}

export const toggleHotelStatus = async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        hotel.isBlocked = !hotel.isBlocked;
        await hotel.save();
        res.status(200).json({ hotel });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const approveHotel = async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        hotel.approvalStatus = 'Approved';
        await hotel.save();
        res.status(200).json({ hotel });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
