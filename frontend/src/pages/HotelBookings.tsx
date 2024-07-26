import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import * as apiClient from "../api-client";
import CancelReasonModal from "../components/modals/CancelReasonModal";
import Loader from "../components/Loader";
import { BookingType } from "../shared/types";
import { FaCalendarAlt, FaChild, FaEnvelope, FaUsers } from "react-icons/fa";

const HotelBookings = () => {
  const { hotelId } = useParams();
  const queryClient = useQueryClient();
  const {
    data: bookings,
    error,
    isLoading,
  } = useQuery(["fetchHotelBookings", hotelId], () =>
    apiClient.fetchHotelBookings(hotelId)
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(
    null
  );

  const handleAcceptCancellation = useMutation(
    async (bookingID: string) => {
      await apiClient.handleCancellationRequest(bookingID, "accept");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchHotelBookings", hotelId]);
      },
    }
  );

  const handleRejectCancellation = useMutation(
    async (bookingID: string) => {
      await apiClient.handleCancellationRequest(bookingID, "reject");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchHotelBookings", hotelId]);
      },
    }
  );

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (error) {
    return <span>Error fetching bookings</span>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 rounded-lg shadow-lg">
        Hotel Bookings
      </h1>
      <div className="grid grid-cols-1 gap-8">
        {bookings.length === 0 ? (
          <span className="text-center text-gray-500">No bookings found.</span>
        ) : (
          bookings.map((booking: BookingType) => (
            <div
              key={booking._id}
              className="border border-gray-300 rounded-lg p-6 shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-2">
                {booking.firstName} {booking.lastName}
              </h2>
              <div className="mb-4">
                <p className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  Email: {booking.email}
                </p>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Check-In: {new Date(booking.checkIn).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Check-Out: {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <p className="flex items-center">
                  <FaUsers className="mr-2" />
                  Adults: {booking.adultCount}
                </p>
                <p className="flex items-center">
                  <FaChild className="mr-2" />
                  Children: {booking.childCount}
                </p>
                <p className="text-lg font-semibold mt-2">
                  Total Cost: ₹{booking.totalCost}
                </p>
              </div>
              <p
                className={`font-bold text-lg ${
                  booking.status === "Cancel Pending"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                Status: {booking.status}
              </p>
              {booking.status === "Cancel Pending" && (
                <div className="mt-4">
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    View Cancellation Reason
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedBooking && (
        <CancelReasonModal
          isOpen={Boolean(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onAccept={() => handleAcceptCancellation.mutate(selectedBooking._id)}
          onReject={() => handleRejectCancellation.mutate(selectedBooking._id)}
        />
      )}
    </div>
  );
};

export default HotelBookings;
