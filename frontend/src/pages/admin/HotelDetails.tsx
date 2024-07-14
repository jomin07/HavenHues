import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { HotelType } from "../../shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/admin/hotels/${id}`)
      .then((response) => setHotel(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const approveHotel = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/hotels/${id}/approve`);
      navigate("/admin/hotels");
    } catch (error) {
      console.error("Error approving hotel:", error);
    }
  };

  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">{hotel.name}</h1>
        <button
          onClick={() => navigate("/admin/hotels")}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-400"
        >
          Back to Hotel List
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {hotel.imageUrls.map((image) => (
            <div className="h-[300px]">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold">Name</label>
          <p className="bg-gray-200 p-2 rounded">{hotel.name}</p>
        </div>
        <div className="mb-6 flex-1">
          <label className="block text-gray-700 font-bold">Description</label>
          <p className="bg-gray-200 p-2 rounded">{hotel.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold">City</label>
              <p className="bg-gray-200 p-2 rounded">{hotel.city}</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Price Per Night
              </label>
              <p className="bg-gray-200 p-2 rounded">₹{hotel.pricePerNight}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Adult Count
              </label>
              <p className="bg-gray-200 p-2 rounded">{hotel.adultCount}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Extra Bed Count
              </label>
              <p className="bg-gray-200 p-2 rounded">{hotel.extraBedCount}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold">Type</label>
              <p className="bg-gray-200 p-2 rounded">{hotel.type}</p>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold">Country</label>
              <p className="bg-gray-200 p-2 rounded">{hotel.country}</p>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Star Rating
              </label>
              <p className="bg-gray-200 p-2 rounded">{hotel.starRating}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Child Count
              </label>
              <p className="bg-gray-200 p-2 rounded">{hotel.childCount || 0}</p>
            </div>

            {hotel.extraBedCount > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-bold">
                  Extra Bed Charge
                </label>
                <p className="bg-gray-200 p-2 rounded">
                  ₹{hotel.extraBedCharge}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 font-bold">
                Approval Status
              </label>
              <p className="bg-gray-200 p-2 rounded">{hotel.approvalStatus}</p>
            </div>
          </div>
        </div>

        <label className="block text-gray-700 font-bold">Facilities</label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {hotel.facilities.map((facility) => (
            <div className="border border-slate-300 rounded-sm p-3">
              {facility}
            </div>
          ))}
        </div>
        {hotel.approvalStatus === "Pending" && (
          <div className="mt-8 flex justify-center">
            <button
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
              onClick={approveHotel}
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetails;
