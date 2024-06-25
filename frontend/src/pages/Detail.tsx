import { useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import Loader from "../components/Loader";
import { useChatContext } from "../contexts/ChatContext";

const Detail = () => {
  const { hotelID } = useParams();
  const { user } = useChatContext();

  const { data: hotel, isLoading } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelID || ""),
    {
      enabled: !!hotelID,
    }
  );

  const navigate = useNavigate();

  const handleChat = () => {
    navigate("/chats", { state: { userId: hotel.userID } });
  };

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map(() => (
              <AiFillStar className="fill-yellow-400" />
            ))}
          </span>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="text-sm font-normal my-1">
            {hotel.city}, {hotel.country}
          </div>
        </div>

        {user && user.userID !== hotel.userID && (
          <button
            className="bg-blue-600 rounded-md text-white h-full font-bold hover:bg-blue-500 text-base px-3 py-2"
            onClick={handleChat}
          >
            Chat with Manager
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {hotel.facilities.map((facility) => (
          <div className="border border-slate-300 rounded-sm p-3">
            {facility}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
        <div className="whitespace-pre-line">{hotel.description}</div>
        <div className="h-fit">
          <GuestInfoForm
            hotelID={hotel._id}
            maxAdultCount={hotel.adultCount}
            pricePerNight={hotel.pricePerNight}
            extraBedCount={hotel.extraBedCount}
            extraBedCharge={hotel.extraBedCharge}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
