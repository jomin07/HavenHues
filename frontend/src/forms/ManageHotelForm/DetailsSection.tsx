import { useFormContext, useWatch } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { useEffect, useState } from "react";
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

const DetailsSection = () => {
  const {
    register,
    formState: { errors },
    setValue,
    control,
  } = useFormContext<HotelFormData>();
  const [markerPosition, setMarkerPosition] = useState({
    lat: 10.09345705666358,
    lng: 77.05399237716492,
  });

  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  useEffect(() => {
    if (latitude && longitude) {
      setMarkerPosition({
        lat: latitude,
        lng: longitude,
      });
    }
  }, [latitude, longitude]);

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          type="text"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("name", { required: "This field is required" })}
        ></input>
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>

      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          City
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("city", { required: "This field is required" })}
          ></input>
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Country
          <input
            type="text"
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("country", { required: "This field is required" })}
          ></input>
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Price Per Night
        <input
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("pricePerNight", { required: "This field is required" })}
        ></input>
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-sm font-bold max-w-[50%]">
        Star Rating
        <select
          {...register("starRating", { required: "This field is required" })}
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option value={num}>{num}</option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>

      <div className="flex gap-4">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Latitude
          <input
            type="text"
            step="0.000001"
            readOnly
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("latitude", {
              required: "Mark your location to get the latitude",
            })}
          />
          {errors.latitude && (
            <span className="text-red-500">{errors.latitude.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-bold flex-1">
          Longitude
          <input
            type="text"
            step="0.000001"
            readOnly
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("longitude", {
              required: "Mark your location to get the longitude",
            })}
          />
          {errors.longitude && (
            <span className="text-red-500">{errors.longitude.message}</span>
          )}
        </label>
      </div>

      <label className="text-gray-700 text-sm font-bold flex-1 my-2">
        Location
        <LoadScriptNext googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={markerPosition}
            zoom={8}
            onClick={handleMapClick}
          >
            <MarkerF position={markerPosition} />
          </GoogleMap>
        </LoadScriptNext>
      </label>
    </div>
  );
};

export default DetailsSection;
