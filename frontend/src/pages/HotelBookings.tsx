import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import * as apiClient from "../api-client";
import CancelReasonModal from "../components/modals/CancelReasonModal";
import Loader from "../components/Loader";
import { BookingType } from "../../../backend/src/shared/types";

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
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Bookings for Hotel</h1>
      <div className="grid grid-cols-1 gap-8">
        {bookings.length === 0 ? (
          <span>No bookings found.</span>
        ) : (
          bookings.map((booking: BookingType) => (
            <div
              key={booking._id}
              className="border border-slate-300 rounded-lg p-8 gap-5"
            >
              <h2 className="text-2xl font-bold">
                {booking.firstName} {booking.lastName}
              </h2>
              <p>Email: {booking.email}</p>
              <p>Check-In: {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p>
                Check-Out: {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p>Adults: {booking.adultCount}</p>
              <p>Children: {booking.childCount}</p>
              <p>Total Cost: ₹{booking.totalCost}</p>
              <p>Status: {booking.status}</p>
              {booking.status === "Cancel Pending" && (
                <div>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 my-3 rounded"
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
