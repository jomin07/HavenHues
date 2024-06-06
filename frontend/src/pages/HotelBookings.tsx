// HotelBookings.js
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';

const HotelBookings = () => {
  const { hotelId } = useParams();
  const { data: bookings, error, isLoading } = useQuery(['fetchHotelBookings', hotelId], () => apiClient.fetchHotelBookings(hotelId));

  if (isLoading) {
    return <span>Loading...</span>;
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
          bookings.map((booking) => (
            <div key={booking._id} className="border border-slate-300 rounded-lg p-8 gap-5">
              <h2 className="text-2xl font-bold">{booking.firstName} {booking.lastName}</h2>
              <p>Email: {booking.email}</p>
              <p>Check-In: {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p>Check-Out: {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p>Adults: {booking.adultCount}</p>
              <p>Children: {booking.childCount}</p>
              <p>Total Cost: ₹{booking.totalCost}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelBookings;
