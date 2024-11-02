import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import { AiFillStar } from "react-icons/ai";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import Loader from "../components/Loader";
import { useChatContext } from "../contexts/ChatContext";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";
import {
  FaWifi,
  FaParking,
  FaShuttleVan,
  FaSwimmingPool,
  FaSpa,
  FaDumbbell,
} from "react-icons/fa";
import { IoLogoNoSmoking } from "react-icons/io5";
import { MdPool } from "react-icons/md";
import { useAppContext } from "../contexts/AppContext";
import EmailModal from "../components/modals/EmailModal";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

type FacilityKey =
  | "Free WiFi"
  | "Parking"
  | "Airport Shuttle"
  | "Indoor Pool"
  | "Non-Smoking"
  | "Outdoor Pool"
  | "Spa"
  | "Fitness Center";

const facilityIcons: Record<FacilityKey, JSX.Element> = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  "Airport Shuttle": <FaShuttleVan />,
  "Indoor Pool": <MdPool />,
  "Non-Smoking": <IoLogoNoSmoking />,
  "Outdoor Pool": <FaSwimmingPool />,
  Spa: <FaSpa />,
  "Fitness Center": <FaDumbbell />,
};

const Detail = () => {
  const { hotelID } = useParams();
  const { showToast } = useAppContext();
  const { user, loading: userLoading, setUser } = useChatContext();
  const [managerEmail, setManagerEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: hotel, isLoading: hotelLoading } = useQuery(
    "fetchHotelById",
    () => apiClient.fetchHotelById(hotelID || ""),
    {
      enabled: !!hotelID,
    }
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [setUser, user]);

  const fetchManagerEmail = async (userID: string) => {
    try {
      const response = await apiClient.fetchManagerById(userID);
      return response.email;
    } catch (error) {
      console.error("Error fetching manager email", error);
      return null;
    }
  };

  const handleGetManagerDetails = async () => {
    if (hotel && !showModal) {
      const email = await fetchManagerEmail(hotel.userID);
      setManagerEmail(email || "Email not found");
      setShowModal(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(managerEmail);
    showToast({ message: "Email copied to clipboard!", type: "SUCCESS" });
    setShowModal(false);
  };

  if (hotelLoading || userLoading) {
    return <Loader loading={true} />;
  }

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-8">
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
          <div className="flex flex-col">
            <button
              className="bg-blue-600 rounded-md text-white font-bold hover:bg-blue-500 text-base px-3 py-2"
              onClick={handleGetManagerDetails}
            >
              Get Manager Email ID
            </button>
          </div>
        )}

        {showModal && (
          <EmailModal
            email={managerEmail}
            onClose={() => setShowModal(false)}
            onCopy={handleCopy}
          />
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
        {hotel.facilities.map((facility) => {
          const icon = facilityIcons[facility as FacilityKey];
          return (
            <div
              key={facility}
              className="border border-slate-300 rounded-sm p-3 flex items-center"
            >
              {icon ?? <span> </span>}
              <span className="ml-2">{facility}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
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

      <div className="lg:p-12">
        <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: hotel.latitude, lng: hotel.longitude }}
            zoom={15}
          >
            <MarkerF position={{ lat: hotel.latitude, lng: hotel.longitude }} />
          </GoogleMap>
        </LoadScriptNext>
      </div>
    </div>
  );
};

export default Detail;
