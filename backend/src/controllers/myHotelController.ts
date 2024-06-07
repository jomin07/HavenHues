import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

export const createHotel = async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[];
        const newHotel: HotelType = req.body;

        const imageUrls = await uploadImages(imageFiles);
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userID = req.userID;

        if (req.body.extraBedCount) {
            newHotel.extraBedCount = parseInt(req.body.extraBedCount, 10);
        }
        if (req.body.extraBedCharge) {
            newHotel.extraBedCharge = parseFloat(req.body.extraBedCharge);
        }


        const hotel = new Hotel(newHotel);
        await hotel.save();

        res.status(201).send(hotel);

    } catch (error) {
        console.log("Error creating hotel: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userID: req.userID });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
};

export const getHotelDetails = async( req: Request, res: Response ) =>{
    const id = req.params.id.toString();
    try {
        const hotel = await Hotel.findOne({
            _id: id,
            userID: req.userID
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Hotel Details" });
    }
}

export const updateHotelDetails = async(req: Request, res: Response) =>{
    try {
        const updatedHotel:HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate(
            {
            _id: req.params.hotelID,
            userID: req.userID
            },
            updatedHotel,
            { new: true }
        );

        if(!hotel){
            return res.status(404).json({ message: "Hotel Not Found" });
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls,...(updatedHotel.imageUrls || [])];

        await hotel.save();
        return res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error updating hotel details" })
    }
}

async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}

export const getHotelBookings = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
  
    try {
      const hotel = await Hotel.findById(hotelId).populate('bookings');
      console.log(`Hotel found: ${hotel}`);
  
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      res.json(hotel.bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bookings' });
    }
};

