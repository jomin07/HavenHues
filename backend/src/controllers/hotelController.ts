import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { validationResult } from "express-validator";
import Stripe from "stripe";
import Coupon from "../models/coupon";
import User from "../models/user";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const getPaymentIntent = async (req: Request, res: Response) => {
  const { numberOfNights, extraBedCount } = req.body;
  const userID = req.userID;
  const hotelID = req.params.hotelID;

  const hotel = await Hotel.findById(hotelID);
  if (!hotel) {
    return res.status(400).json({ message: "Hotel not found" });
  }

  const extraBedCharge = hotel.extraBedCharge || 0;
  const totalExtraBedCost = extraBedCharge * extraBedCount * numberOfNights;

  const totalCostInINR =
    hotel.pricePerNight * numberOfNights + totalExtraBedCost;

  const totalCost = totalCostInINR * 100; // Convert to paise

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost,
    currency: "inr",
    metadata: {
      hotelID,
      userID,
    },
  });

  if (!paymentIntent.client_secret) {
    return res.status(500).json({ message: "Error creating payment intent" });
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost: totalCostInINR,
  };

  res.send(response);
};

export const createRoomBooking = async (req: Request, res: Response) => {
  try {
    const {
      paymentMethod,
      paymentIntentId,
      totalCost,
      extraBedCount,
      age,
      gender,
      mobile,
    } = req.body;

    const ageAsNumber = parseInt(age, 10);
    if (isNaN(ageAsNumber)) {
      return res.status(400).json({ message: "Age must be a valid number" });
    }

    if (paymentMethod === "wallet") {
      const user = await User.findById(req.userID);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.wallet < totalCost) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      user.wallet -= totalCost;
      user.walletHistory.push({
        date: new Date(),
        amount: -totalCost,
        message: "Room booking payment",
      });
      await user.save();

      const newBooking: BookingType = {
        ...req.body,
        age: ageAsNumber,
        userID: req.userID,
        status: "Completed",
      };

      const hotel = await Hotel.updateOne(
        { _id: req.params.hotelID },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        console.log("Hotel not found");
        return res.status(400).json({ message: "Hotel not found" });
      }

      res.status(200).send();
    } else {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        console.log("Payment intent not found");
        return res.status(400).json({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.hotelID !== req.params.hotelID ||
        paymentIntent.metadata.userID !== req.userID
      ) {
        console.log("Payment intent mismatch");
        return res.status(400).json({ message: "Payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        console.log(
          `Payment intent not succeeded. Status: ${paymentIntent.status}`
        );
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        age: ageAsNumber,
        userID: req.userID,
        status: "Completed",
      };

      const hotel = await Hotel.updateOne(
        { _id: req.params.hotelID },
        {
          $push: { bookings: newBooking },
        }
      );

      if (!hotel) {
        console.log("Hotel not found");
        return res.status(400).json({ message: "Hotel not found" });
      }

      res.status(200).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAvailableCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find({ status: true });
    res.json(coupons);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching available coupons" });
  }
};

export const applyCoupon = async (req: Request, res: Response) => {
  const { couponCode, paymentIntentId, hotelID } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      return res.status(400).json({ message: "Invalid payment intent" });
    }

    const coupon = await Coupon.findOne({ name: couponCode, status: true });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (!hotelID) {
      return res.status(400).json({ message: "Hotel ID is required" });
    }

    let totalCostInINR = paymentIntent.amount / 100;

    if (totalCostInINR < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Total cost must be at least ${coupon.minimumAmount} to use this coupon`,
      });
    }

    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (totalCostInINR * coupon.discount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "number") {
      discountAmount = coupon.discount;
    }

    totalCostInINR -= discountAmount;

    const newAmount = totalCostInINR * 100; // Convert to paise

    const updatedPaymentIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        amount: newAmount,
      }
    );

    await Coupon.updateOne(
      { name: couponCode, status: true },
      {
        $push: { users: req.userID },
        $inc: { limit: -1 },
      }
    );

    res.json({
      paymentIntentId: updatedPaymentIntent.id,
      clientSecret: updatedPaymentIntent.client_secret,
      totalCost: totalCostInINR,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to apply coupon" });
  }
};

export const getSearchResults = async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ error: "Check-in and check-out dates are required" });
    }

    const checkInDate = new Date(checkIn.toString());
    const checkOutDate = new Date(checkOut.toString());

    // Add a condition to exclude hotels with overlapping bookings on selected dates
    query["bookings"] = {
      $not: {
        $elemMatch: {
          $or: [
            { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
            { checkOut: { $lte: checkOutDate, $gt: checkInDate } },
            {
              checkIn: { $lte: checkInDate },
              checkOut: { $gte: checkOutDate },
            },
          ],
        },
      },
    };

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      approvalStatus: "Approved",
      isBlocked: false,
    }).sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const getHotelDetails = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Hotel Details" });
  }
};

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {
    approvalStatus: "Approved",
    isBlocked: false,
  };

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export const getBookedDates = async (req: Request, res: Response) => {
  const { hotelID } = req.params;

  try {
    const hotel = await Hotel.findById(hotelID);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const bookedDates = hotel.bookings.map((booking) => ({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    }));

    console.log("Booked Dates: ", bookedDates);

    res.json(bookedDates);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
