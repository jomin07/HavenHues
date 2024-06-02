import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { validationResult } from "express-validator";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const getPaymentIntent = async (req: Request, res: Response) =>{

  const { numberOfNights } = req.body;
  const userID = req.userID;
  const hotelID = req.params.hotelID;

  const hotel = await Hotel.findById(hotelID);
  if (!hotel) {
    return res.status(400).json({ message: "Hotel not found" });
  }

  const totalCostInINR = hotel.pricePerNight * numberOfNights;
  const totalCost = totalCostInINR * 100; // Convert to paise

  const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost,
      currency: "inr",
      metadata: {
        hotelID,
        userID
      }
  });

  if(!paymentIntent.client_secret){
    return res.status(500).json({ message: "Error creating payment intent" });
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost: totalCostInINR
  }

  res.send(response);
}

export const createRoomBooking = async( req: Request, res: Response ) =>{
    try {
        const paymentIntentId = req.body.paymentIntentId;

        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId as string
        );

        if(!paymentIntent){
          console.log("Payment intent not found");
          return res.status(400).json({ message: "Payment intent not found"} );
        }

        if(
          paymentIntent.metadata.hotelID !== req.params.hotelID ||
          paymentIntent.metadata.userID !== req.userID
        ){
          console.log("Payment intent mismatch");
          return res.status(400).json({ message: "Payment intent mismatch" });
        }

        if(paymentIntent.status !== "succeeded"){
          console.log(`Payment intent not succeeded. Status: ${paymentIntent.status}`);
          return res.status(400).json({ message: `Payment intent not succeeded. Status: ${paymentIntent.status}` });
        }

        const newBooking: BookingType = {
          ...req.body,
          userID: req.userID
        }

        console.log("New Booking Object:", newBooking);

        const hotel = await Hotel.updateOne(
          { _id: req.params.hotelID },
          {
            $push: { bookings: newBooking }
          }
        );

        if(!hotel){
          console.log("Hotel not found");
          return res.status(400).json({ message: "Hotel not found" });
        }
        
        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getSearchResults = async( req: Request, res: Response ) =>{
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch(req.query.sortOption){
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
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
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
                pages: Math.ceil(total / pageSize)
            }
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        
    }
}

const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};
  
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

export const getHotelDetails = async(req: Request, res: Response) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching Hotel Details" });
    }
}