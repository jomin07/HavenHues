import React, { useState, useEffect } from "react";
import { fetchHotels } from "../api-client";

const HomePage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const hotelData = await fetchHotels();
        setHotels(hotelData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Popular Hotels</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="border border-gray-200 rounded p-4 flex">
              <div className="w-1/2 p-4">
                <img
                  src={hotel.imageUrls[0]} // Assuming the first image URL is used as the main image
                  alt={hotel.name}
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="w-1/2 p-8">
                <h2 className="text-lg font-semibold mb-2">{hotel.name}</h2>
                <p className="text-sm text-gray-600 mb-4">{hotel.description}</p>
                <div className="mb-4">
                  <strong>City:</strong> {hotel.city}
                </div>
                <div className="mb-4">
                  <strong>Country:</strong> {hotel.country}
                </div>
                <div className="mb-4">
                  <strong>Price per Night:</strong> ₹{hotel.pricePerNight}
                </div>
                {/* Render other hotel details as needed */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
