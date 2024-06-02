import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

export const getMyBookings = async (req: Request, res: Response) =>{
    try {
        const hotels = await Hotel.find({
            bookings: { $elemMatch: { userID: req.userID }}
        });

        const results = hotels.map((hotel) =>{
            const userBookings = hotel.bookings.filter(
                (booking) => booking.userID === req.userID
            );
            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings
            }

            return hotelWithUserBookings;
        });
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Unable to fetch bookings" });
    }
}